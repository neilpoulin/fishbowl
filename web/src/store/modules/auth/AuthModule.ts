import { Module } from "vuex";
import { GlobalState } from "@web/store/StoreTypes";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { actions, AuthActions } from "@web/store/modules/auth/AuthActions";
import { mutations, AuthMutations } from "@web/store/modules/auth/AuthMutations";
import { getters, AuthGetters } from "@web/store/modules/auth/AuthGetters";

export import Actions = AuthActions;

export const initialState: AuthState = {
    user: undefined,
    hasLoaded: false,
    displayName: localStorage.getItem("displayName"),
    player: null,
    loginContinueUrl: null
};

export const store = (namespaced: boolean): Module<AuthState, GlobalState> => ({
    state: initialState,
    actions,
    getters,
    mutations,
    namespaced
});

export default {
    Actions,
    Getters: AuthGetters,
    Mutations: AuthMutations
};
