import Vue from "vue";
import App from "@web/App.vue";
import router from "@web/router/router";
import { store } from "@web/store/GlobalStore";
import { auth } from "@web/config/FirebaseConfig";
import firebase from "firebase";
import Logger from "@shared/Logger";

Vue.config.productionTip = false;
let authLoaded = false;
const logger = new Logger("main");
let unsubscriber: firebase.Unsubscribe | null = null;
(async () => {
    unsubscriber = auth().onAuthStateChanged(user => {
        logger.info(`auth changed with user: ${user?.uid ?? "null"}`);
        unsubscriber?.();
        if (!authLoaded) {
            new Vue({
                router,
                store,
                render: h => h(App)
            }).$mount("#app");
        }

        authLoaded = true;
    });
})();
