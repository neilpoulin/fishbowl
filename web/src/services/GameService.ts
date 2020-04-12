import ApiService, { Endpoint } from "@web/services/ApiService";
import { Game, WordEntry } from "@shared/models/Game";
import { CompleteWordParams, CompleteWordResult } from "@shared/api/GameApiTypes";
import Logger from "@shared/Logger";
import { auth, db } from "@web/config/FirebaseConfig";
import { Collection } from "@shared/models/Model";

export default class GameService {
    static shared = new GameService();
    logger = new Logger("GameService");
    completeWordOnServer = false;

    api = ApiService.shared;

    async completeWord(params: { gameId: string; word: WordEntry }): Promise<CompleteWordResult | undefined> {
        const { gameId, word } = params;
        if (this.completeWordOnServer) {
            this.logger.info("Compelting word on server");
            return this.completeWordAPI({ gameId, word });
        } else {
            this.logger.info("Completing word locally");
            return this.completeWordClient({ gameId, word });
        }
    }

    async completeWordAPI(params: { gameId: string; word: WordEntry }): Promise<CompleteWordResult | undefined> {
        const { gameId, word } = params;
        const payload: CompleteWordParams = { word };
        return await this.api.post<CompleteWordParams, CompleteWordResult>(Endpoint.completeWord(gameId), payload);
    }

    async completeWordClient(params: { gameId: string; word: WordEntry }): Promise<CompleteWordResult | undefined> {
        const { gameId, word } = params;
        const user = auth().currentUser;
        const userId = user?.uid;
        if (!user || !userId) {
            this.logger.error("User is not logged in. ");
            return { success: false };
        }
        try {
            const txnResult = await db().runTransaction<CompleteWordResult>(async txn => {
                const gameRef = db()
                    .collection(Collection.games)
                    .doc(gameId);
                const gameSnapshot = await txn.get(gameRef);
                const game = Game.fromSnapshot(gameSnapshot);

                const removed = game.completeWord(word);
                if (!removed) {
                    this.logger.info("word not removed, not doing anything");
                    return { success: true, removed: false };
                }

                game.incrementScore(userId);

                if (game.remainingWordsInRound.length === 0) {
                    this.logger.info("No words left, ending turn.");
                    game.endTurn();
                }
                await txn.set(gameRef, game.data(), { merge: true });

                return { success: false };
            });
            this.logger.info("Complete word client result", txnResult);
            return txnResult;
        } catch (error) {
            this.logger.error("Complete word via transaction failed", error);
            return { success: false };
        }
    }
}
