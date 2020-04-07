import Vue from "vue";
import Vuex from "vuex";
import Logger from "@shared/Logger";
import { analytics, initFirebase } from "@web/config/FirebaseConfig";
import { GlobalState, Namespace } from "@web/store/StoreTypes";
import * as Auth from "@web/store/modules/auth/AuthModule";
import Games from "@web/store/modules/games/GamesModule";
import { getters } from "@web/store/Getters";
import AnalyticsService from "@web/services/AnalyticsService";

const logger = new Logger("Store");

//TODO: refactor these into a more obvious place to init them.
initFirebase();
AnalyticsService.initialize({ analytics: analytics() });

Vue.use(Vuex);

const initialState: GlobalState = {
    version: "1.0.0",
    auth: Auth.initialState,
    games: Games.state
};

const namespaced = false;

export const store = new Vuex.Store<GlobalState>({
    state: initialState,
    mutations: {},
    actions: {},
    modules: {
        [Namespace.auth]: Auth.store(namespaced),
        [Namespace.games]: Games.store(namespaced)
    },
    getters
});

store.dispatch(Auth.Actions.watchAuth).then(() => {
    logger.info("Finished dispatching watch auth action");
});

store.dispatch(Games.Actions.observeAll).then(() => {
    logger.info("Finished observing games");
});
