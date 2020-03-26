<template>
    <div class="round-info">
        <span class="tagline"
            ><span v-if="showUpNext">Next Up: </span>Round {{ round + 1 }}</span
        >
        <div v-if="round === 0">
            <h3>Taboo Round</h3>
            <p>
                You have {{ roundDurationMinutes }} to get your team to guess
                your word or phrase. You may only use your voice - no hand
                gestures. You may not use any of the words in your secret word
            </p>
        </div>
        <div v-else-if="round === 1">
            <h3>Password Round</h3>
            <p>
                You may only use a single word to get your teammates to guess
                your secret word.
            </p>
        </div>
        <div v-else-if="round === 2">
            <h3>Charades Round</h3>
            <p>
                Get your team to guess your secret word without talking. You may
                only use body gestures, like in Charades.
            </p>
        </div>
        <div v-else>
            <h3>Bonus Round</h3>
            <p>
                We're in uncharted waters here. You can make up your own rules,
                or start the game over.
            </p>
            <p>
                Some popular options for a 4th round is a
                <i>sound round</i> where you may not use any words -- only
                sounds.
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ROUND_DURATION_SECONDS } from "@shared/models/Game";

@Component
export default class GameRoundInfo extends Vue {
    @Prop({ type: Number, required: true }) round!: number;
    @Prop({ type: Boolean, default: true }) showUpNext!: boolean;
    get roundDurationMinutes(): string {
        const isWholeNumber = ROUND_DURATION_SECONDS % 60 === 0;
        return (ROUND_DURATION_SECONDS / 60).toFixed(isWholeNumber ? 0 : 1);
    }
}
</script>

<style scoped lang="scss">
@import "variables";
@import "mixins";
.round-info {
    @include rounded;
    @include container;

    .tagline {
        color: color($color-primary);
        @include font($sm, $bold);
    }
}
</style>
