import ApiService, { Endpoint } from "@web/services/ApiService";
import { WordEntry } from "@shared/models/Game";
import { CompleteWordParams, CompleteWordResult } from "@shared/api/GameApiTypes";

export default class GameService {
    static shared = new GameService();

    api = ApiService.shared;

    async completeWord(params: { gameId: string; word: WordEntry }): Promise<CompleteWordResult | undefined> {
        const { gameId, word } = params;
        const payload: CompleteWordParams = { word };
        return await this.api.post<CompleteWordParams, CompleteWordResult>(Endpoint.completeWord(gameId), payload);
    }
}
