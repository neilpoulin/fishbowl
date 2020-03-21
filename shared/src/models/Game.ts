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

export class Game extends BaseModel {
    readonly collection = Collection.games;
    name?: string;
    phase: Phase = Phase.SETUP;
    players: { [userId: string]: Player } = {};

    words: WordEntry[] = [];

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

    static fromData(data: FirestoreData): Game {
        return super.create(data, Game);
    }

    static fromSnapshot(snapshot: DocumentSnapshot): Game {
        const id = snapshot.id;
        const data = snapshot.data() || {};
        return super.create(data, Game, id);
    }
}
