<template>
    <div id="app">
        <div id="nav" v-if="!$route.meta.hideNav">
            <div class="mask"></div>
            <div class="links">
                <router-link to="/" class="logo"
                    ><h1>FishBowl</h1>
                </router-link>
                <template v-for="route in routes">
                    <router-link
                        :to="route.path"
                        :key="route.path"
                        :class="{ home: route.path === '/' }"
                    >
                        {{ route.name }}
                    </router-link>
                </template>
            </div>
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
    position: relative;
    .links {
        height: $nav-height;
        display: flex;
        flex: 1;
        position: relative;
        background-color: rgba(color($color-background), 0.3);
        > * {
            padding: spacing($lg);
        }

        .logo {
            text-decoration: none;
            color: color($color-primary);
            h1 {
                @include logo;
                margin: 0;
                font-size: 4rem;
            }

            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                color: color($color-primary, $variant-dark);
            }
        }
    }

    .mask {
        background: url("/images/fishbowl_banner.png") repeat-x center -2rem,
            color($color-primary, $variant-light);
        background-size: 44%;
        filter: blur(2px);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        @include maxW($br-phone-max) {
            background-size: 120%;
            justify-content: center;
        }
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

        &.router-link-exact-active:not(.logo) {
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

        &:hover:not(.logo) {
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
