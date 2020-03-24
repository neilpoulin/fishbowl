<template>
    <div class="signup">
        <div class="centered">
            <h1>{{ pageName }}</h1>
            <p>Set up a display name to continue</p>

            <display-name-form
                @saved="saved"
                :always-show-save="true"
                save-label="Continue"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";
import { RoutePath } from "@web/router";

@Component({
    components: {
        DisplayNameForm
    }
})
export default class Signup extends Vue {
    pageName = "Sign Up";

    async saved() {
        if (this.$route.params.nextUrl != null) {
            this.$router.push(this.$route.params.nextUrl);
        } else {
            this.$router.push(RoutePath.GAMES);
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
