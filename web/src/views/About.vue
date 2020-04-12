<template>
    <div class="about" :class="{ inline: inline }">
        <h2>How it works</h2>
        <p>
            Join a game and add words into the "fish bowl". The words added should be <strong>nouns</strong>. Players in the game can choose
            how many words to add. Typically, this is around 3-5 words per person.
        </p>
        <p>
            <i>Bonus Option:</i> The players in your game can choose to make the words submitted more specific, such as only submitting only
            animals or proper nouns.
        </p>

        <p>
            When you're finished adding words, hit the "ready" button. You can see on the bottom of the screen the players that are ready as
            well as what team you are on (Team 1 or Team 2). When all players are ready, the game will start!
        </p>

        <p>
            The name of the player that goes first will appear on your screen. If they are on your team, their name will appear in orange.
            If they are on the opposing team, their name will appear in gray. After a brief countdown, a word will appear on the first
            player’s screen. No one else can see this word. The player will attempt to have their teammates guess the word by following the
            rules of the Round. Teammates can guess as many words as they would like until the actual word is guessed. When the actual word
            is guessed, one point is added to the team that is currently playing. A new word will then appear on the first player’s screen.
            This will continue until time runs out and the next team is up! The round ends when the words run out.
        </p>

        <p>
            The game is broken into 3 (or more!) rounds. Here's how they work:
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
import { RoutePath } from "@web/router/router";

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

    .intro {
        @include font($lg);
    }
}

.actions {
    display: flex;
    justify-content: center;
}

.list-wrapper {
    display: flex;

    ul {
        padding: 0;
    }

    li {
        margin: 0 10px;
        text-align: left;
    }
}

.round-info {
    margin-bottom: spacing($lg);
    @include container($lg);
    @include shadowbox;
    @include rounded($cornerRadiusLg);
    background-color: color($color-background);
    color: color($color-text);
}
</style>
