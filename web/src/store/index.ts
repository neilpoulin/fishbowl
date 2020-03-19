import Vue from "vue";
import Vuex from "vuex";
import {initFirestore} from "@web/config/FirestoreConfig";

initFirestore();

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {}
});
