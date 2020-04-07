import { Analytics, auth } from "@web/config/FirebaseConfig";
import { Game, WordEntry } from "@shared/models/Game";
import { Route } from "vue-router";
/* eslint-disable @typescript-eslint/camelcase */
export default class AnalyticsService {
    static shared: AnalyticsService;
    analytics: Analytics;
    firstRouteFired = false;
    static initialize(params: { analytics: Analytics }) {
        AnalyticsService.shared = new AnalyticsService(params);
    }

    constructor(params: { analytics: Analytics }) {
        this.analytics = params.analytics;
        auth().onAuthStateChanged(user => {
            this.analytics.setUserId(user?.uid ?? "");
            this.analytics.setUserProperties({ display_name: user?.displayName ?? "", email: user?.email ?? "" });
        });
    }

    routeChanged(to: Route) {
        //Only want to fire subsequent page view events as standard analytics will fire the initial page load.
        if (this.firstRouteFired) {
            this.analytics.logEvent("page_view", {
                page_path: to.path,
                page_title: to.name,
                page_location: window.location.href,
                name: to.name
            });
        }
        this.firstRouteFired = true;
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
