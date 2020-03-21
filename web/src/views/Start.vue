<template>
  <div class="start">
    <h1>Start</h1>
    <h1>Has Loaded {{ authLoaded }}</h1>
    <h3>Current UserID {{ currentUserId }}</h3>
    <p>Version: {{ this.$store.state.version }}</p>
    <p>Version with getter: {{ version }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Getters } from "@web/store/Getters";
import Component from "vue-class-component";
import { Getter, State } from "vuex-class";
import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { AuthGetters } from "@web/store/modules/auth/AuthGetters";

@Component
export default class Start extends Vue {
  @State auth!: AuthState;
  @Getter(AuthGetters.currentUserId) currentUserId: number | undefined;
  @Getter(AuthGetters.authLoaded) authLoaded!: boolean;
  @Getter(Getters.appVersion) version!: number;

  beforeMount() {
    // this.authState.userId
  }
}
</script>

<style scoped lang="scss"></style>
