<template>
    <div class="loader">
        <div>
            <span class="fish"><span>🐠</span></span>
            <span class="message" v-if="message">{{ message }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "FishLoader",
    props: {
        message: { type: String, default: "LOADING..." }
    }
});
</script>

<style scoped lang="scss">
@import "mixins";
@import "variables";

.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: spacing($xxl);
    margin: spacing($xxl);

    .message {
        @include font($lg);
        padding: spacing($lg);
    }

    .fish {
        animation: rotate 1s linear infinite;
        /*display: inline-block;*/
        height: 2rem;
        transform-origin: center;
        width: 2rem;
        background-size: 2rem;
        z-index: 1;
        display: inline-flex;
        flex: 1;
        justify-content: center;
        align-items: center;
    }
}
</style>
