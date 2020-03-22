<template>
    <div class="container">
        <div>
            <div class="input-container">
                <h3>Add Words</h3>
                <div class="word-entry input-field">
                    <input
                        type="text"
                        v-model="wordInput"
                        placeholder="Enter a word"
                    />
                    <button class="btn primary" @click="submit">Add</button>
                    <alert v-if="alert" :alert="alert" />
                </div>
            </div>
            <h4>Your Words</h4>
            <ul v-if="currentWords.length > 0">
                <li v-for="(word, i) in currentWords" :key="i">
                    {{ word.word }}
                </li>
            </ul>
            <div v-else>
                <p>No words submitted yet!</p>
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
@Component({
    components: { Alert }
})
export default class GameSubmitWords extends Vue {
    @Getter(GamesGetters.submittedWords) currentWords!: WordEntry[];
    @Getter(GamesGetters.submittedWordsError) alert:
        | AlertMessage
        | undefined
        | null;
    @Action(GamesActions.addWord) addWord!: (
        CreateGpayload: AddWordParams
    ) => Promise<void>;

    wordInput = "";

    async submit() {
        const word = this.wordInput;
        await this.addWord({ word: word });
        this.wordInput = "";
    }
}
</script>

<style scoped lang="scss">
@import "variables";
@import "mixins";

.input-container {
    background-color: color($color-background, $variant-dark);
    @include container($lg);
    @include rounded();
    margin-bottom: spacing($lg);
}
.word-entry {
    display: flex;
    flex-direction: row;
    input {
        width: 20rem;
        margin-right: spacing($lg);
    }
}
</style>
