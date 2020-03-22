<template>
    <div id="app">
        <div id="nav">
            <template v-for="route in routes">
                <router-link
                    :to="route.path"
                    :key="route.path"
                    :class="{ home: route.path === '/' }"
                >
                    {{ route.name }}
                </router-link>
            </template>

            <!--            <router-link to="/">Home</router-link>-->
            <!--            |-->
            <!--            <router-link to="/about">About</router-link>-->
            <!--            |-->
            <!--            <router-link to="/start">Start</router-link>-->
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { routes } from "@web/router";
@Component
export default class App extends Vue {
    routes = routes.filter(r => r.showInNav);
}
</script>

<style lang="scss">
@import "common";
@import "styles/variables";

#nav {
    $defaultBg: color($color-background, $variant-dark);
    $selectedBg: color($color-background, $variant-light);
    display: flex;
    background-color: $defaultBg;
    flex: 1;
    > * {
        padding: spacing($lg);
    }
    a {
        transition: all 0.2s ease-in;
        font-weight: bold;
        color: color($color-primary, $variant-dark);
        text-decoration: none;
        &.router-link-exact-active,
        &.router-link-active:not(.home) {
            color: color($color-accent);
            background-color: $selectedBg;
        }

        &:hover {
            background-color: darken($selectedBg, 5%);
        }
    }
}
</style>
