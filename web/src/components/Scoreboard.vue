<template>
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
$border-stack: 1px solid color($color-text);
$cornerRadius: 0.8rem;
.scores {
    display: flex;
    /*justify-content: stretch;*/
}
table {
    table-layout: fixed;
    width: 100%;
    flex: 1;
    border-spacing: 0;
    border-collapse: separate;
    border: $border-stack;
    border-radius: $cornerRadius;
    overflow: hidden;

    th {
        @include font($lg, $bold);
        text-align: center;
        padding: spacing($sm) spacing($lg);
        border-top: none;
        border-right: $border-stack;
        //background-color: color($color-primary, $variant-light);
    }
    td {
        @include font($xl);
        text-align: center;
        padding: spacing($md);
        border-top: $border-stack;
        border-right: $border-stack;
        font-family: $font-stack-mono;
    }
    td:first-child,
    th:first-child {
        border-left: none;
    }

    td:last-child,
    th:last-child {
        border-right: none;
    }

    thead:first-child tr:first-child th:first-child,
    tbody:first-child tr:first-child td:first-child {
        border-radius: $cornerRadius 0 0 0;
    }
    thead:last-child tr:last-child th:first-child,
    tbody:last-child tr:last-child td:first-child {
        border-radius: 0 0 0 $cornerRadius;
    }
}
</style>
