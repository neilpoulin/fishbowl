import { MutationTree } from "vuex";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { User } from "firebase";

export enum AuthMutation {
  authChanged = "authChanged"
}

export const mutations: MutationTree<AuthState> = {
  [AuthMutation.authChanged]: (state, payload: User | null) => {
    state.user = payload ?? undefined;
    state.hasLoaded = true;
  }
};
