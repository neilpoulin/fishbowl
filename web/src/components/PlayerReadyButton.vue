<template>
    <button
        class="btn secondary light"
        :class="{ danger: isReady, primary: !isReady }"
        @click="togglePhase"
    >
        {{ isReady ? "Not Ready" : "Ready" }}
    </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Action, Getter } from "vuex-class";
import Player from "@shared/models/Player";
import Games from "@web/store/modules/games/GamesModule";
import Component from "vue-class-component";
import { Game, Phase } from "@shared/models/Game";
import { SetPhaseParams } from "@web/store/modules/games/Games";

@Component
export default class PlayerReadyButton extends Vue {
    @Getter(Games.Getters.currentPlayer) player!: Player | null;
    @Getter(Games.Getters.currentGame) game!: Game | null;
    @Action(Games.Actions.setPlayerPhase) setPhase!: (
        params: SetPhaseParams
    ) => void;

    nextPhase() {
        let phase = this.player?.phase ?? Phase.SETUP;
        if (phase < Phase.FINISHED) {
            phase = phase + 1;
        }
        this.setPhase({ phase });
    }

    previousPhase() {
        let phase = this.player?.phase ?? Phase.SETUP;
        if (phase > 0) {
            phase = phase - 1;
        }
        this.setPhase({ phase });
    }

    togglePhase() {
        const gamePhase = this.game?.phase ?? Phase.SETUP;
        const playerPhase = this.player?.phase ?? Phase.SETUP;
        if (playerPhase > gamePhase) {
            this.previousPhase();
        } else {
            this.nextPhase();
        }
    }

    get isReady(): boolean {
        return (
            (this.game?.phase ?? Phase.SETUP) <
            (this.player?.phase ?? Phase.SETUP)
        );
    }
}
</script>

<style scoped lang="scss"></style>
