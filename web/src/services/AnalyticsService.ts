import { Analytics } from "@web/config/FirebaseConfig";
import { Game, WordEntry } from "@shared/models/Game";
/* eslint-disable @typescript-eslint/camelcase */
export default class AnalyticsService {
    static shared: AnalyticsService;
    analytics: Analytics;

    static initialize(params: { analytics: Analytics }) {
        AnalyticsService.shared = new AnalyticsService(params);
    }

    constructor(params: { analytics: Analytics }) {
        this.analytics = params.analytics;
    }

    wordAdded(word: WordEntry, gameId: string) {
        this.analytics.logEvent("submit_word", { group_id: gameId, word: word.word });
    }

    createdGame(game: Game) {
        this.analytics.logEvent("create_group", { group_id: game.id });
    }

    joinedGame(game: Game) {
        this.analytics.logEvent("join_group", { group_id: game.id });
    }

    copyGameLink(game: Game) {
        this.analytics.logEvent("share", { content_id: game.id, content_type: "game" });
    }
}
