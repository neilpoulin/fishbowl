import { Module } from "vuex";
import { GlobalState } from "@web/store/StoreTypes";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { actions } from "@web/store/modules/auth/AuthActions";
import { mutations } from "@web/store/modules/auth/AuthMutations";
import { getters } from "@web/store/modules/auth/AuthGetters";

export const initialState: AuthState = {
  user: undefined,
  hasLoaded: false
};

export const store = (namespaced: boolean): Module<AuthState, GlobalState> => ({
  state: initialState,
  actions,
  getters,
  mutations,
  namespaced
});
