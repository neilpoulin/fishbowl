import Vue from "vue";
import Vuex from "vuex";
import { initFirestore } from "@web/config/FirebaseConfig";
import { store as auth } from "@web/store/modules/auth/AuthModule";

import { RootState } from "@web/store/StoreTypes";
import {
  AuthAction,
  createAction as authAction
} from "@web/store/modules/auth/AuthActions";

initFirestore();

Vue.use(Vuex);

export enum Namespace {
  auth = "auth"
}

const initialState: RootState = { version: "1.0.0" };

const store = new Vuex.Store<RootState>({
  state: initialState,
  mutations: {},
  actions: {},
  modules: {
    [Namespace.auth]: auth
  }
});

store.dispatch(authAction(AuthAction.watchAuth));

export default store;
