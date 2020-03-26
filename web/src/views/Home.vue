<template>
    <div class="home">
        <div class="header">
            <div class="content">
                <div class="mask"></div>
                <h1>Fish Bowl</h1>
                <div class="actions">
                    <router-link
                        tag="button"
                        class="btn secondary dark"
                        :to="playRoute"
                    >
                        Play Now
                    </router-link>
                </div>
            </div>
        </div>

        <about :inline="true" class="about-section" />
    </div>
</template>

<script lang="ts">
import About from "@web/views/About.vue";
import { RoutePath } from "@web/router";

export default {
    name: "Home",
    components: {
        About
    },
    data() {
        return {
            playRoute: RoutePath.GAMES
        };
    }
};
</script>

<style lang="scss" scoped>
@import "variables";
@import "mixins";
.home {
    text-align: center;
    max-width: $pageMaxWidth;
    margin: 0 auto;
    img {
        margin: spacing($xl) 0;
        max-width: 100%;
    }
    padding-bottom: 30rem;
}

.header {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    background: url("/images/fishbowl_final.png") no-repeat center center;
    $padding: spacing($xl);
    padding: $padding;
    height: 796px;

    @include maxW($br-phone-max) {
        height: calc(100vh - #{$nav-height} - #{2 * $padding});
    }

    .content {
        background-color: rgba(color($color-background, $variant-light), 0.8);
        /*blur: 5px;*/
        //margin-top: spacing($xl);
        position: relative;
        top: -1 * spacing($xl);
        display: flex;
        flex-direction: column;
        @include container($lg);
        @include rounded($cornerRadiusXl);

        h1 {
            font-family: $font-stack-logo;
            font-size: 10rem;
            font-weight: normal;
            color: color($color-primary);
            display: inline-block;
        }
        .mask {
            filter: blur(5px);
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: url("/images/fishbowl_final.png") no-repeat center
                center;
        }
        .actions {
            position: relative;
            display: inline-block;
        }
    }
}

.about {
    margin-top: spacing($xxl);
    @include container($lg);
}
</style>
