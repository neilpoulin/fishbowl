<template>
    <div class="create-game">
        <h3>Start a new Game</h3>
        <p>Create a new game to share with your friends.</p>
        <label for="new-game-name-input">
            Game Name
        </label>
        <div class="input-field">
            <input type="text" v-model="name" id="new-game-name-input" placeholder="Enter a name for this game" />
            <button class="btn primary" @click="submit" :disabled="saving">Create Game</button>
        </div>
        <alert :alert="alert" v-if="alert" />
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
import { CreateGameParams } from "@web/store/modules/games/Games";
import { RouteBuilder } from "@web/router/router";

const logger = new Logger("CreateGame.vue");

@Component({
    components: { Alert }
})
export default class GameState extends Vue {
    name = "";
    saving = false;
    alert: AlertMessage | null = null;

    @Action(Games.Actions.createGame)
    private createGame!: (params?: CreateGameParams | undefined) => Promise<Game>;

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

        await this.$router.push(RouteBuilder.game(game.id));
    }

    validate(): AlertMessage | null {
        if (isBlank(this.name)) {
            return AlertMessage.error("Please enter a game name");
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
@import "mixins";
@import "variables";
.create-game {
    label {
        @include font($base, $bold);
        font-weight: bold;
    }
    .input-field {
        display: flex;
        flex-direction: row;
        input {
            width: 25rem;
            margin-right: spacing($md);
        }

        @include maxW($br-tablet-min) {
            flex-direction: column;
            input {
                margin-bottom: spacing($base);
                width: unset;
                margin-right: 0;
            }
        }
    }
}
</style>
