import { BaseModel, Collection, FirestoreData } from "@shared/models/Model";
import { DocumentSnapshot } from "@shared/util/FirestoreUtil";
import Player from "@shared/models/Player";

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

    turnEndsAt: Date | undefined;

    completeWord(wordEntry: WordEntry, userId: string) {
        const player = this.players[userId];
        const team = player.team;
        if (team === undefined) {
            return;
        }
        const updatedWords = [
            ...this.remainingWordsInRound.filter(
                w => wordEntry.word !== w.word && w.userId !== wordEntry.userId
            )
        ];
        if (updatedWords.length < this.remainingWordsInRound.length) {
            this.scores[team] = (this.scores[team] ?? 0) + 1;
        }
        this.remainingWordsInRound = updatedWords;
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

    getCurrentWord(): WordEntry {
        const length = this.remainingWordsInRound.length;
        return this.remainingWordsInRound[Math.floor(Math.random() * length)];
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
        if (nextTeam > this.numberOfTeams) {
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

    static fromData(data: FirestoreData): Game {
        return super.create(data, Game);
    }

    static fromSnapshot(snapshot: DocumentSnapshot): Game {
        const id = snapshot.id;
        const data = snapshot.data() || {};
        return super.create(data, Game, id);
    }
}
