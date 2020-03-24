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
import { isBlank } from "@shared/util/ObjectUtil";
import { getRandomAnimal } from "@web/util/AnimalNames";

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
        if (isBlank(payload.displayName)) {
            payload.displayName = getRandomAnimal();
        }
        commit(AuthMutations.setDisplayName, payload);
        const currentUser = auth().currentUser;
        if (currentUser) {
            await currentUser.updateProfile({
                displayName: payload.displayName
            });
        }
        await dispatch(GamesActions.updatePlayer);
    }
};
