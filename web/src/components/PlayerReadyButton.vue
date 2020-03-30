<template>
    <div class="button-container" v-if="showButton">
        <button class="btn light" :class="{ danger: isReady, primary: !isReady, outlined: isReady }" @click="togglePhase">
            {{ isReady ? "Not Ready" : "Ready" }}
        </button>
        <alert v-if="alert" :alert="alert" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Action, Getter } from "vuex-class";
import Player from "@shared/models/Player";
import Games from "@web/store/modules/games/GamesModule";
import Component from "vue-class-component";
import { Game, Phase } from "@shared/models/Game";
import { SetPhaseParams } from "@web/store/modules/games/Games";
import { AlertMessage } from "@web/util/AlertMessage";
import Alert from "@web/components/Alert.vue";
@Component({
    components: { Alert }
})
export default class PlayerReadyButton extends Vue {
    @Getter(Games.Getters.currentPlayer) player!: Player | null;
    @Getter(Games.Getters.currentGame) game!: Game | null;
    @Action(Games.Actions.setPlayerPhase) setPhase!: (params: SetPhaseParams) => void;

    alert?: AlertMessage | null = null;

    nextPhase() {
        let phase = this.player?.phase ?? Phase.SETUP;

        if (phase === Phase.SETUP && this.game?.getWordsForUser(this.player?.userId).length === 0) {
            this.alert = AlertMessage.warn('Please enter a few words before clicking "ready"');
            return;
        } else {
            this.alert = null;
        }

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
        return (this.game?.phase ?? Phase.SETUP) < (this.player?.phase ?? Phase.SETUP);
    }

    get showButton(): boolean {
        return this.game?.phase === Phase.SETUP;
    }
}
</script>

<style scoped lang="scss">
.button-container {
    display: flex;
    button {
        flex: 1;
    }
}
</style>
