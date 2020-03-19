import Vue from "vue";
import App from "@web/App.vue";
import router from "@web/router";
import store, {Namespace} from "@web/store";
import {createNamespacedHelpers} from "vuex";

const {mapActions} = createNamespacedHelpers(Namespace.auth);


Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount("#app");
