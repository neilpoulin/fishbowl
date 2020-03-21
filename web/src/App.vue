<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link>
            |
            <router-link to="/about">About</router-link>
            |
            <router-link to="/start">Start</router-link>
        </div>
        <router-view />
    </div>
</template>

<style lang="scss">
@import "common";
@import "styles/variables";

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: color($color-primary, $variant-dark);

        &.router-link-exact-active {
            color: color($color-accent);
        }
    }
}
</style>
