<template>
    <div id="app">
        <div id="nav" v-if="!$route.meta.hideNav">
            <template>
                <template v-for="route in routes">
                    <router-link
                        :to="route.path"
                        :key="route.path"
                        :class="{ home: route.path === '/' }"
                    >
                        {{ route.name }}
                    </router-link>
                </template>
            </template>
        </div>
        <router-view />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Auth from "@web/store/modules/auth/AuthModule";
import { routes } from "@web/router";
import { Getter } from "vuex-class";

@Component
export default class App extends Vue {
    routes = routes.filter(r => r.showInNav);
    @Getter(Auth.Getters.authLoaded) authLoaded!: boolean;
    @Getter(Auth.Getters.currentUserId) userId!: boolean;
}
</script>

<style lang="scss">
@import "common";
@import "styles/variables";

#nav {
    //$defaultBg: color($color-background, $variant-dark);
    //$selectedBg: color($color-background, $variant-light);
    display: flex;
    //background-color: $defaultBg;
    flex: 1;
    height: $nav-height;
    > * {
        padding: spacing($lg);
    }

    a {
        transition: background-size cubic-bezier(0, 0.5, 0, 1) 0.3s;
        font-weight: bold;
        color: color($color-primary, $variant-dark);
        text-decoration: none;

        background-image: linear-gradient(
            lighten(color($color-accent), 15%),
            lighten(color($color-accent), 15%)
        );
        background-position: 0 100%;
        background-repeat: no-repeat;
        background-size: 100% 0;

        &.router-link-exact-active {
            color: color($color-accent);
            //background-color: $selectedBg;

            background-image: linear-gradient(
                lighten(color($color-accent), 15%),
                lighten(color($color-accent), 15%)
            );
            background-position: 0 100%;
            background-repeat: no-repeat;
            background-size: 100% 0.5rem;
        }

        &:hover {
            //background-color: darken($selectedBg, 5%);
            background-image: linear-gradient(
                lighten(color($color-accent), 15%),
                lighten(color($color-accent), 15%)
            );
            background-position: 0 100%;
            background-repeat: no-repeat;
            background-size: 100% 0.8rem;
            text-decoration: none;
        }
    }
}
</style>
