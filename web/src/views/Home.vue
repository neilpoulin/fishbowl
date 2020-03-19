<template>
  <div class="home">
    <img alt="Vue logo" src="/images/fishbowl.png" />
    <ComingSoon msg="Welcome to Fishbowl" />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import HelloWorld from "@web/components/HelloWorld.vue";
import ComingSoon from "@web/components/ComingSoon.vue";

export default {
  name: "Home",
  components: {
    ComingSoon
  }
};
</script>

<style lang="scss" scoped>
.home {
  img {
    max-width: 100%;
  }
}
</style>
