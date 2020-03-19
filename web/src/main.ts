import Vue from "vue";
import App from "@web/App.vue";
import router from "@web/router";
import store from "@web/store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
