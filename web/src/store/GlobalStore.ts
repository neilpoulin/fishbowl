import Vue from "vue";
import Vuex from "vuex";
import Logger from "@shared/Logger";
import { initFirestore } from "@web/config/FirebaseConfig";
import { GlobalState, Namespace } from "@web/store/StoreTypes";
import * as Auth from "@web/store/modules/auth/AuthModule";
import * as Games from "@web/store/modules/games/GamesModule";
import { getters } from "@web/store/Getters";

const logger = new Logger("Store");
initFirestore();
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
