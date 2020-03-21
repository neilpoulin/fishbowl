import { GlobalState } from "@web/store/StoreTypes";
import { Module } from "vuex";
import { actions, GamesActions } from "@web/store/modules/games/GamesActions";
import { Game } from "@shared/models/Game";
import { GamesGetters, getters } from "@web/store/modules/games/GamesGetters";
import {
    GamesMutations,
    mutations
} from "@web/store/modules/games/GamesMutations";
import { AlertMessage } from "@web/util/AlertMessage";

export interface GamesState {
    currentGameId?: string | null;
    addWordError?: AlertMessage | null;
    gamesById: { [gameId: string]: Game };
}

export const state: GamesState = {
    currentGameId: null,
    gamesById: {}
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
    state,
    store,
    Actions: GamesActions,
    Getters: GamesGetters,
    Mutations: GamesMutations
};
