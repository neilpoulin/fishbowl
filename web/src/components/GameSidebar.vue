<template>
    <div class="sidebar">
        <section class="players">
            <section class="header" v-if="game">
                <h2>{{ game.name }}</h2>
            </section>
            <display-name-form :show-label="true" />
            <hr />
            <h4>
                Players <span class="count">({{ players.length }})</span>
            </h4>
            <ul>
                <li v-for="player in players" :key="player.userId">
                    <div
                        class="player"
                        :class="{
                            activePlayer: currentPlayer === player.userId,
                            activeTeam:
                                currentTeam !== undefined &&
                                player.team === currentTeam
                        }"
                    >
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
                            Team {{ player.team + 1 }}
                        </span>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "@shared/models/Player";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Game, Phase } from "@shared/models/Game";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";

@Component({
    components: {
        DisplayNameForm
    }
})
export default class GameSidebar extends Vue {
    @Prop({ type: Array as () => Player[], required: true }) players!: Player[];
    @Prop({ type: Object as () => Player[], required: true }) game!: Game;
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

    get showTeams(): boolean {
        return (this.game?.phase ?? Phase.SETUP) > Phase.SETUP;
    }
}
</script>

<style scoped lang="scss">
@import "variables";
@import "mixins";
.players {
    ul {
        margin: 0;
        padding-left: 0;
        list-style: none;
        li {
            margin: 0;
            padding: spacing($sm);
            .player {
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                @include container($md);
                @include rounded;
                background-color: color($color-background, $variant-dark);

                &.activeTeam {
                    background-color: color($color-accent, $variant-light);
                }

                &.activePlayer {
                    border: 2px solid color($color-foreground);
                }
            }
        }
    }
}

.ready {
    color: color($color-accent, $variant-dark);
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
</style>
