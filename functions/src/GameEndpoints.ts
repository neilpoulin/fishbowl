import * as express from "express";
import Logger from "@shared/Logger";
import { Game } from "@shared/models/Game";
import { getAuthUserId } from "@api/util/RequestUtil";
import * as admin from "firebase-admin";
import { Collection } from "@shared/models/Model";
import { CompleteWordParams } from "@shared/api/GameApiTypes";
import * as cors from "cors";
import { getConfig } from "@api/util/Config";
const app = express();
const logger = new Logger("GameEndpoints");
logger.info("allowed Origins: ", JSON.stringify(getConfig().allowedOrigins));
app.use(cors({
    origin: getConfig().allowedOrigins,
}));

app.get("/:gameId", async (request: express.Request, response: express.Response) => {
    response.send("Got it!" + request.params.gameId);
    return;
});

app.post("/:gameId/next-turn", async (request: express.Request, response: express.Response) => {
    const gameId = request.params.gameId;
    logger.info("gameId", gameId);
    response.sendStatus(204);
    return;
});

app.post("/:gameId/actions/complete-word", async (request: express.Request, response: express.Response) => {
    const userId = await getAuthUserId(request);
    const {word} = request.body as CompleteWordParams;
    if (!userId) {
        response.sendStatus(401);
        return;
    }
    logger.info("completing word", word);
    const gameId = request.params.gameId;
    const txnResult = await admin.firestore().runTransaction(async txn => {
        const gameRef = admin
            .firestore()
            .collection(Collection.games)
            .doc(gameId);

        const gameDoc = await txn.get(gameRef);
        const data = gameDoc.data();
        if (!data) {
            return { success: false, message: "no game found" };
        }

        const game = Game.fromData(data);

        if (!game || !word || !userId) {
            return;
        }
        const completed = game.completeWord(word);

        if (completed) {
            game.incrementScore(userId);
        }

        if (game.remainingWordsInRound.length === 0) {
            logger.info("No words left, ending turn.");
            game.endTurn();
        }

        await txn.set(gameRef, game.data(), {merge: true});

        return { success: true };
    });
    logger.info("transaction result", txnResult);

    response.status(200).send(txnResult);
    return;
});

export default app;
