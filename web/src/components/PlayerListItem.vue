<template>
    <div
        class="player"
        :class="{
            activePlayer: currentPlayer === player.userId,
            activeTeam:
                currentTeam !== undefined && player.team === currentTeam,
            editing: editing
        }"
        @click="editing = !editing"
    >
        <span class="name">{{ player.displayName }}</span>
        <template v-if="!editing">
            <span class="ready" v-if="playerIsReady(player) && !showTeams">
                Ready
            </span>
            <span class="team" v-if="showTeams && player.team !== undefined">
                Team {{ player.team + 1 }}
            </span>
        </template>
        <template v-else>
            <button
                class="btn small danger delete-button"
                @click="deletePlayer"
            >
                delete
            </button>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "@shared/models/Player";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Game, Phase } from "@shared/models/Game";

@Component
export default class PlayerListItem extends Vue {
    @Prop({ type: Object as () => Player, required: true }) player!: Player;
    @Prop({ type: Object as () => Game, required: true }) game!: Game;

    editing = false;

    get showTeams(): boolean {
        return (this.game?.phase ?? Phase.SETUP) > Phase.SETUP;
    }

    playerIsReady(player: Player): boolean {
        const gamePhase = this.game?.phase ?? Phase.SETUP;
        return (player.phase ?? Phase.SETUP) > gamePhase;
    }

    get currentTeam(): number | undefined {
        return this.game?.currentTeam;
    }

    get currentPlayer(): string | undefined {
        return this.game?.getActivePlayer()?.userId;
    }

    async deletePlayer() {
        // const c = window.confirm(
        //     `Are you sure you want to delete "${this.player.displayName}" from the game?`
        // );
        // if (c) {
        //     await this.deletePlayerAction({ player: this.player });
        // }
        this.$emit("deleted", this.player);
    }
}
</script>

<style scoped lang="scss">
@import "variables";
@import "mixins";
.player {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    @include container($md);
    @include rounded;
    background-color: color($color-background, $variant-dark);
    transition: all 0.2s ease-in-out;
    position: relative;
    &.activeTeam {
        background-color: color($color-accent, $variant-light);
    }

    &.activePlayer {
        border: 2px solid color($color-foreground);
    }

    &.editing {
        //background-color: color($color-danger);
        .delete-button {
            position: absolute;
            right: spacing($md);
        }
    }
}
</style>
