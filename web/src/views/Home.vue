<template>
    <div class="home">
        <section class="header-section">
            <div class="header content">
                <h1>Fish Bowl</h1>
                <p class="subtitle">
                    Play your favorite party game &mdash; now with less COVID-19!
                </p>
                <div class="actions">
                    <router-link tag="button" class="btn primary" :to="playRoute">
                        Play Now
                    </router-link>
                </div>
            </div>
        </section>
        <section class="artwork">
            <div class="">
                <figure class="drawing">
                    <div class="frame">
                        <img alt="Afflatus fo the Fishbowl" src="/images/fishbowl_final.png" />
                    </div>
                    <figcaption class="caption">
                        <h3 class="title">Afflatus of the Fishbowl</h3>
                        <span class="artist">Brooke Berry (2018&mdash;present)</span>
                        <span class="medium">Crayon on Parchment</span>
                        <p class="description">
                            This piece speaks to the innate human desire that inspiration be unfettered by the burden of definition. The
                            artist hints at the connection of inspiration to the tangible with a stock representation of a basal “fishbowl”
                            as the base of the piece. A trio of Disney-esque fish glide within the bowl, not drawn by the artist, rather an
                            assistant; a subtle allusion to the dogma that true inspiration can be fathomed. These callow understandings of
                            inspiration are undercut with harsh and jagged strikes of orange and violet leading, even forcing, the eye
                            downward to the right. They seem to scream, “No! Not here! Elsewhere!”. Here, out of the confines of the bowl,
                            the uplifting red strokes buoy the eye to the true nature of inspiration. But the artist leaves the sense of
                            having lacked examination of the entire piece. The crimson spirals above, the enigmatic maroon to the bottom
                            left: conveying that inspiration has no one path, just as “Fishbowl” has no one game.
                        </p>
                    </figcaption>
                </figure>
            </div>
        </section>
        <section class="about-section">
            <about :inline="true" class="content" />
        </section>
    </div>
</template>

<script lang="ts">
import About from "@web/views/About.vue";
import { RoutePath } from "@web/router/router";

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

    section {
        margin-bottom: 0;
        padding: spacing($xxl);
        @include maxW($br-tablet-min) {
            padding: spacing($xxl) 0;
        }
    }
}
.header-section {
    //background: url("/images/goldfish.jpg") center center, color($color-primary, $variant-light);
    background-size: 100%;
}

.header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    //text-shadow: 1px rgba(color($color-text), 0.8);
    h1 {
        font-family: $font-stack-logo;
        font-size: 10rem;
        font-weight: normal;
        color: color($color-primary);
        display: inline-block;
        margin: 0;
        line-height: 9rem;
        @include maxW($br-tablet-min) {
            font-size: 7rem;
            line-height: 7rem;
        }
        //text-shadow: 4px 4px rgba(color($color-text, $variant-light), 0.8);
    }

    .actions {
        position: relative;
        display: inline-block;
    }

    .subtitle {
        @include font($lg);
        //color: color($color-text, $variant-light);
        //text-shadow: 1px 0 rgba(color($color-text, $variant-dark), 0.8);
    }
}

.content {
    margin: 0 auto 0;
    max-width: $pageMaxWidth;
}

.about {
    //margin-top: spacing($xxl);
    @include container($lg);
}

.artwork {
    background: url("/images/45-degree-fabric-light.png"), lighten(color($color-accent, $variant-dark), 15%);
    padding: spacing($xxl);
}

.drawing {
    margin: 0;
    @include container($xl);
    @include rounded;
    display: flex;
    flex-direction: row;

    align-items: center;
    .frame {
        flex-basis: 50%;
        margin-right: spacing($lg);
        background-color: white;
        border: 25px solid color($color-foreground);
        border-radius: 12px;
        margin-bottom: spacing($lg);
        box-shadow: inset 1px 1px 10px 0px color($color-shadow);
        img {
            max-width: 100%;
        }
    }

    @include maxW($br-tablet-min) {
        flex-direction: column;
        .frame {
            margin-right: 0;
        }
    }

    .caption {
        @include container($lg);
        @include rounded;
        flex-basis: 50%;
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

.about-section {
    background-color: color($color-primary);
    color: color($color-text, $variant-light);
    padding: spacing($xxl);
}
</style>
