<template>
    <div class="container">
        <div class="sidebar">
            <section class="players">
                <section class="header" v-if="game">
                    <h2>{{ game.name }}</h2>
                </section>
                <display-name-form :show-label="true" />
                <hr />
                <h4>Players</h4>
                <ul>
                    <li v-for="player in players" :key="player.userId">
                        <div class="player">
                            <span class="name">{{ player.displayName }}</span>
                            <span
                                class="ready"
                                v-if="playerIsReady(player) && !showTeams"
                            >
                                Ready
                            </span>
                            <span
                                class="team"
                                v-if="showTeams && player.team !== undefined"
                            >
                                Team {{ player.team }}
                            </span>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
        <div class="gameboard" v-if="game">
            <game-phase :phase="game.phase" v-if="game.phase === 0" />

            <h4 v-if="game.phase === 1">Round {{ game.round }}</h4>

            <template v-if="game.phase === 0">
                <div class="ready-container">
                    <player-ready-button />
                </div>
                <game-submit-words />
            </template>

            <template v-if="game.phase === 1">
                <div v-if="currentPlayer" class="current-player">
                    <h3>Now Playing:</h3>
                    <h2>
                        {{ currentPlayer.displayName }} (Team {{ currentTeam }})
                    </h2>
                </div>

                <div class="scores">
                    <div
                        class="score-container"
                        v-for="team in teams"
                        :key="team"
                    >
                        <span class="team"> Team {{ team }} </span>:
                        <span class="score">
                            {{ game.scores[team] || 0 }}
                        </span>
                    </div>
                </div>

                <div class="secret-word" v-if="currentWord && currentWord.word">
                    <p>Your word is:</p>
                    <h1>{{ currentWord.word }}</h1>

                    <button @click="completeWord">Complete</button>
                </div>
                <div class="timer" v-if="secondsLeftMs">
                    <h1>{{ secondsLeftMs | formatDuration }}</h1>
                </div>

                <button
                    v-if="showNextTurn"
                    class="btn danger"
                    @click="nextTurn"
                >
                    Next Turn
                </button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Logger from "@shared/Logger";
import Games from "@web/store/modules/games/GamesModule";
import Auth from "@web/store/modules/auth/AuthModule";
import { Game, Phase, WordEntry } from "@shared/models/Game";
import { Action, Getter } from "vuex-class";
import Player from "@shared/models/Player";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";
import GameSubmitWords from "@web/components/GameSubmitWords.vue";
import PlayerReadyButton from "@web/components/PlayerReadyButton.vue";

import GamePhase from "@web/components/GamePhase.vue";
import { CompleteWordPayload } from "@web/store/modules/games/Games";
import FirestoreService from "@web/services/FirestoreService";

const logger = new Logger("GameView");
@Component({
    components: {
        GameSubmitWords,
        DisplayNameForm,
        PlayerReadyButton,
        GamePhase
    },
    filters: {
        formatDuration(ms: number | undefined): string {
            if (ms === undefined) {
                return "0:00";
            }
            return new Date(ms).toISOString().substr(15, 4);
        }
    }
})
export default class GameView extends Vue {
    @Getter(Games.Getters.currentGame) game?: Game | undefined;
    @Getter(Auth.Getters.currentUserId) userId?: string | undefined;
    @Action(Games.Actions.completeWord) markCompleted!: (
        paylaod: CompleteWordPayload
    ) => void;
    get players(): Player[] {
        return Object.values(this.game?.players ?? {});
    }
    secondsLeftMs: number | null = null;
    tickerInterval: number | undefined;

    beforeMount() {
        const gameId = this.$route.params.gameId;
        if (gameId) {
            this.$store.dispatch(Games.Actions.join, { gameId });
        }

        logger.info(`Game ID = ${gameId}`);

        this.tickerInterval = setInterval(() => {
            this.updateTimeRemaining();
        }, 1000);
    }

    updateTimeRemaining() {
        const turnEndsAt = this.game?.turnEndsAt;
        if (!turnEndsAt) {
            return;
        }

        const diff = turnEndsAt.getTime() - Date.now();
        if (diff < 0) {
            this.secondsLeftMs = null;
            return;
        }
        this.secondsLeftMs = diff;
    }

    destroyed() {
        clearInterval(this.tickerInterval);
    }

    playerIsReady(player: Player): boolean {
        const gamePhase = this.game?.phase ?? Phase.SETUP;
        return (player.phase ?? Phase.SETUP) > gamePhase;
    }

    showTeams(): boolean {
        return (this.game?.phase ?? Phase.SETUP) > Phase.SETUP;
    }

    get showNextTurn(): boolean {
        return !!localStorage.getItem("admin");
    }

    get currentWord(): WordEntry | undefined {
        if (this.currentPlayer && this.currentPlayer?.userId == this.userId) {
            return this.game?.getCurrentWord();
        }
        return undefined;
    }

    get currentTeam(): number {
        return this.game?.currentTeam ?? 0;
    }

    get currentPlayer(): Player | undefined {
        return this.game?.getActivePlayer();
    }

    get teams(): number[] {
        const teams: number[] = [];
        if (!this.game) {
            return teams;
        }
        for (let team = 0; team < this.game.numberOfTeams; team++) {
            teams.push(team);
        }
        return teams;
    }

    completeWord() {
        const word = this.currentWord;
        if (word) {
            this.markCompleted({ word });
        }
    }

    async nextTurn() {
        const game = this.game;
        if (!game) {
            return;
        }

        game.turnEndsAt = new Date(Date.now() + 2 * 60 * 1000);
        await FirestoreService.shared.save(game);
    }
}
</script>

<style scoped lang="scss">
@import "mixins";

.container {
    display: flex;
    flex-direction: row;
    @include maxW($br-phone-max) {
        flex-direction: column-reverse;
    }

    .sidebar {
        @include minW($br-phone-max) {
            width: 25rem;
        }

        @include container($lg);
        background: color($color-background);
    }

    .gameboard {
        display: flex;
        flex-direction: column;
        @include container($lg);
    }
}

.ready {
    color: red;
}

.header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    align-content: center;
    align-items: center;
    margin-bottom: spacing($lg);
}

.ready-container {
    padding: spacing($lg) 0 spacing($lg) 0;
    @include maxW($br-tablet-max) {
        text-align: center;
    }
}

.players {
    ul {
        margin: 0;
        padding-left: 2rem;
        /*list-style:;*/
        li {
            margin: 0;

            padding: spacing($sm);

            .player {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
        }
    }
}
.current-player {
    padding: spacing($lg) 0;
}
</style>
