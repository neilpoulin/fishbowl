<template>
    <div class="start">
        <h1>Start</h1>
        <display-name-form />
        <p>Games Count: {{ gamesCount }}</p>
        <h1>Has Loaded {{ authLoaded }}</h1>
        <h3>Current UserID {{ currentUserId }}</h3>
        <p>Version: {{ this.$store.state.version }}</p>
        <p>Version with getter: {{ version }}</p>

        <hr />
        <div v-if="game">
            <h3>Current Game</h3>
            <h1>{{ game.name }}</h1>
            <button @click="leaveGame">Leave Game</button>
        </div>
        <div v-else>
            <create-game />
        </div>
        <div v-if="gamesCount > 0">
            <h2>Available Games</h2>
            <ul>
                <li
                    v-for="(game, index) in allGames"
                    @click="joinGame(game.id)"
                    :key="index"
                >
                    {{ game.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import CreateGame from "@web/components/CreateGame.vue";
import { Getters } from "@web/store/Getters";
import Component from "vue-class-component";
import { Action, Getter, State } from "vuex-class";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { AuthGetters } from "@web/store/modules/auth/AuthGetters";
import { GamesGetters } from "@web/store/modules/games/GamesGetters";
import Games from "@web/store/modules/games/GamesModule";
import { Game } from "@shared/models/Game";
import router, { RouteBuilder } from "@web/router";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";

@Component({
    components: { DisplayNameForm, CreateGame }
})
export default class Start extends Vue {
    @State auth!: AuthState;
    @Getter(AuthGetters.currentUserId) currentUserId: number | undefined;
    @Getter(AuthGetters.authLoaded) authLoaded!: boolean;
    @Getter(Getters.appVersion) version!: number;
    @Getter(GamesGetters.count) gamesCount!: number;
    @Getter(Games.Getters.currentGame) game: Game | undefined;
    @Getter(Games.Getters.all) allGames!: Game[];

    @Action(Games.Actions.leaveGame) leaveGame!: () => void;
    @Action(Games.Actions.join)
    protected joinGameById!: (params: JoinGameParams) => void;

    @Action(Games.Actions.createGame)
    private createGame!: (params?: CreateGameParams | undefined) => void;

    @Action(Games.Actions.observeAll)
    private startGamesObserver!: () => void;

    async joinGame(id: string) {
        await this.joinGameById({ gameId: id });
        await router.push(RouteBuilder.game(id));
    }

    beforeMount() {
        this.startGamesObserver();
    }
}
</script>

<style scoped lang="scss"></style>
