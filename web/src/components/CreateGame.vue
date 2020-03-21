<template>
    <div class="create-game">
        <h1>Start a new Game</h1>
        <div class="input-field">
            <label for="new-game-name-input">
                Game Name
            </label>
            <input type="text" v-model="name" id="new-game-name-input" />
        </div>

        <alert :alert="alert" v-if="alert" />
        <button class="btn" @click="submit">Create Game</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Action } from "vuex-class";
import Component from "vue-class-component";
import Games from "@web/store/modules/games/GamesModule";
import { Game } from "@shared/models/Game";
import Logger from "@shared/Logger";
import { AlertMessage } from "@web/util/AlertMessage";
import Alert from "@web/components/Alert.vue";
import { isBlank } from "@shared/util/ObjectUtil";

const logger = new Logger("CreateGame.vue");

@Component({
    components: { Alert }
})
export default class GameState extends Vue {
    name = "";
    saving = false;
    alert: AlertMessage | null = null;

    @Action(Games.Actions.createGame)
    private createGame!: (
        params?: CreateGameParams | undefined
    ) => Promise<Game>;

    async submit() {
        const validateAlert = this.validate();
        if (validateAlert) {
            this.alert = validateAlert;
            this.saving = false;
            return;
        }

        this.saving = true;
        const game = await this.createGame({ name: this.name });
        logger.info("Created game", game);
        this.saving = false;
        this.reset();
    }

    validate(): AlertMessage | null {
        if (isBlank(this.name)) {
            return AlertMessage.error("Please enter a name");
        }

        return null;
    }

    reset() {
        this.name = "";
        this.saving = false;
        this.alert = null;
    }
}
</script>

<style scoped lang="scss">
.create-game {
}
</style>
