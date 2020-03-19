<template>
  <div class="start">
    <h1>Start</h1>
    <h1>Loading {{ !authLoading }}</h1>
    <h3>AuthName {{ authName }}</h3>
    <h3>UserID {{ userId }}</h3>
    <p>Version: {{ this.$store.state.version }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import { Namespace } from "@web/store";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";

const { mapState: mapAuthState } = createNamespacedHelpers(Namespace.auth);

export default Vue.extend({
  name: "Start",
  computed: {
    ...mapAuthState<AuthState>({
      authLoading: (state: AuthState) => state.hasLoaded,
      userId: (state: AuthState) => state.user?.uid
    }),
    authName(): string | undefined {
      return this.$store.state.auth.user?.uid;
    }
  }
});
</script>

<style scoped lang="scss"></style>
