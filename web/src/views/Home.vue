<template>
    <div class="home">
        <div class="header">
            <h1>Fish Bowl</h1>
            <p>
                Play your favorite party game &mdash; now with less CVOD-19!
            </p>
            <div class="actions">
                <router-link tag="button" class="btn secondary" :to="playRoute">
                    Play Now
                </router-link>
            </div>
        </div>

        <figure class="drawing">
            <div class="frame">
                <img
                    alt="Afflatus fo the Fishbowl"
                    src="/images/fishbowl_final.png"
                />
            </div>
            <figcaption class="caption">
                <h3 class="title">Afflatus of the Fishbowl</h3>
                <span class="artist">Brooke Berry</span>
                <span class="medium">Crayon on Parchment</span>
                <p class="description">
                    This piece speaks to the innate human desire that
                    inspiration be unfettered by the burden of definition. The
                    artist hints at the connection of inspiration to the
                    tangible with a stock representation of a basal “fishbowl”
                    as the base of the piece. A trio of Disney-esque fish glide
                    within the bowl, not drawn by the artist, rather an
                    assistant; a subtle allusion to the dogma that true
                    inspiration can be fathomed. These callow understandings of
                    inspiration are undercut with harsh and jagged strikes of
                    orange and violet leading, even forcing, the eye downward to
                    the right. They seem to scream, “No! Not here! Elsewhere!”.
                    Here, out of the confines of the bowl, the uplifting red
                    strokes buoy the eye to the true nature of inspiration. But
                    the artist leaves the sense of having lacked examination of
                    the entire piece. The crimson spirals above, the enigmatic
                    maroon to the bottom left: conveying that inspiration has no
                    one path, just as “Fishbowl” has no one game.
                </p>
            </figcaption>
        </figure>

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
    margin: spacing($xl) auto 0;
    padding-bottom: 30rem;
}

.header {
    @include container($lg);
    @include rounded($cornerRadiusXl);
    @include shadowbox;
    display: flex;
    flex-direction: column;
    justify-content: center;
    $padding: spacing($xl);
    padding: $padding;
    background-color: rgba(color($color-background, $variant-light), 0.8);
    margin-bottom: spacing($xxl);
    h1 {
        font-family: $font-stack-logo;
        font-size: 10rem;
        font-weight: normal;
        color: color($color-primary);
        display: inline-block;
    }

    .actions {
        position: relative;
        display: inline-block;
    }
}

.about {
    margin-top: spacing($xxl);
    @include container($lg);
}

.drawing {
    background-color: color($color-background, $variant-dark);
    margin: 0;
    @include container($xl);
    @include rounded;
    .frame {
        background-color: white;
        border: 15px solid color($color-foreground);
        margin-bottom: spacing($lg);
        img {
            max-width: 100%;
        }
    }

    .caption {
        @include container($lg);
        @include rounded;
        background-color: color($color-primary, $variant-light);
        text-align: left;
        .description {
            text-align: justify;
        }
        span {
            display: block;
        }

        .artist {
            font-weight: bold;
        }
    }
}
</style>
