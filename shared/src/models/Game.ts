import { BaseModel, Collection, FirestoreData } from "@shared/models/Model";
import { DocumentSnapshot } from "@shared/util/FirestoreUtil";
import Player from "@shared/models/Player";
import Logger from "@shared/Logger";
import { isNull, isString, shuffleArray } from "@shared/util/ObjectUtil";
import { assignTeams } from "@shared/util/GameUtil";

export interface WordEntry {
    word: string;
    userId: string;
}

export enum Phase {
    SETUP = 0,
    IN_PROGRESS = 1,
    FINISHED = 2
}

enum Field {
    phase = "phase",
    players = "players",
    round = "round"
}

export const ROUND_DURATION_SECONDS = 60;
export const COUNTDOWN_DURATION_SECONDS = 5;

interface TurnResult {
    userId: string;
    wordsCompleted: WordEntry[];
    turn: number;
    round: number;
}

const logger = new Logger("Game.ts");

export class Game extends BaseModel {
    readonly collection = Collection.games;
    static Field = Field;
    name?: string;
    phase: Phase = Phase.SETUP;
    numberOfTeams = 2;
    players: { [userId: string]: Player } = {};
    words: WordEntry[] = [];
    round = 0;
    turn = 0;
    turnResults: { [turnKey: string]: TurnResult } = {};

    remainingWordsInRound: WordEntry[] = [];
    currentTeam = 0;
    currentPlayerByTeam: { [team: number]: string } = {};

    scores: { [team: number]: number } = {};

    isPlaying = false;
    turnEndsAt: Date | undefined | null;
    turnStartsAt: Date | undefined | null;

    videoChatUrl: string | undefined;

    get turnKey(): string {
        return `${this.round}:${this.turn}`;
    }

    get currentTurnResult(): TurnResult | undefined {
        const result = this.turnResults[this.turnKey] as TurnResult | undefined;
        if (result) {
            return result;
        }

        const currentUserId = this.currentPlayer?.userId;
        if (!currentUserId) {
            return undefined;
        }
        return { userId: currentUserId, turn: this.turn, round: this.round, wordsCompleted: [] };
    }

    set currentTurnResult(turnResult: TurnResult | undefined) {
        if (!turnResult) {
            return;
        }

        const turnKey = this.turnKey;
        this.turnResults[turnKey] = turnResult;
    }

    get playersList(): Player[] {
        return Object.values(this.players);
    }

    get nextTeam(): number {
        const current = this.currentTeam;
        if (current + 1 >= this.numberOfTeams) {
            return 0;
        }
        return current + 1;
    }

    get currentPlayer(): Player | undefined {
        const team = this.currentTeam;
        const playerId = this.currentPlayerByTeam[team];
        if (isString(playerId)) {
            return this.getPlayer(playerId);
        }
        return undefined;
    }

    /**
     * Returns a sorted list of players by team, sorted by userId
     * @param {number} team
     * @return {Player[]}
     */
    playersInTeam(team: number): Player[] {
        const players = this.playersList.filter(p => p.team === team);
        players.sort((p1, p2) => {
            return p1.userId.localeCompare(p2.userId);
        });
        return players;
    }

    incrementScore(userId: string) {
        const player = this.getPlayer(userId);
        const team = player?.team;
        if (team !== undefined && team !== null) {
            this.scores[team] = (this.scores[team] ?? 0) + 1;
        }

        player?.incrementScore();
    }

    allPlayersInPhase(phase: Phase): boolean {
        return !this.playersList.some(p => p.phase !== phase);
    }

    startTurn() {
        if (this.remainingWordsInRound.length === 0) {
            this.moveToNextRound();
            return;
        }
        this.turn += 1;
        this.shuffleWordsRemaining();
        this.isPlaying = true;

        this.turnStartsAt = new Date(Date.now() + COUNTDOWN_DURATION_SECONDS * 1000);
        this.turnEndsAt = new Date(Date.now() + (ROUND_DURATION_SECONDS + COUNTDOWN_DURATION_SECONDS) * 1000);
    }

    endTurn() {
        logger.info("Ending turn");
        this.isPlaying = false;
        this.turnEndsAt = null;
        this.turnStartsAt = null;
        this.updateNextTeams();
    }

    shuffleWordsRemaining() {
        this.remainingWordsInRound = shuffleArray(this.remainingWordsInRound);
    }

    /**
     * remove the word from the array of remaining words.
     * @param {WordEntry} wordEntry
     * @return {boolean} true if the word was removed, false if it was not.
     */
    completeWord(wordEntry: WordEntry): boolean {
        logger.info("Completing word ", wordEntry);
        const startingCount = this.remainingWordsInRound.length;
        this.remainingWordsInRound = [...this.remainingWordsInRound].filter(
            w => wordEntry.word !== w.word || w.userId !== wordEntry.userId
        );
        const endingCount = this.remainingWordsInRound.length;
        return endingCount < startingCount;
    }

    addWord(wordEntry: WordEntry): boolean {
        const _word = wordEntry.word.toLowerCase().toLowerCase();
        const existing = this.words.find(w => {
            return w.userId === wordEntry.userId && w.word.toLowerCase().trim() === _word;
        });
        if (existing) {
            return false;
        }

        this.words.push(wordEntry);

        return true;
    }

    getActivePlayer(): Player | undefined {
        const team = this.currentTeam;
        const currentPlayerId = this.currentPlayerByTeam[team];
        if (!currentPlayerId) {
            return Object.values(this.players).find(p => p.team === team);
        }

        return this.players[currentPlayerId];
    }

    getCurrentWord(): WordEntry | undefined {
        if (this.remainingWordsInRound.length > 0) {
            return this.remainingWordsInRound[0];
        }
        return undefined;
    }

    /**
     * Adds a player to this game.
     * @param {Player} player
     */
    addPlayer(player: Player) {
        this.players[player.userId] = player;
    }

    getWordsForUser(userId?: string): WordEntry[] {
        if (!userId) {
            return [];
        }
        return this.words.filter(w => w.userId === userId);
    }

    removePlayer(userId: string) {
        const updatedPlayers = { ...this.players };
        delete updatedPlayers[userId];
        this.players = updatedPlayers;
    }

    getPlayer(userId: string): Player | undefined {
        return this.players[userId];
    }

    updateNextTeams() {
        const nextPlayer = this.getNextPlayerForTeam(this.currentTeam);
        if (nextPlayer) {
            this.currentPlayerByTeam[this.currentTeam] = nextPlayer?.userId;
        }
        this.currentTeam = this.nextTeam;
    }

    getNextPlayerForTeam(team: number): Player | undefined {
        const currentUserId = this.currentPlayerByTeam[team] as string | undefined;
        if (!currentUserId) {
            return;
        }
        const players = this.playersInTeam(team);
        const currentIndex = players.findIndex(p => p.userId === currentUserId);
        let nextIndex = currentIndex + 1;
        if (nextIndex > players.length - 1) {
            nextIndex = 0;
        }
        if (nextIndex <= players.length && players.length > 0) {
            return players[nextIndex];
        }
        return;
    }

    /**
     * Set up the current player object
     * @return {number} The number of teams that were updated.
     */
    initializeCurrentPlayers(): number {
        if (!this.currentPlayerByTeam) {
            this.currentPlayerByTeam = {};
        }
        let count = 0;
        for (let team = 0; team < this.numberOfTeams; team++) {
            const currentUserId = this.currentPlayerByTeam[team];
            if (!isNull(currentUserId)) {
                continue;
            }
            const playersOnTeam = this.playersInTeam(team);
            if (playersOnTeam.length > 0) {
                const nextPlayer = playersOnTeam[0];
                this.currentPlayerByTeam[team] = nextPlayer.userId;
                count++;
            }
        }
        return count;
    }

    /**
     * Figure out who is the current player on each team and assign it to the currentPlayerByTeam Object
     */
    updateCurrentPlayers() {
        for (let team = 0; team < this.numberOfTeams; team++) {
            const currentUserId = this.currentPlayerByTeam[team];
            const playersOnTeam = this.playersInTeam(team);
            const currentIndex = playersOnTeam.findIndex(p => p.userId === currentUserId);
            // const nextIndex = Math.min(playersOnTeam.length - 1, Math.max(0, currentIndex + 1));
            const nextIndex = Math.min(playersOnTeam.length - 1, currentIndex + 1);
            const nextPlayer = playersOnTeam[nextIndex];
            this.currentPlayerByTeam[team] = nextPlayer.userId;
        }
    }

    moveToNextRound() {
        this.remainingWordsInRound = shuffleArray([...this.words]);
        this.round = this.round + 1;
        this.turn = 0;
    }

    allPlayersReadyForNextPhase(): boolean {
        return !this.playersList.some(p => p.phase <= this.phase);
    }

    /**
     * Move to the next phase, if able
     * @return {boolean} if the game moved to the next phase or not
     */
    nextPhase(): boolean {
        switch (this.phase) {
            case Phase.SETUP:
                // const foundNotReady = this.playersList.some(p => p.phase === Phase.SETUP);

                if (this.playersList.length < 2 || !this.allPlayersReadyForNextPhase()) {
                    return false;
                }
                this.remainingWordsInRound = shuffleArray([...this.words]);
                this.phase = Phase.IN_PROGRESS;
                return true;
            case Phase.IN_PROGRESS:
                // this.phase = Phase.FINISHED;
                return false;
            case Phase.FINISHED:
                return false;
        }
    }

    wordsByUser(userId: string): WordEntry[] {
        return this.words.filter(w => w.userId === userId);
    }

    restart() {
        this.phase = Phase.SETUP;
        this.round = 0;
        this.playersList.forEach(p => {
            p.reset();
        });

        this.scores = {};
        this.currentTeam = 0;
        this.remainingWordsInRound = [];
        this.words = [];
        this.isPlaying = false;
        this.turnStartsAt = undefined;
        this.turnEndsAt = undefined;
        this.currentPlayerByTeam = {};
    }

    static fromData(data: FirestoreData): Game {
        return super.create(data, Game);
    }

    /**
     * Assign players to teams. This will also set up the current player map.
     * @return {number} The number of players that were assigned teams.
     */
    assignTeams(): { playersAssigned: number; numTeamsAssigned: number } {
        let numberAssigned = 0;
        let numTeamsAssigned = 0;
        if (this.phase === Phase.IN_PROGRESS) {
            numberAssigned = assignTeams(this);
            numTeamsAssigned = this.initializeCurrentPlayers();
        }
        return { playersAssigned: numberAssigned, numTeamsAssigned };
    }

    prepareFromFirestore(data: FirestoreData) {
        super.prepareFromFirestore(data);
        this.players = this.playersList.reduce((map: { [id: string]: Player }, player) => {
            const p = new Player(player.userId);
            map[player.userId] = Object.assign(p, player);

            return map;
        }, {});
    }

    static fromSnapshot(snapshot: DocumentSnapshot): Game {
        const id = snapshot.id;
        const data = snapshot.data() || {};
        return super.create(data, Game, id);
    }
}
