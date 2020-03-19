require("module-alias/register");
import * as functions from 'firebase-functions';
import Logger from "@shared/Logger";
import * as chalk from "chalk"

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    const logger = new Logger("HelloWorld");
    logger.info("Saying Hello from functions");
    console.log("Hello from console");
    logger.error(chalk.red("Hello from error log"));
    console.info(chalk.red("Hello from error log"));
    response.send("Hello from Firebase! for real live once with chalk and red");
});
