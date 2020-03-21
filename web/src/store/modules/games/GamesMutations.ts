import { MutationTree } from "vuex";
import { GamesState } from "@web/store/modules/games/GamesModule";
import { Game } from "@shared/models/Game";

export enum GamesMutations {
  join = "games.join",
  leave = "games.leave",
  addGame = "games.addGame"
}

export const mutations: MutationTree<GamesState> = {
  [GamesMutations.join](state, payload: JoinGameParams) {
    state.currentGameId = payload.gameId;
  },
  [GamesMutations.leave](state) {
    state.currentGameId = null;
  },
  [GamesMutations.addGame](state, game: Game) {
    state.gamesById = { ...state.gamesById, [game.id]: game };
  }
};
