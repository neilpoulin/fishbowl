import { GlobalState } from "@web/store/StoreTypes";
import { Module } from "vuex";
import { actions, GamesActions } from "@web/store/modules/games/GamesActions";
import { Game } from "@shared/models/Game";
import { GamesGetters, getters } from "@web/store/modules/games/GamesGetters";
import {
  GamesMutations,
  mutations
} from "@web/store/modules/games/GamesMutations";

export interface GamesState {
  currentGameId?: string | null;
  gamesById: { [gameId: string]: Game };
}

const game1 = new Game();
game1.id = "test";
game1.name = "Test Game Name";

export const state: GamesState = {
  currentGameId: null,
  gamesById: { test: game1 }
};

export const store = (
  namespaced: boolean
): Module<GamesState, GlobalState> => ({
  state,
  actions,
  getters,
  mutations,
  namespaced
});

export default {
  Actions: GamesActions,
  Getters: GamesGetters,
  Mutations: GamesMutations
};
