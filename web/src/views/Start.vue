<template>
  <div class="start">
    <h1>Start</h1>
    <p>Games Count: {{ gamesCount }}</p>
    <h1>Has Loaded {{ authLoaded }}</h1>
    <h3>Current UserID {{ currentUserId }}</h3>
    <p>Version: {{ this.$store.state.version }}</p>
    <p>Version with getter: {{ version }}</p>

    <section>
      <create-game />
    </section>

    <hr />
    <div v-if="game">
      <h1>Current Game: {{ game.name }}</h1>
      <button @click="leaveGame">Leave Game</button>
    </div>
    <div v-else>
      <button @click="createGame">Create New Game</button>
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
import { Action, Getter, Mutation, State } from "vuex-class";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { AuthGetters } from "@web/store/modules/auth/AuthGetters";
import { GamesGetters } from "@web/store/modules/games/GamesGetters";
import Games from "@web/store/modules/games/GamesModule";
import { Game } from "@shared/models/Game";

@Component({
  components: { CreateGame }
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
  @Mutation(Games.Mutations.join)
  protected joinGameById!: (params: JoinGameParams) => void;

  @Action(Games.Actions.createGame)
  private createGame!: (params?: CreateGameParams | undefined) => void;

  @Action(Games.Actions.observeAll)
  private startGamesObserver!: () => void;

  joinGame(id: string) {
    this.joinGameById({ gameId: id });
  }

  beforeMount() {
    this.startGamesObserver();
  }
}
</script>

<style scoped lang="scss"></style>
