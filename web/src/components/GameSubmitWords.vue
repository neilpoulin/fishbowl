<template>
    <div class="word-container">
        <div class="input-container">
            <div class="title">
                <h3 class="">Add Words</h3>
                <p>
                    Add 3 - 5 words to be used in the game. Each word must be a
                    <a
                        href="https://www.google.com/search?q=what+is+a+noun&rlz=1C5CHFA_enUS810US810&oq=what+is+a+noun&aqs=chrome.0.69i59j0l6j69i60.2269j0j4&sourceid=chrome&ie=UTF-8"
                        target="_blank"
                        >noun</a
                    >.
                </p>
            </div>
            <div class="word-entry input-field">
                <input type="text" v-model="wordInput" placeholder="Enter a word" @keyup.enter="submit" />
                <button class="btn secondary" @click="submit">
                    Add
                </button>
            </div>
            <alert v-if="alert" :alert="alert" />
            <div class="your-words">
                <h4>
                    Words Added <span v-if="currentWords.length > 0">({{ currentWords.length }})</span>
                </h4>
                <div v-if="currentWords.length > 0">
                    <ul>
                        <li v-for="(word, i) in currentWords" :key="i">
                            {{ word.word }}
                        </li>
                    </ul>
                    <div class="ready-container">
                        <player-ready-button />
                    </div>
                </div>
                <div v-else>
                    <p>You have not added any words, yet. Add a few words to continue.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { WordEntry } from "@shared/models/Game";
import { Action, Getter } from "vuex-class";
import { GamesGetters } from "@web/store/modules/games/GamesGetters";
import { GamesActions } from "@web/store/modules/games/GamesActions";
import { AlertMessage } from "@web/util/AlertMessage";
import Alert from "@web/components/Alert.vue";
import { AddWordParams } from "@web/store/modules/games/Games";
import PlayerReadyButton from "@web/components/PlayerReadyButton.vue";

@Component({
    components: { PlayerReadyButton, Alert }
})
export default class GameSubmitWords extends Vue {
    @Getter(GamesGetters.submittedWords) currentWords!: WordEntry[];
    @Getter(GamesGetters.submittedWordsError) alert: AlertMessage | undefined | null = undefined;
    @Action(GamesActions.addWord) addWord!: (payload: AddWordParams) => Promise<void>;

    wordInput = "";

    async submit() {
        const word = this.wordInput;
        this.wordInput = "";
        await this.addWord({ word: word });
        if (this.alert) {
            this.wordInput = word;
        }
    }
}
</script>

<style scoped lang="scss">
@import "variables";
@import "mixins";

.word-container {
    display: flex;
    flex-direction: column;
}

.input-container {
    background-color: color($color-primary, $variant-base);
    @include container($lg);
    @include rounded($cornerRadiusLg);
    @include shadowbox;
    margin-bottom: spacing($lg);
    color: color($color-text, $variant-light);
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
        margin-bottom: spacing($lg);
        a {
            color: color($color-text, $variant-light);
            &:visited {
                color: color($color-text, $variant-light);
            }
        }
    }
}

.word-entry {
    display: flex;
    flex-direction: row;
    flex: 1;
    input {
        width: 20rem;
        flex: 1;
        margin-right: spacing($lg);
    }
}

.your-words {
    margin-top: spacing($xl);

    ul {
        list-style: none;
        margin-left: 0;
        padding-left: 0;
        li {
            margin-bottom: spacing($sm);
        }
    }
}

.ready-container {
    margin-top: spacing($xxl);
}
</style>
