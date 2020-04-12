<template>
    <div
        class="player"
        :class="{
            activePlayer: activePlayer === player.userId,
            activeTeam: currentTeam !== undefined && player.team === currentTeam,
            editing: editing,
            currentUser: isCurrentUser
        }"
        @click="editing = !editing"
    >
        <div class="content">
            <span class="name">{{ player.displayName }}<span v-if="isCurrentUser">&nbsp;(You)</span></span>
            <span class="word-count" v-if="!showTeams">{{ wordCountLabel }}</span>
            <span class="score" v-if="showTeams">{{ player.score || 0 }} points</span>
        </div>
        <div class="status" v-if="!editing">
            <span class="ready" v-if="playerIsReady(player) && !showTeams">
                Ready
            </span>
            <span class="team" v-if="player.team !== undefined"> Team {{ player.team + 1 }} </span>
        </div>
        <div v-else class="actions">
            <button class="btn small danger delete-button" @click="deletePlayer">
                delete
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "@shared/models/Player";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Game, Phase } from "@shared/models/Game";
import AuthModule from "@web/store/modules/auth/AuthModule";
import { Getter } from "vuex-class";

@Component
export default class PlayerListItem extends Vue {
    @Prop({ type: Object as () => Player, required: true }) player!: Player;
    @Prop({ type: Object as () => Game, required: true }) game!: Game;
    @Getter(AuthModule.Getters.currentUserId) currentUserId: string | undefined;
    editing = false;

    get showTeams(): boolean {
        return (this.game?.phase ?? Phase.SETUP) > Phase.SETUP;
    }

    playerIsReady(player: Player): boolean {
        const gamePhase = this.game?.phase ?? Phase.SETUP;
        return (player.phase ?? Phase.SETUP) > gamePhase;
    }

    get isCurrentUser(): boolean {
        return this.player.userId === this.currentUserId;
    }

    get wordCount(): number {
        return (this.game?.wordsByUser(this.player.userId) ?? []).length;
    }

    get wordCountLabel(): string {
        const count = this.wordCount;
        if (count === 0) {
            return "No words added";
        }

        if (count === 1) {
            return `${count} word added`;
        }

        return `${count} words added`;
    }

    get currentTeam(): number | undefined {
        return this.game?.currentTeam;
    }

    get activePlayer(): string | undefined {
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
        background-color: rgba(color($color-success, $variant-light), 0.2);
    }

    &.activePlayer {
        border: 2px solid rgba(color($color-success), 0.2);
    }

    &.editing {
        //background-color: color($color-danger);
        .delete-button {
            position: absolute;
            right: spacing($md);
        }
    }

    .content {
        display: flex;
        flex-direction: column;

        .name {
            @include font($md, $bold);
        }

        .word-count {
            @include font($sm);
        }
    }

    .status {
        display: flex;
        flex-direction: column;
    }

    .ready {
        color: color($color-success);
        @include font($base, $bold);
    }

    .actions {
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
    }

    &.currentUser {
        font-style: italic;
    }
}
</style>
