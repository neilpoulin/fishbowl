import { MutationTree } from "vuex";
import { GamesState } from "@web/store/modules/games/GamesModule";
import { Game } from "@shared/models/Game";
import { AlertMessage } from "@web/util/AlertMessage";
import { JoinGameParams } from "@web/store/modules/games/Games";

export enum GamesMutations {
    setCurrentGame = "games.join",
    leave = "games.leave",
    addGame = "games.addGame",
    addWordError = "games.addWordError",
    addWordSuccess = "games.addWordSuccess",
    setGameActive = "games.setGameActive",
    setSaving = "games.setSaving"
}

export const mutations: MutationTree<GamesState> = {
    [GamesMutations.setCurrentGame](state, payload: JoinGameParams) {
        state.currentGameId = payload.gameId;
    },
    [GamesMutations.leave](state) {
        state.currentGameId = null;
    },
    [GamesMutations.addGame](state, game: Game) {
        state.gamesById = { ...state.gamesById, [game.id]: game };
    },
    [GamesMutations.addWordError](state, payload: { error?: AlertMessage }) {
        state.addWordError = payload.error;
    },
    [GamesMutations.addWordSuccess](state) {
        state.addWordError = null;
    },
    [GamesMutations.setGameActive](state, payload: { isActive: boolean }) {
        state.gameActive = payload.isActive;
    },
    [GamesMutations.setSaving](state, payload: { saving: boolean }) {
        state.isSaving = payload.saving;
    }
};
