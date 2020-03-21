import { ActionTree } from "vuex";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { GlobalState } from "@web/store/StoreTypes";
import { auth } from "@web/config/FirebaseConfig";
import Logger from "@shared/Logger";
import { Actions } from "@web/store/Actions";
import UserCredential = firebase.auth.UserCredential;

const logger = new Logger("AuthActions");
export const actions: ActionTree<AuthState, GlobalState> = {
  [Actions.watchAuth]: ({ commit, dispatch }) => {
    auth().onAuthStateChanged(async user => {
      logger.info(`Auth state changed. User = `, user?.toJSON());
      if (!user) {
        await dispatch("signInAnonymously", null);
      } else {
        commit("authChanged", user);
      }
    });
  },
  [Actions.signInAnonymously]: async (): Promise<UserCredential> => {
    return await auth().signInAnonymously();
  }
};
