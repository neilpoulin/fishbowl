<template>
    <div class="container">
        <div class="scores">
            <div class="score-container" v-for="team in teams" :key="team">
                <span class="team"> Team {{ team }} </span>:
                <span class="score">
                    {{ scores[team] || 0 }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Game } from "@shared/models/Game";
import { Prop } from "vue-property-decorator";
import Component from "vue-class-component";

@Component
export default class Scoreboard extends Vue {
    @Prop({ type: Object as () => Game, required: true }) game!: Game;

    get scores(): { [team: number]: number } {
        return this.game?.scores ?? {};
    }

    get teams(): number[] {
        const teams: number[] = [];
        if (!this.game) {
            return teams;
        }
        for (let team = 0; team < this.game.numberOfTeams; team++) {
            teams.push(team);
        }
        return teams;
    }
}
</script>

<style scoped lang="scss"></style>
