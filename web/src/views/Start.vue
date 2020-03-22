<template>
    <div class="start">
        <div class="flex-container">
            <section class="main-section">
                <div class="name-container">
                    <display-name-form :show-label="true" />
                </div>

                <div v-if="game">
                    <h3>Current Game</h3>
                    <h1>{{ game.name }}</h1>
                    <div class="actions">
                        <button class="btn danger" @click="leaveGame">
                            Leave Game
                        </button>
                        <button class="btn primary" @click="joinGame(game.id)">
                            Join
                        </button>
                    </div>
                </div>
                <div v-else>
                    <create-game />
                </div>
            </section>
            <section class="available-games">
                <div v-if="gamesCount > 0">
                    <h2>Available Games</h2>
                    <ul>
                        <li
                            v-for="(game, index) in allGames"
                            @click="joinGame(game.id)"
                            :key="index"
                        >
                            {{ game.name }}
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateGame from "@web/components/CreateGame.vue";
import { Getters } from "@web/store/Getters";
import Component from "vue-class-component";
import { Action, Getter, State } from "vuex-class";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { AuthGetters } from "@web/store/modules/auth/AuthGetters";
import { GamesGetters } from "@web/store/modules/games/GamesGetters";
import Games from "@web/store/modules/games/GamesModule";
import { Game } from "@shared/models/Game";
import router, { RouteBuilder } from "@web/router";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";
import {
    CreateGameParams,
    JoinGameParams
} from "@web/store/modules/games/Games";

@Component({
    components: { DisplayNameForm, CreateGame }
})
export default class Start extends Vue {
    @State auth!: AuthState;
    @Getter(AuthGetters.currentUserId) currentUserId: number | undefined;
    @Getter(AuthGetters.authLoaded) authLoaded!: boolean;
    @Getter(Getters.appVersion) version!: number;
    @Getter(GamesGetters.count) gamesCount!: number;
    @Getter(Games.Getters.currentGame) game: Game | undefined;
    @Getter(Games.Getters.all) allGames!: Game[];

    @Action(Games.Actions.leaveGame) leaveGame!: () => void;
    @Action(Games.Actions.join)
    protected joinGameById!: (params: JoinGameParams) => void;

    @Action(Games.Actions.createGame)
    private createGame!: (params?: CreateGameParams | undefined) => void;

    @Action(Games.Actions.observeAll)
    private startGamesObserver!: () => void;

    async joinGame(id: string) {
        // await this.joinGameById({ gameId: id });
        await router.push(RouteBuilder.game(id));
    }

    beforeMount() {
        this.startGamesObserver();
    }
}
</script>

<style scoped lang="scss">
@import "mixins";
@import "variables";
.actions {
    .btn {
        margin-right: spacing($lg);
        min-width: 20rem;
    }
}

.start {
    max-width: 900px;
    margin: 0 auto;
}

.name-container {
    margin-bottom: spacing($lg);
}

.flex-container {
    display: flex;
    flex-direction: row;
    @include maxW($br-tablet-max) {
        flex-direction: column-reverse;
    }

    .main-section {
        @include container($xl);
    }

    .available-games {
        background-color: color($color-background);
        @include container($xl);
    }
}
</style>
