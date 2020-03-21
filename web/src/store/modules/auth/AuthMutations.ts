import { MutationTree } from "vuex";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { User } from "firebase";

export enum AuthMutations {
  authChanged = "authChanged"
}

export const mutations: MutationTree<AuthState> = {
  [AuthMutations.authChanged]: (state, payload: User | null) => {
    state.user = payload ?? undefined;
    state.hasLoaded = true;
  }
};
