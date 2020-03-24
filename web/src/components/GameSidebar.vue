<template>
    <div class="sidebar">
        <section class="players">
            <section class="header" v-if="game">
                <span class="game-label">Game</span>
                <h2>{{ game.name }}</h2>
                <player-ready-button class="ready-button" />
            </section>

            <display-name-form :show-label="true" class="display-name-form" />
            <game-video-chat-url :game="game" />
            <hr />
            <h4>
                Players <span class="count">({{ sortedPlayers.length }})</span>
            </h4>
            <ul>
                <li v-for="player in sortedPlayers" :key="player.userId">
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

        <div class="links">
            <router-link to="/games">&larr; All Games</router-link>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "@shared/models/Player";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Game, Phase } from "@shared/models/Game";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";
import GameVideoChatUrl from "@web/components/GameVideoChatUrl.vue";
import PlayerReadyButton from "@web/components/PlayerReadyButton.vue";
@Component({
    components: {
        GameVideoChatUrl,
        DisplayNameForm,
        PlayerReadyButton
    }
})
export default class GameSidebar extends Vue {
    @Prop({ type: Array as () => Player[], required: true }) players!: Player[];
    @Prop({ type: Object as () => Player[], required: true }) game!: Game;
    playerIsReady(player: Player): boolean {
        const gamePhase = this.game?.phase ?? Phase.SETUP;
        return (player.phase ?? Phase.SETUP) > gamePhase;
    }

    get sortedPlayers(): Player[] {
        const sorted = [...this.players];
        sorted.sort((p1, p2) => {
            if (p1.team === p2.team) {
                return (p1.displayName ?? "")?.localeCompare(
                    p2.displayName ?? ""
                );
            } else {
                return (p1.team ?? 0) - (p2.team ?? 0);
            }
        });
        return sorted;
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
    margin-bottom: spacing($lg);
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
    margin-bottom: spacing($xl);
    display: flex;
    flex-direction: column;
    .ready-button {
        margin-top: spacing($lg);
        flex: 1;
    }
}

.display-name-form {
    margin-bottom: spacing($xl);
}

hr {
    margin: spacing($xl) 0;
}
.links {
    @include container;
}
</style>
