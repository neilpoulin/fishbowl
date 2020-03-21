import { GetterTree } from "vuex";
import { GlobalState } from "@web/store/StoreTypes";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { Player } from "@shared/models/Player";

export enum AuthGetters {
    currentUserId = "auth.currentUserId",
    authLoaded = "auth.authLoaded",
    displayName = "auth.displayName",
    player = "auth.player"
}

export const getters: GetterTree<AuthState, GlobalState> = {
    [AuthGetters.currentUserId](state): string | undefined {
        const { user } = state;
        return user?.uid;
        // return user?.uid;
    },
    [AuthGetters.authLoaded](state): boolean {
        return state.hasLoaded;
    },
    [AuthGetters.displayName](state): string | null | undefined {
        return state.displayName;
    },
    [AuthGetters.player](state): Player | null {
        return state.player;
    }
};
