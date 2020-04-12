<template>
    <div class="signup">
        <div class="centered">
            <h1>{{ pageName }}</h1>
            <p>Set up a display name to continue</p>

            <display-name-form @saved="saved" :always-show-save="true" save-label="Continue" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";
import { RoutePath } from "@web/router/router";
import { auth } from "@web/config/FirebaseConfig";
import { Action, Getter } from "vuex-class";
import AuthStore from "@web/store/modules/auth/AuthModule";
import Logger from "@shared/Logger";

const logger = new Logger("Signup.vue");

@Component({
    components: {
        DisplayNameForm
    }
})
export default class Signup extends Vue {
    @Action(AuthStore.Actions.signInAnonymously) signInAnonymously!: (params: { displayName?: string }) => Promise<void>;
    @Getter(AuthStore.Getters.loginContinueUrl) continueUrl!: string | null;
    pageName = "Sign Up";

    async saved(displayName: string) {
        if (!auth().currentUser) {
            await this.signInAnonymously({ displayName });
        }

        const continueUrl = this.continueUrl;
        if (continueUrl) {
            logger.info("Navigating to nextUrl", continueUrl);
            await this.$router.push(continueUrl);
        } else {
            logger.info("Just going to /games");
            await this.$router.push(RoutePath.GAMES);
        }
    }
}
</script>

<style lang="scss">
@import "variables";
@import "mixins";
.signup {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-top: spacing($xxl);

    .centered {
        display: flex;
        flex-direction: column;
        /*display: inline-block;*/
        /*max-width: 600px;*/
    }
}
</style>
