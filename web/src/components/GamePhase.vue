<template>
    <div class="phase">
        <h3 class="title">{{ title }}</h3>
        <p class="description">{{ description }}</p>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Phase } from "@shared/models/Game";

export default Vue.extend({
    props: {
        phase: { type: Number as () => Phase, default: Phase.SETUP }
    },
    computed: {
        // eslint-disable-next-line vue/return-in-computed-property
        title(): string {
            switch (this.phase) {
                case Phase.SETUP:
                    return "Welcome to Fish Bowl!";
                case Phase.IN_PROGRESS:
                    return "";
                case Phase.FINISHED:
                    return "";
            }
        },
        // eslint-disable-next-line vue/return-in-computed-property
        description(): string {
            switch (this.phase) {
                case Phase.SETUP:
                    return (
                        "First, enter some words into the fishbowl. These words will be used through out the game. " +
                        "\n\nThe game will start once everyone has pressed\xa0ready"
                    );
                case Phase.IN_PROGRESS:
                    return "Game in progress";
                case Phase.FINISHED:
                    return "We're done!";
            }
        }
    }
});
</script>

<style scoped lang="scss">
.phase > * {
    white-space: pre-wrap;
}
</style>
