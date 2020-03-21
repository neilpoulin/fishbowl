import {Phase} from '@shared/models/Game'
<template>
    <div class="container">
        <h1>Game View</h1>
        <display-name-form />
        <player-ready-button />
        <div v-if="game">
            <h3>{{ game.name }}</h3>
        </div>
        <game-submit-words />
        <h4>Players in the game</h4>
        <ul>
            <li v-for="player in players" :key="player.userId">
                {{ player.displayName }}
                <span class="ready" v-if="playerIsReady(player)">Ready</span>
            </li>
        </ul>
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

const logger = new Logger("GameView");
@Component({
    components: { GameSubmitWords, DisplayNameForm, PlayerReadyButton }
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
.ready {
    color: red;
}
</style>
