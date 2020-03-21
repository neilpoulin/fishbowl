import firebase from "firebase";
import { BaseModel, Collection } from "@shared/models/Model";
// export import Query = firebase.firestore.Query;

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

    // async executeQuery(query: Query) {
    //     return this.firestoreService.executeQuery(query, Firebase);
    // }
    //
    // async getFirst(query: Query) {
    //     return this.firestoreService.getFirst(query, Firebase);
    // }
    //
    // async save(model: Firebase): Promise<Firebase> {
    //     return this.firestoreService.save(model);
    // }
    //
    // async getById(id: string): Promise<Firebase | undefined> {
    //     return await this.firestoreService.getById(id, Firebase);
    // }
}
