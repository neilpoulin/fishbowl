<template>
    <div class="home">
        <img alt="Vue logo" src="/images/fishbowl.png" />
        <ComingSoon msg="Welcome to Fishbowl" />

        <about :inline="true" class="about-section" />
    </div>
</template>

<script lang="ts">
import ComingSoon from "@web/components/ComingSoon.vue";
import About from "@web/views/About.vue";

export default {
    name: "Home",
    components: {
        About,
        ComingSoon
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

.about {
    margin-top: spacing($xxl);
}
</style>
