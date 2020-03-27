<template>
    <div class="loading">
        <FishLoader />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DisplayNameForm from "@web/components/DisplayNameForm.vue";
import { RoutePath } from "@web/router";
import { Getter } from "vuex-class";
import AuthStore from "@web/store/modules/auth/AuthModule";
import { Watch } from "vue-property-decorator";
import FishLoader from "@web/components/FishLoader.vue";

@Component({
    components: {
        DisplayNameForm,
        FishLoader
    }
})
export default class WaitForAuth extends Vue {
    @Getter(AuthStore.Getters.authLoaded) authLoaded!: boolean;
    @Watch("authLoaded") onAuthLoaded(authLoaded, oldValue) {}

    async goToNextRoute(displayName: string) {
        if (this.$route.params.nextUrl != null) {
            await this.$router.push(this.$route.params.nextUrl);
        } else {
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
