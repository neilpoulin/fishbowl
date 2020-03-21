import { GetterTree } from "vuex";
import { GlobalState } from "@web/store/StoreTypes";

export enum Getters {
    appVersion = "appVersion"
}

export const getters: GetterTree<GlobalState, GlobalState> = {
    [Getters.appVersion](state): string {
        return state.version + "_custom shit";
    }
};
