import * as firebase from "firebase/app";
// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import Logger from "@shared/Logger";
import { initialize as initFirestoreUtil } from "@shared/util/FirestoreUtil";
import FirestoreService from "@web/services/FirestoreService";
export import Analytics = firebase.analytics.Analytics;

const logger = new Logger("FirestoreConfig");

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};

let _firebaseApp: firebase.app.App | undefined = undefined;

export const db = () => {
    return _firebaseApp?.firestore() as firebase.firestore.Firestore;
};

export const auth = () => {
    return _firebaseApp?.auth() as firebase.auth.Auth;
};

export const analytics = () => {
    return _firebaseApp?.analytics() as firebase.analytics.Analytics;
};

export function initFirebase(): firebase.app.App {
    initFirestoreUtil({ timestamp: firebase.firestore.Timestamp });

    if (_firebaseApp) {
        logger.warn("Firebase is already configured. Returning existing app.");
        return _firebaseApp;
    }
    _firebaseApp = firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    FirestoreService.initialize(db());
    logger.info("Configured Firebase");

    return _firebaseApp;
}
