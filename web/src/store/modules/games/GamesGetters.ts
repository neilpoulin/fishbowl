import { GetterTree } from "vuex";
import { GamesState } from "@web/store/modules/games/GamesModule";
import { GlobalState } from "@web/store/StoreTypes";
import { Game } from "@shared/models/Game";

export enum GamesGetters {
  currentGame = "games.currentGame",
  count = "games.totalCount",
  all = "games.all",
  gameNames = "games.allNames"
}

// type GetterType =
export const getters: GetterTree<GamesState, GlobalState> = {
  [GamesGetters.currentGame](state): Game | undefined {
    const gameId = state.currentGameId;
    if (!gameId) {
      return undefined;
    }
    return state.gamesById[gameId];
  },
  [GamesGetters.count](state): number {
    return Object.values(state.gamesById).length;
  },
  [GamesGetters.all](state): Game[] {
    return Object.values(state.gamesById);
  },
  [GamesGetters.gameNames](state): (string | undefined)[] {
    return Object.values(state.gamesById)
      .filter(Boolean)
      .map((game: Game) => game.name);
  }
};
