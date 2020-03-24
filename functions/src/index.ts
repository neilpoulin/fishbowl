require("module-alias/register");

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import Logger from "@shared/Logger";
import * as chalk from "chalk";
import { initialize as initFirestoreUtil } from "@shared/util/FirestoreUtil";

initFirestoreUtil({ timestamp: admin.firestore.Timestamp });
import * as Triggers from "@api/Triggers";
import GameEndpoints from "@api/GameEndpoints";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const helloWorld = functions.https.onRequest((request, response) => {
    const logger = new Logger("HelloWorld");
    logger.info("Saying Hello from functions");
    console.log("Hello from console");
    logger.error(chalk.red("Hello from error log"));
    console.info(chalk.red("Hello from error log"));
    response.send("Hello from Firebase! for real live once with chalk and red");
});

module.exports = {
    helloWorld,
    updateGamePhase: Triggers.updateGamePhase,
    setupTeams: Triggers.setupTeams,
    // processGameEvent: Triggers.processGameEvent,

    //https
    games: functions.https.onRequest(GameEndpoints)
};
