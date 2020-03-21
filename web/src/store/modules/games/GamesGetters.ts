import { GetterTree } from "vuex";
import { GamesState } from "@web/store/modules/games/GamesModule";
import { GlobalState } from "@web/store/StoreTypes";
import { Game, WordEntry } from "@shared/models/Game";
import { AuthGetters } from "@web/store/modules/auth/AuthGetters";
import { AlertMessage } from "@web/util/AlertMessage";
import Player from "@shared/models/Player";

export enum GamesGetters {
    currentGame = "games.currentGame",
    count = "games.totalCount",
    all = "games.all",
    gameNames = "games.allNames",
    submittedWords = "games.submittedWords",
    submittedWordsError = "games.submittedWordsError",
    currentPlayer = "games.currentPlayer"
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
    [GamesGetters.submittedWords](state, getters): WordEntry[] {
        const userId = getters[AuthGetters.currentUserId];
        const game = getters[GamesGetters.currentGame] as Game | undefined;
        if (!game || !userId) {
            return [];
        }

        return game.getWordsForUser(userId);
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
    },
    [GamesGetters.submittedWordsError](state): AlertMessage | null | undefined {
        return state.addWordError;
    },
    [GamesGetters.currentPlayer](state, getters): Player | null {
        const game = getters[GamesGetters.currentGame] as Game | undefined;
        const userId = getters[AuthGetters.currentUserId] as string | undefined;
        if (!game || !userId) {
            return null;
        }
        return game.getPlayer(userId) || null;
    }
};
