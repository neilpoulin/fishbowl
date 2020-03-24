import { BaseModel, Collection, FirestoreData } from "@shared/models/Model";
import { DocumentSnapshot } from "@shared/util/FirestoreUtil";
import Player from "@shared/models/Player";
import Logger from "@shared/Logger";
import { shuffleArray } from "@shared/util/ObjectUtil";

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

    remainingWordsInRound: WordEntry[] = [];
    currentTeam = 0;
    currentPlayerByTeam: { [team: number]: string } = {};

    scores: { [team: number]: number } = {};

    isPlaying = false;
    turnEndsAt: Date | undefined | null;
    turnStartsAt: Date | undefined | null;

    get playersList(): Player[] {
        return Object.values(this.players);
    }

    incrementScore(team: number) {
        this.scores[team] = (this.scores[team] ?? 0) + 1;
    }

    allPlayersInPhase(phase: Phase): boolean {
        return this.playersList.some(p => p.phase !== phase);
    }

    startTurn() {
        if (this.remainingWordsInRound.length === 0) {
            this.moveToNextRound();
            return;
        }

        this.isPlaying = true;
        const countdown = 10000;
        this.turnStartsAt = new Date(Date.now() + countdown);
        this.turnEndsAt = new Date(Date.now() + 2 * 60 * 1000 + countdown);
    }

    endTurn() {
        logger.info("Ending turn");
        this.isPlaying = false;
        this.turnEndsAt = null;
        this.turnStartsAt = null;

        this.updateNextTeams();
    }

    completeWord(wordEntry: WordEntry) {
        logger.info("Completing word ", wordEntry);
        this.remainingWordsInRound = [...this.remainingWordsInRound].filter(
            w => wordEntry.word !== w.word || w.userId !== wordEntry.userId
        );
    }

    addWord(wordEntry: WordEntry): boolean {
        const _word = wordEntry.word.toLowerCase().toLowerCase();
        const existing = this.words.find(w => {
            return (
                w.userId === wordEntry.userId &&
                w.word.toLowerCase().trim() === _word
            );
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

    getWordsForUser(userId: string): WordEntry[] {
        return this.words.filter(w => w.userId === userId);
    }

    removePlayer(userId: string) {
        delete this.players[userId];
    }

    getPlayer(userId: string): Player | undefined {
        return this.players[userId];
    }

    updateNextTeams() {
        const currentTeam = this.currentTeam;
        let nextTeam = currentTeam + 1;
        if (nextTeam >= this.numberOfTeams) {
            nextTeam = 0;
        }
        this.currentTeam = nextTeam;
        Object.keys(this.currentPlayerByTeam)
            .map(Number)
            .forEach(team => {
                const userId = this.currentPlayerByTeam[team];
                const playersOnTeam = Object.values(this.players).filter(
                    p => p.team === team
                );
                const currentIndex = playersOnTeam.findIndex(
                    p => p.userId === userId
                );
                const nextIndex = Math.min(
                    playersOnTeam.length - 1,
                    Math.max(0, currentIndex + 1)
                );
                const nextPlayer = playersOnTeam[nextIndex];
                this.currentPlayerByTeam[team] = nextPlayer.userId;
            });
    }

    moveToNextRound() {
        this.remainingWordsInRound = shuffleArray([...this.words]);
        this.round = this.round + 1;
    }

    static fromData(data: FirestoreData): Game {
        return super.create(data, Game);
    }

    static fromSnapshot(snapshot: DocumentSnapshot): Game {
        const id = snapshot.id;
        const data = snapshot.data() || {};
        return super.create(data, Game, id);
    }
}
