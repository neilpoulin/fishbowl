import * as firebase from 'firebase/app';
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/firestore';
import Logger from "@shared/Logger";

const logger = new Logger("FirestoreConfig");

const firebaseConfig = {
    apiKey: "AIzaSyB0ky21BK0VxRrYBZm_iPmc5Fb9HcvR39I",
    authDomain: "fishbowl-online.firebaseapp.com",
    databaseURL: "https://fishbowl-online.firebaseio.com",
    projectId: "fishbowl-online",
    storageBucket: "fishbowl-online.appspot.com",
    messagingSenderId: "211494746456",
    appId: "1:211494746456:web:19872a2191f1f4000a4d2d",
    measurementId: "G-DM3RZV27JF"
};

let _firebaseApp: firebase.app.App | undefined = undefined;
let _db: firebase.firestore.Firestore | undefined;

export function initFirestore(): firebase.app.App {
    if (_firebaseApp) {
        logger.warn("Firebase is already configured. Returning existing app.")
        return _firebaseApp;
    }
    _firebaseApp = firebase.initializeApp(firebaseConfig);
    logger.info("Configured Firebase");

    return _firebaseApp;
}

export const db = () => {
    return _firebaseApp!.firestore()
};

export const auth = () => {
    return _firebaseApp!.auth();
};