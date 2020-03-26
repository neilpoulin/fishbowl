<template>
    <div class="about" :class="{ inline: inline }">
        <h1>About</h1>
        <p>
            Want to play your favorite game, without getting CVOD-19? Now you
            can play online!
        </p>
        <h2>How it works</h2>
        <p>
            When you first join a game, you'll add some words to the "fish
            bowl". These words are <strong>nouns</strong>. Once you're finished
            adding words, you'll hit the "ready" button. Once everyone is ready,
            the game will start.
        </p>
        <p>
            The game is broken into 3 (or more) rounds. Here's how they work:
        </p>

        <game-round-info :show-up-next="false" :round="0" class="round-info" />
        <game-round-info :show-up-next="false" :round="1" class="round-info" />
        <game-round-info :show-up-next="false" :round="2" class="round-info" />
        <game-round-info :show-up-next="false" :round="3" class="round-info" />

        <div class="actions">
            <router-link tag="button" class="btn primary" :to="playRoute">
                Play Now
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameRoundInfo from "@web/components/GameRoundInfo.vue";
import Component from "vue-class-component";
import { RoutePath } from "@web/router";

@Component({
    components: {
        GameRoundInfo
    },
    props: {
        inline: Boolean
    },
    data() {
        return {
            playRoute: RoutePath.GAMES
        };
    }
})
export default class About extends Vue {}
</script>

<style scoped lang="scss">
@import "variables";
@import "mixins";
h3 {
    margin: 40px 0 0;
}

.about {
    display: flex;
    flex-direction: column;
    text-align: left;
    &:not(.inline) {
        @include container($xl);
        max-width: $pageMaxWidth;
        margin: 0 auto;
    }

    h1 {
        @include font($xl, $bold);
    }
}

.actions {
    display: flex;
    justify-content: center;
}

.list-wrapper {
    display: flex;

    ul {
        /*list-style-type: circle;*/
        padding: 0;
    }

    li {
        /*display: inline-block;*/
        margin: 0 10px;
        text-align: left;
    }
}

.round-info {
    margin-bottom: spacing($lg);

    @include container($lg);
    @include shadowbox;
    @include rounded($cornerRadiusLg);
}
</style>
