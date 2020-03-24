<template>
    <div class="container">
        <div class="scores">
            <table>
                <thead>
                    <tr>
                        <th v-for="team in teams" :key="`team_header${team}`">
                            Team {{ team + 1 }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-for="team in teams" :key="`team_score_${team}`">
                            {{ scores[team] || 0 }}
                        </td>
                    </tr>
                </tbody>
            </table>
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

<style scoped lang="scss">
@import "variables";
@import "mixins";
$border-stack: 2px solid color($color-primary);
table {
    border-spacing: 0;
    border-collapse: collapse;
    th {
        @include font($lg, normal);
        text-align: center;
        border-bottom: $border-stack;
        padding: spacing($sm) spacing($lg);
        border-top: $border-stack;
        border-left: $border-stack;
        border-right: $border-stack;
        border-bottom: $border-stack;
    }
    td {
        @include font($xl, $bold);
        text-align: center;
        padding: spacing($md);
        border-top: $border-stack;
        border-left: $border-stack;
        border-right: $border-stack;
        border-bottom: $border-stack;
        font-family: $font-stack-mono;
    }
}
</style>
