import { MutationTree } from "vuex";
import {
    AuthChangedPayload,
    AuthState,
    SetDisplayNamePayload
} from "@web/store/modules/auth/AuthModuleTypes";
import { Player } from "@shared/models/Player";

export enum AuthMutations {
    authChanged = "auth.changed",
    setDisplayName = "auth.setDisplayName"
}

export const mutations: MutationTree<AuthState> = {
    [AuthMutations.authChanged]: (state, payload: AuthChangedPayload) => {
        const user = payload.user;
        state.user = user ?? undefined;
        state.hasLoaded = true;

        if (user && state.player?.userId !== user.uid) {
            const player = new Player(user.uid);
            player.displayName = "";
            state.player = player;
        } else {
            state.player = null;
        }
    },
    [AuthMutations.setDisplayName](state, payload: SetDisplayNamePayload) {
        if (state.player) {
            state.player.displayName = payload.displayName;
        }
        state.displayName = payload.displayName;
        localStorage.setItem("displayName", payload.displayName);
    }
};
