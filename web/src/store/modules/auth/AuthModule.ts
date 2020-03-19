import {Module} from 'vuex';
import {RootState} from "@web/store/StoreTypes";
import {AuthState} from "@web/store/modules/auth/AuthModuleTypes";
import {actions} from "@web/store/modules/auth/AuthActions";
import {mutations} from "@web/store/modules/auth/AuthMutations";

export const state: AuthState = {
    user: undefined,
    hasLoaded: false,
};

const namespaced = true;

export const store: Module<AuthState, RootState> = {
    state: state,
    actions,
    mutations,
    namespaced,
};