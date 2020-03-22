<template>
    <div class="container">
        <div class="sidebar">
            <section class="players">
                <display-name-form :show-label="true" />
                <hr />
                <h4>Players</h4>
                <ul>
                    <li v-for="player in players" :key="player.userId">
                        <div class="player">
                            <span class="name">{{ player.displayName }}</span>
                            <span class="ready" v-if="playerIsReady(player)">
                                Ready
                            </span>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
        <div class="gameboard">
            <section class="header">
                <div v-if="game">
                    <h2>{{ game.name }}</h2>
                </div>
            </section>
            <game-phase />

            <div class="ready-container">
                <player-ready-button />
            </div>
            <game-submit-words />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Logger from "@shared/Logger";
import Games from "@web/store/modules/games/GamesModule";
import { Game, Phase } from "@shared/models/Game";
import { Getter } from "vuex-class";
import Player from "@shared/models/Player";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";
import GameSubmitWords from "@web/components/GameSubmitWords.vue";
import PlayerReadyButton from "@web/components/PlayerReadyButton.vue";

import GamePhase from "@web/components/GamePhase.vue";

const logger = new Logger("GameView");
@Component({
    components: {
        GameSubmitWords,
        DisplayNameForm,
        PlayerReadyButton,
        GamePhase
    }
})
export default class GameView extends Vue {
    @Getter(Games.Getters.currentGame) game?: Game | undefined;

    get players(): Player[] {
        return Object.values(this.game?.players ?? {});
    }

    beforeMount() {
        const gameId = this.$route.params.gameId;
        if (gameId) {
            this.$store.dispatch(Games.Actions.join, { gameId });
        }

        logger.info(`Game ID = ${gameId}`);
    }

    playerIsReady(player: Player): boolean {
        const gamePhase = this.game?.phase ?? Phase.SETUP;
        return (player.phase ?? Phase.SETUP) > gamePhase;
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
}

.ready-container {
    padding: spacing($lg) 0 spacing($lg) 0;
    text-align: center;
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
</style>
