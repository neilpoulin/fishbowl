import { BaseModel, Collection, FirestoreData } from "@shared/models/Model";
import { DocumentSnapshot } from "@shared/util/FirestoreUtil";
import { Player } from "@shared/models/Player";

export class Game extends BaseModel {
    readonly collection = Collection.games;
    name?: string;

    players: { [userId: string]: Player } = {};

    /**
     * Adds a player to this game.
     * @param {Player} player
     */
    addPlayer(player: Player) {
        this.players[player.userId] = player;
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
