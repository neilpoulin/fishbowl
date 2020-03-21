import Vue from "vue";
import Vuex from "vuex";
import { initFirestore } from "@web/config/FirebaseConfig";
import {
  initialState as authState,
  store as auth
} from "@web/store/modules/auth/AuthModule";

import { GlobalState, Namespace } from "@web/store/StoreTypes";
import { Actions } from "@web/store/Actions";
import Logger from "@shared/Logger";
import { getters } from "@web/store/Getters";

const logger = new Logger("Store");
initFirestore();
Vue.use(Vuex);

const initialState: GlobalState = {
  version: "1.0.0",
  auth: authState
};

const namespaced = false;

export const store = new Vuex.Store<GlobalState>({
  state: initialState,
  mutations: {},
  actions: {},
  modules: {
    [Namespace.auth]: auth(namespaced)
  },
  getters
});

store.dispatch(Actions.watchAuth).then(() => {
  logger.info("Finished dispatching watch auth action");
});
