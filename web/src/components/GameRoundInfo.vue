<template>
    <div class="round-info">
        <span class="tagline"><span v-if="showUpNext">Next Up: </span>Round {{ roundLabel }}</span>
        <div v-if="round === 0">
            <h3>Taboo Round</h3>
            <p>
                You have {{ roundDurationMinutes }} {{ roundDurationUnit }} to have your team guess your word. You can say whatever you
                would like (except for the word or rhymes) to help your team guess - no hand gestures.
            </p>
        </div>
        <div v-else-if="round === 1">
            <h3>Password Round</h3>
            <p>
                You may only use a single word to get your teammates to guess your secret word. The words in this round are the same words
                that were used in the Taboo Round. It is important to remember the words from the previous round as this round is more
                challenging!
            </p>
            <p>
                <i>Alternative Option:</i> When playing with smaller or younger groups, consider allowing two words to guess the secret
                word.
            </p>
        </div>
        <div v-else-if="round === 2">
            <h3>Charades Round</h3>
            <p>
                Your team must guess the word and you are not allowed to speak. You may only use body gestures and “act it out”, like in
                Charades. The words in this round are the same words from the previous rounds. If you can remember the words from previous
                rounds, this is a good time to score some major points!
            </p>
        </div>
        <div v-else>
            <h3>Bonus Round(s)</h3>
            <p>
                We're in uncharted waters here. You can make up your own rules, or start the game over.
            </p>
            <p>
                Some options for a bonus round are:
            </p>
            <ul>
                <li><strong>Sounds:</strong> where you may not use any words -- only sounds.</li>
                <li>
                    <strong>Pictonary Round:</strong> you have to draw the word. You can do this on video chat services like Zoom by using
                    the whiteboard / share screen + annotate functionality
                </li>
            </ul>
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

    get roundDurationUnit(): string {
        if (this.roundDurationMinutes === "1") {
            return "minute";
        }
        return "minutes";
    }

    get roundLabel(): string {
        if (this.round < 3 || this.showUpNext) {
            return `${this.round + 1}`;
        }

        return `${this.round + 1}+`;
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
