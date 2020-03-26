<template>
    <div class="phase">
        <div v-if="phase === Phase.SETUP" class="description">
            <h3 class="title">Welcome to <span class="logo">FishBowl</span></h3>
            <p>
                First, enter some words into the fishbowl. These words will be
                used through out the game.
            </p>

            <p>
                <span>Invite friends by sending them this link:</span>
            </p>
            <div class="link-container">
                <div class="inner">
                    <span class="game-link">{{ gameUrl }}</span>
                </div>
            </div>

            <p>
                The game will start once everyone has pressed their
                ready&nbsp;button
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Phase } from "@shared/models/Game";

export default Vue.extend({
    props: {
        phase: { type: Number as () => Phase, default: Phase.SETUP }
    },
    filters: {
        trim(input?: string | undefined): string | undefined {
            return input?.trim();
        }
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
        gameUrl(): string {
            return window.location.href;
        },
        Phase(): object {
            return Phase;
        }
    }
});
</script>

<style scoped lang="scss">
@import "mixins";

.logo {
    @include logo;
}

.phase {
    width: 100%;
    overflow: hidden;
}

.link-container {
    border: 1px solid rgba(color($color-shadow), 0.3);
    overflow: hidden;

    @include rounded($cornerRadiusXl);
    padding-right: spacing($md);
    background-color: color($color-background, $variant-light);
    .inner {
        overflow: auto;
        @include container($md);
    }
}

.game-link {
    min-width: 0;
    overflow: auto;
}
</style>
