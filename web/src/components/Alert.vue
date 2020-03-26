<template>
    <div class="alert" :class="[alert.level]">
        <span class="message">{{ alert.message }}</span>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { AlertMessage } from "@web/util/AlertMessage";
// import test from "vue-pro"
@Component({
    props: {
        alert: { type: Object as () => AlertMessage, required: true }
    }
})
export default class Alert extends Vue {}
</script>

<style scoped lang="scss">
@import "variables";
@import "mixins";

.alert {
    @include container {
        @include rounded;
        margin: spacing($lg) 0;
    }

    .message {
        color: black;
        @include font($md);
    }

    &.error {
        background: color($color-danger);

        .message {
            color: white;
        }
    }

    &.warn {
        background: wheat;
    }

    &.info {
        background: aquamarine;
    }

    &.success {
        background: darkseagreen;
    }
}
</style>
