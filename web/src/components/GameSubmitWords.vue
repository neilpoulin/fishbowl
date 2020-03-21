<template>
    <div class="container">
        <div>
            <h3>Add Words</h3>
            <div class="word-entry input-field">
                <input type="text" v-model="wordInput" />
                <button class="btn primary" @click="submit">Add</button>
                <alert v-if="alert" :alert="alert" />
            </div>

            <h3>Your Words</h3>
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
        payload: AddWordParams
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
.word-entry {
    display: flex;
    flex-direction: row;
    input {
        width: 20rem;
        margin-right: spacing($lg);
    }
}
</style>
