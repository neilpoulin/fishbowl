import { convertDateToTimestamp } from "@shared/util/FirestoreUtil";

export enum Collection {
  games = "games"
}

export interface Model {
  readonly collection: Collection;
}

export abstract class BaseModel implements Model {
  abstract readonly collection: Collection;

  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  static create<T extends Model>(data: Record<string, any>, Type: { new(): T }, id?: string): T {
    if (id) {
      data.id = id;
    }
    const m = Object.assign(new Type(), data);

    m.prepareFromFirestore(data);
    return m;
  }

  prepareFromFirestore(data: Record<string, any>) {
    return this;
  }

  data(removeKeys = ["id", "collection"]): Record<string, any> {
    const data = convertDateToTimestamp(this);
    if (removeKeys && data) {
      removeKeys.forEach(key => {
        delete data[key];
      });
    }

    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });

    return data;
  }
}
