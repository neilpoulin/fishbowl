<template>
    <div class="container">
        <h1>Game View</h1>
        <display-name-form />
        <div v-if="game">
            <h3>{{ game.name }}</h3>
        </div>

        <ul>
            <li v-for="player in players" :key="player.userId">
                {{ player.displayName }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Logger from "@shared/Logger";
import Games from "@web/store/modules/games/GamesModule";
import { Game } from "@shared/models/Game";
import { Getter } from "vuex-class";
import { Player } from "@shared/models/Player";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";

const logger = new Logger("GameView");
@Component({
    components: { DisplayNameForm }
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
}
</script>

<style scoped lang="scss"></style>
