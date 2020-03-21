import { BaseModel, Collection } from "@shared/models/Model"
import { DocumentSnapshot } from "@shared/util/FirestoreUtil";

export class Game extends BaseModel {
  readonly collection = Collection.games;

  id!: string;
  name?: string;

  static fromData(data: Record<string, any>): Game {
    return super.create(data, Game);
  }

  static fromSnapshot(snapshot: DocumentSnapshot): Game {
    const id = snapshot.id;
    const data = snapshot.data() || {};
    return super.create(data, Game, id);
  }
}