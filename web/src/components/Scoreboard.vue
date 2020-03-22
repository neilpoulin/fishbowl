<template>
    <div class="container">
        <div class="scores">
            <div class="score-container" v-for="team in teams" :key="team">
                <span class="team"> Team {{ team }} </span>:
                <span class="score">
                    {{ game.scores[team] || 0 }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Getter } from "vuex-class";
import Games from "@web/store/modules/games/GamesModule";
import { Game } from "@shared/models/Game";

export default class Scoreboard extends Vue {
    @Getter(Games.Getters.currentGame) game!: Game;

    get teams(): number[] {
        const teams: number[] = [];
        // if (!this.game) {
        //     return teams;
        // }
        for (let team = 0; team < this.game.numberOfTeams; team++) {
            teams.push(team);
        }
        return teams;
    }
}
</script>

<style scoped lang="scss"></style>
