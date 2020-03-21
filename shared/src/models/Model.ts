import { toFirestoreData } from "@shared/util/FirestoreUtil";

export enum Collection {
    games = "games"
}

// eslint-disable-next-line
export type FirestoreData = Record<string, any>;

export interface Model {
    readonly collection: Collection;
}

export abstract class BaseModel implements Model {
    abstract readonly collection: Collection;
    id!: string;
    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    static create<T extends Model>(
        data: FirestoreData,
        Type: { new (): T },
        id?: string
    ): T {
        if (id) {
            data.id = id;
        }
        const m = Object.assign(new Type(), data);

        m.prepareFromFirestore(data);
        return m;
    }

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    prepareFromFirestore(data: FirestoreData) {
        return this;
    }

    data(removeKeys = ["id", "collection"]): FirestoreData {
        const data = toFirestoreData(this);
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
