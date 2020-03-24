import firebase, { firestore } from "firebase";
import { BaseModel, Collection } from "@shared/models/Model";

export default class FirestoreService {
    public static shared: FirestoreService;

    static initialize(firestore: firebase.firestore.Firestore) {
        FirestoreService.shared = new FirestoreService(firestore);
    }

    firestore: firebase.firestore.Firestore;

    constructor(firestore: firebase.firestore.Firestore) {
        this.firestore = firestore;
    }

    getCollectionRef(collection: Collection) {
        return this.firestore.collection(collection);
    }

    async save<T extends BaseModel>(model: T): Promise<T | undefined> {
        const collectionRef = this.getCollectionRef(model.collection);

        let doc = collectionRef.doc();
        if (model.id) {
            doc = collectionRef.doc(model.id);
        } else {
            model.id = doc.id;
        }

        if (!model.createdAt) {
            model.createdAt = new Date();
        }

        model.updatedAt = new Date();

        const data = await model.data();

        await doc.set(data, { merge: true });

        return model;
    }

    async deleteField<T extends BaseModel>(model: T, fieldPath: string) {
        const doc = this.getCollectionRef(model.collection).doc(model.id);
        await doc.update({ [fieldPath]: firestore.FieldValue.delete() });
        return;
    }
}
