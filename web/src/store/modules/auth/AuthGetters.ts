import { GetterTree } from "vuex";
import { GlobalState } from "@web/store/StoreTypes";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";

export enum AuthGetters {
  currentUserId = "auth.currentUserId",
  authLoaded = "auth.authLoaded"
}

export const getters: GetterTree<AuthState, GlobalState> = {
  [AuthGetters.currentUserId](state): string | undefined {
    const { user } = state;
    return user?.uid;
    // return user?.uid;
  },
  [AuthGetters.authLoaded](state): boolean {
    return state.hasLoaded;
  }
};
