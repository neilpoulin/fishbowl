import {ActionTree} from "vuex";
import {AuthState} from "@web/store/modules/auth/AuthModuleTypes";
import {RootState} from "@web/store/StoreTypes";
import {auth} from "@web/config/FirebaseConfig";
import {Unsubscribe} from "firebase";
import Logger from "@shared/Logger";
import UserCredential = firebase.auth.UserCredential;
import {Namespace} from "@web/store";


export enum AuthAction {
    watchAuth = "watchAuth",
    signInAnonymously = "signInAnonymously"
}

export const createAction = (name: AuthAction): string => {
    return `${Namespace.auth}/${name}`;
};

let authUnsubscriber: Unsubscribe | undefined = undefined;
const logger = new Logger("AuthActions");
export const actions: ActionTree<AuthState, RootState> = {
    [AuthAction.watchAuth]: ({commit, dispatch}) => {
        authUnsubscriber = auth().onAuthStateChanged(async (user) => {
            logger.info(`Auth state changed. User = `, user?.toJSON());
            if (!user) {
                await dispatch("signInAnonymously", null)
            } else {
                commit('authChanged', user);
            }
        })
    },
    [AuthAction.signInAnonymously]: async ({commit}): Promise<UserCredential> => {
        return await auth().signInAnonymously();
    }
};