<template>
    <div class="sidebar">
        <section class="players">
            <section class="header" v-if="game">
                <display-name-form :show-label="false" :show-team-name="true" class="display-name-form" />
                <player-ready-button class="ready-button" />
                <div class="scoreboard">
                    <scoreboard :game="game" />
                </div>
            </section>

            <game-video-chat-url :game="game" v-if="false" />

            <div class="invite-players">
                <h4>Link to game</h4>
                <invite-players />
            </div>

            <h4>
                Players <span class="count">({{ sortedPlayers.length }})</span>
            </h4>

            <ul>
                <li v-for="player in sortedPlayers" :key="player.userId">
                    <player-list-item :game="game" :player="player" @deleted="deletePlayer" />
                </li>
            </ul>
        </section>

        <div class="links">
            <router-link to="/games">&larr; All Games</router-link>
        </div>

        <div class="reset-container">
            <button class="btn small danger outlined" @click="restartGame">
                Reset Game
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "@shared/models/Player";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Game } from "@shared/models/Game";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";
import GameVideoChatUrl from "@web/components/GameVideoChatUrl.vue";
import PlayerReadyButton from "@web/components/PlayerReadyButton.vue";
import PlayerListItem from "@web/components/PlayerListItem.vue";
import { Action, Getter } from "vuex-class";
import GameStore from "@web/store/modules/games/GamesModule";
import Scoreboard from "@web/components/Scoreboard.vue";
import InvitePlayers from "@web/components/InvitePlayers.vue";
@Component({
    components: {
        PlayerListItem,
        GameVideoChatUrl,
        DisplayNameForm,
        PlayerReadyButton,
        Scoreboard,
        InvitePlayers
    }
})
export default class GameSidebar extends Vue {
    @Prop({ type: Array as () => Player[], required: true }) players!: Player[];
    @Prop({ type: Object as () => Player[], required: true }) game!: Game;
    @Action(GameStore.Actions.deletePlayer) deletePlayerAction!: (params: { player: Player }) => Promise<void>;
    @Getter(GameStore.Getters.currentPlayer) myPlayer!: Player | undefined;
    @Action(GameStore.Actions.reset) restartGame!: () => Promise<void>;

    get sortedPlayers(): Player[] {
        const sorted = [...this.players];
        sorted.sort((p1, p2) => {
            if (p1.team === p2.team) {
                return (p1.displayName ?? "")?.localeCompare(p2.displayName ?? "");
            } else {
                return (p1.team ?? 0) - (p2.team ?? 0);
            }
        });
        return sorted;
    }

    async deletePlayer(player?: Player) {
        if (!player) {
            return;
        }
        const c = window.confirm(`Are you sure you want to delete "${player.displayName}" from the game?`);
        if (c) {
            await this.deletePlayerAction({ player: player });
        }
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
            margin: 0 0 spacing($lg) 0;
            padding: 0;
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

.scoreboard {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: spacing($lg) 0;
}

.display-name-form {
    margin-bottom: spacing($xl);
    @include maxW($br-phone-max) {
        display: none;
    }
}

.links {
    @include container;
}

.reset-container {
    margin-top: spacing($xl);
}

.invite-players {
    margin-bottom: spacing($xl);
}
</style>
