<template>
    <div>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
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
                    return "Setup";
                case Phase.IN_PROGRESS:
                    return "Playing";
                case Phase.FINISHED:
                    return "Finished";
            }
        },
        // eslint-disable-next-line vue/return-in-computed-property
        description(): string {
            switch (this.phase) {
                case Phase.SETUP:
                    return "Enter words to add to the Fish Bowl! When you're done, press the ready button";
                case Phase.IN_PROGRESS:
                    return "Game in progress";
                case Phase.FINISHED:
                    return "We're done!";
            }
        }
    }
});
</script>

<style scoped lang="scss"></style>
