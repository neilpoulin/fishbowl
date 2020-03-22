import { ActionTree } from "vuex";
import { GlobalState } from "@web/store/StoreTypes";
import Logger from "@shared/Logger";
import { GamesState } from "@web/store/modules/games/GamesModule";
import { GamesMutations } from "@web/store/modules/games/GamesMutations";
import { db } from "@web/config/FirebaseConfig";
import { Collection } from "@shared/models/Model";
import { Game, WordEntry } from "@shared/models/Game";
import { Unsubscribe } from "firebase";
import FirestoreService from "@web/services/FirestoreService";
import Player from "@shared/models/Player";
import { GamesGetters } from "@web/store/modules/games/GamesGetters";
import { AuthGetters } from "@web/store/modules/auth/AuthGetters";
import { AuthMutations } from "@web/store/modules/auth/AuthMutations";
import { AlertMessage } from "@web/util/AlertMessage";
import {
    AddWordParams,
    CreateGameParams,
    JoinGameParams,
    SetPhaseParams
} from "@web/store/modules/games/Games";

export enum GamesActions {
    createGame = "games.createGame",
    observeAll = "games.observeAll",
    leaveGame = "games.leave",
    join = "games.join",
    load = "games.load",
    updatePlayer = "games.updatePlayer",
    addGame = "games.addGame",
    addWord = "games.addWord",
    setPlayerPhase = "games.setReadyStatus"
}

const logger = new Logger("GameActions");

let gamesUnsubscriber: Unsubscribe | null = null;

export const actions: ActionTree<GamesState, GlobalState> = {
    async [GamesActions.createGame](
        { dispatch },
        payload: CreateGameParams
    ): Promise<Game> {
        const game = new Game();
        game.name = payload?.name ?? new Date().toISOString();
        await FirestoreService.shared.save(game);

        dispatch(GamesActions.join, { gameId: game.id });
        return game;
    },
    async [GamesActions.observeAll]({ dispatch }): Promise<void> {
        logger.info("observe game called");

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
                    dispatch(GamesActions.addGame, { game });
                });
            });

        return;
    },
    [GamesActions.leaveGame]({ commit }) {
        commit(GamesMutations.leave);
    },
    [GamesActions.addGame]({ commit, getters }, payload: { game: Game }) {
        const { game } = payload;
        commit(GamesMutations.addGame, game);
        const currentGame = getters[GamesGetters.currentGame];
        const userId = getters[AuthGetters.currentUserId];

        if (game.id === currentGame?.id) {
            const player = game.getPlayer(userId);
            if (player?.displayName) {
                commit(AuthMutations.setDisplayName, {
                    displayName: player.displayName
                });
            }
        }
    },
    async [GamesActions.join]({ commit, dispatch }, payload: JoinGameParams) {
        commit(GamesMutations.join, payload);
        await dispatch(GamesActions.updatePlayer);
    },
    async [GamesActions.updatePlayer]({ getters, rootState }) {
        const userId = rootState.auth.user?.uid;
        if (userId) {
            const game: Game | undefined = getters[GamesGetters.currentGame];
            if (game) {
                let player = game.getPlayer(userId);
                const displayName = getters[AuthGetters.displayName];
                if (!player) {
                    player = new Player(userId);
                }
                player.displayName = displayName;

                game.addPlayer(player);
                await FirestoreService.shared.save(game);
            }
        }
    },
    async [GamesActions.addWord]({ getters, commit }, payload: AddWordParams) {
        logger.info("attempting ot add word", payload);
        const userId = getters[AuthGetters.currentUserId];
        const game = getters[GamesGetters.currentGame] as Game | undefined;
        if (!userId || !game) {
            logger.error("no game or user was found. can not submit word");
            return;
        }

        const { word } = payload;
        const wordEntry: WordEntry = { word, userId };
        const added = game.addWord(wordEntry);
        if (added) {
            logger.info("added word to the game..saving the game object");
            commit(GamesMutations.addWordSuccess);
            await FirestoreService.shared.save(game);
        } else {
            logger.error("Unable to add word");
            commit(GamesMutations.addWordError, {
                error: AlertMessage.error(
                    "Unable to add this word. You may have already added it."
                )
            });
        }
    },
    async [GamesActions.setPlayerPhase]({ getters }, payload: SetPhaseParams) {
        const player = getters[GamesGetters.currentPlayer] as Player | null;
        const game = getters[GamesGetters.currentGame] as Game | null;
        if (!player || !game) {
            return;
        }
        const { phase } = payload;
        player.phase = phase;
        logger.info(`Set player phage to ${phase}`);
        game.addPlayer(player);
        await FirestoreService.shared.save(game);
    }
};
