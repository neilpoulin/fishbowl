import { ActionTree } from "vuex";
import { GlobalState } from "@web/store/StoreTypes";
import Logger from "@shared/Logger";
import { GamesState } from "@web/store/modules/games/GamesModule";
import { GamesMutations } from "@web/store/modules/games/GamesMutations";
import { db } from "@web/config/FirebaseConfig";
import { Collection } from "@shared/models/Model";
import { Game } from "@shared/models/Game";
import { Unsubscribe } from "firebase";

export enum GamesActions {
  createGame = "games.createGame",
  observeAll = "games.observeAll",
  leaveGame = "games.leave"
}

const logger = new Logger("GameActions");

let gamesUnsubscriber: Unsubscribe | null = null;

export const actions: ActionTree<GamesState, GlobalState> = {
  async [GamesActions.createGame](
  { commit, dispatch },
  payload: CreateGameParams
  ) {
    const game = new Game();
    game.name = payload?.name ?? new Date().toISOString();
    // game.id = `ts_${ Date.now() }`;

    const ref = db()
    .collection(game.collection)
    .doc();
    game.id = ref.id;
    await ref.set(game.data());

    commit(GamesMutations.join, { gameId: game.id });
  },
  async [GamesActions.observeAll]({ commit }): Promise<void> {
    // return await auth().signInAnonymously();
    logger.info("observe game called");
    // commit(GamesMutations.addGame)

    if (gamesUnsubscriber) {
      logger.info("Already observing");
    }

    gamesUnsubscriber = db()
    .collection(Collection.games)
    .onSnapshot(snapshot => {
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        data.id = doc.id;
        const game = Game.fromData(data);
        commit(GamesMutations.addGame, game);
      });
    });

    return;
  },
  [GamesActions.leaveGame]({ commit }) {
    commit(GamesMutations.leave);
  }
};
