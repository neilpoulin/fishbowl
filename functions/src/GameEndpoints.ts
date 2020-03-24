import * as express from "express";
import Logger from "@shared/Logger";

const app = express();
const logger = new Logger("GameEndpoints");

app.post("/:gameId/next-turn", async (request: express.Request, response: express.Response) => {
    const gameId = request.params.gameId;
    logger.info("gameId", gameId);
    response.sendStatus(204);
    return;
});


export default app;