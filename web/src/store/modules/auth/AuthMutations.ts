import { MutationTree } from "vuex";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { User } from "firebase";
import { Mutations } from "@web/store/Mutations";

export const mutations: MutationTree<AuthState> = {
  [Mutations.authChanged]: (state, payload: User | null) => {
    state.user = payload ?? undefined;
    state.hasLoaded = true;
  }
};
