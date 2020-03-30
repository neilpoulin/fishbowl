<template>
    <div class="start">
        <div class="loading" v-if="isLoading"></div>

        <div class="flex-container">
            <section class="main-section">
                <div class="name-container">
                    <span class="name">Your Name</span>
                    <display-name-form :show-label="false" />
                </div>
                <div class="game-container">
                    <div class="content">
                        <span class="current-game">Current Game</span>
                        <div v-if="game">
                            <h2>{{ game.name }}</h2>
                            <div class="actions">
                                <button class="btn danger outlined" @click="leaveGame">
                                    Leave Game
                                </button>
                                <button class="btn secondary light" @click="joinGame(game.id)">
                                    Join
                                </button>
                            </div>
                        </div>
                        <div v-else class="create-game">
                            <create-game />
                        </div>
                    </div>
                </div>
            </section>
            <section class="available-games" v-if="gamesCount > 0">
                <div>
                    <h2>Recent Games</h2>
                    <ul class="games-list">
                        <li v-for="(game, index) in availableGames" @click="joinGame(game.id)" :key="index">
                            <span class="name">{{ game.name }}</span>
                            <span class="players">{{ playerLabel(game) }}</span>
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
import { CreateGameParams, JoinGameParams } from "@web/store/modules/games/Games";

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
    @Getter(Games.Getters.availableGames) availableGames!: Game[];

    @Action(Games.Actions.leaveGame) leaveGame!: () => void;
    @Action(Games.Actions.join)
    protected joinGameById!: (params: JoinGameParams) => void;

    @Action(Games.Actions.createGame)
    private createGame!: (params?: CreateGameParams | undefined) => void;

    @Action(Games.Actions.observeAll)
    private startGamesObserver!: () => void;

    isLoading = false;

    async joinGame(id: string) {
        this.isLoading = true;
        await this.joinGameById({ gameId: id });
        await router.push(RouteBuilder.game(id));
    }

    playerLabel(game: Game): string {
        const count = game?.playersList.length ?? 0;
        if (count === 0) {
            return "No players";
        }

        if (count === 1) {
            return "1 player";
        }

        return `${count} players`;
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
    display: flex;
    @include maxW($br-tablet-min) {
        flex-direction: column-reverse;
    }

    .btn {
        margin-right: spacing($lg);
        min-width: 20rem;
        margin-bottom: spacing($md);
    }
}

.start {
    max-width: $pageMaxWidthXl;
    margin: 0 auto;
}

.create-game {
}

.name-container {
    @include container($xl);
    @include shadowbox;
    @include rounded($cornerRadiusLg);
    margin: spacing($lg) 0;
    background-color: color($color-background, $variant-light);
    .name {
        @include font($md, $bold);
        margin-bottom: spacing($xl);
    }
}

.flex-container {
    display: flex;
    flex-direction: row;
    @include maxW($br-tablet-max) {
        flex-direction: column;
    }

    .main-section {
        @include container($xl);

        .game-container {
            @include shadowbox;
            @include container($xl);
            @include rounded($cornerRadiusLg);
            background-color: color($color-primary, $variant-base);
            color: color($color-text, $variant-light);
            .actions {
                margin-top: spacing($xl);
            }

            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-self: center;
            $padding: spacing($xl);
            padding: $padding;

            .mask {
                filter: blur(5px);
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: url("/images/fishbowl_final.png") no-repeat center center;
            }
            .content {
                position: relative;
            }
        }
    }

    .available-games {
        //background-color: color($color-background);
        @include container($xl);
        @include rounded;
        min-width: 30rem;
        .games-list {
            padding: 0;
            margin: 2rem 0 0 0;
            list-style: none;

            li {
                $bgColor: color($color-background, $variant-dark);
                @include container($md);
                @include rounded;
                background-color: $bgColor;
                margin-bottom: spacing($md);
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                &:hover {
                    cursor: pointer;
                    background-color: darken($bgColor, 5%);
                }

                .name {
                    @include font($lg, $bold);
                    margin-bottom: spacing($md);
                }

                .players {
                    @include font($sm);
                }
            }
        }
    }
}
</style>
