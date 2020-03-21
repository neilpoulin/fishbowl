import { ActionTree } from "vuex";
import {
    AuthState,
    SetDisplayNamePayload
} from "@web/store/modules/auth/AuthModuleTypes";
import { GlobalState } from "@web/store/StoreTypes";
import { auth } from "@web/config/FirebaseConfig";
import Logger from "@shared/Logger";
import UserCredential = firebase.auth.UserCredential;
import { AuthMutations } from "@web/store/modules/auth/AuthMutations";
import { GamesActions } from "@web/store/modules/games/GamesActions";

export enum AuthActions {
    watchAuth = "auth.watchAuth",
    signInAnonymously = "auth.signInAnonymously",
    setDisplayName = "auth.setDisplayName"
}

const logger = new Logger("AuthActions");
export const actions: ActionTree<AuthState, GlobalState> = {
    [AuthActions.watchAuth]: ({ commit, dispatch }) => {
        auth().onAuthStateChanged(async user => {
            logger.info(`Auth state changed. User = `, user?.toJSON());
            if (!user) {
                await dispatch(AuthActions.signInAnonymously, null);
            } else {
                commit(AuthMutations.authChanged, { user });
            }
        });
    },
    [AuthActions.signInAnonymously]: async (): Promise<UserCredential> => {
        return await auth().signInAnonymously();
    },
    async [AuthActions.setDisplayName](
        { commit, dispatch },
        payload: SetDisplayNamePayload
    ) {
        commit(AuthMutations.setDisplayName, payload);
        await dispatch(GamesActions.updatePlayer);
    }
};
