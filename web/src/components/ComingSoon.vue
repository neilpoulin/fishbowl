<template>
    <div class="hello">
        <h1>Fish Bowl</h1>
        <div class="actions">
            <router-link tag="button" class="btn primary" :to="playRoute">
                Play Now
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RoutePath } from "@web/router";

export default Vue.extend({
    name: "HelloWorld",
    props: {
        msg: String
    },
    data() {
        return {
            playRoute: RoutePath.GAMES
        };
    }
});
</script>

<style scoped lang="scss">
@import "variables";
@import "mixins";

h1 {
    @include font($xxl, $bold);
}
.actions {
    @include container($xl);
}
</style>
