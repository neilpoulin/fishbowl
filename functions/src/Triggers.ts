import * as functions from "firebase-functions";
import { Collection } from "@shared/models/Model";
import Logger from "@shared/Logger";
import { Game } from "@shared/models/Game";

const logger = new Logger("Triggers");

/**
 * Check to see if there are updates that need to happen to the game,
 * such as moving to the next phase, or assigning teams.
 *
 * If changes are made, then the game is saved. If no changes are detected, it is not saved.
 */
export const updateGameState = functions.firestore.document(`${Collection.games}/{gameId}`).onWrite(async snapshot => {
    const data = snapshot.after.data();
    if (!data) {
        logger.info("No data was found on the snapshot");
        return;
    }
    logger.info("Handling game on write with data ", JSON.stringify(data));
    const game = Game.fromData(data);

    const didChangePhase = game.nextPhase();
    logger.info("did move next phase", didChangePhase);

    const { playersAssigned, numTeamsAssigned } = game.assignTeams();
    logger.info(`Assign Team result`, JSON.stringify({ playersAssigned, numTeamsAssigned }));

    if (didChangePhase || playersAssigned > 0 || numTeamsAssigned > 0) {
        logger.info("there were updates, saving game");
        await snapshot.after.ref.set(game.data(), { merge: true });
    } else {
        logger.info("there were no updates to the game, not saving");
    }
});
