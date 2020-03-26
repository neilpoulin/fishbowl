<template>
    <div
        class="countdown"
        :class="{ hidden: !secondsLeftMs, preTurn: !turnStarted }"
    >
        <span class="countdown-label" v-if="!turnStarted">
            The next turn will begin in
        </span>
        <span class="countdown-label" v-if="turnStarted">
            Time left
        </span>
        <h1 class="ticker">{{ secondsLeftMs | formatDuration }}</h1>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import Logger from "@shared/Logger";
const logger = new Logger("Countdown.vue");
@Component({
    filters: {
        formatDuration(ms: number | undefined): string {
            if (ms === undefined) {
                return "0:00";
            }
            return new Date(ms).toISOString().substr(15, 4);
        }
    }
})
export default class Countdown extends Vue {
    @Prop({ type: Date, required: true }) turnStartTime!: Date;
    @Prop({ type: Date, required: true }) turnEndTime!: Date;

    turnStarted = false;
    secondsLeftMs: number | null = null;
    interval: number | null = null;

    @Watch("turnEndTime")
    init() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            this.updateTimeRemaining();
        }, 100);
    }

    mounted() {
        this.init();
        logger.info("Countdown timer mounted");
    }

    destroyed() {
        logger.info("Countdown timer destroyed");
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    updateTimeRemaining() {
        const turnStarted = this.turnStartTime < new Date();
        if (turnStarted && !this.turnStarted) {
            this.startTurn();
        }
        this.turnStarted = turnStarted;

        const time = this.turnStarted ? this.turnEndTime : this.turnStartTime;

        const diff = time.getTime() - Date.now();
        if (diff < 0) {
            this.secondsLeftMs = null;
            this.endTurn();
            return;
        }
        this.secondsLeftMs = diff;
    }

    startTurn() {
        this.$emit("started");
    }

    endTurn() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.secondsLeftMs = null;
        this.$emit("ended");
    }
}
</script>

<style scoped lang="scss">
@import "variables";
.ticker {
    font-family: $font-stack-mono;

    &.preTurn {
        color: color($color-danger);
    }
}

.hidden {
    opacity: 0;
}
</style>
