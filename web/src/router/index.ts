import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@web/views/Home.vue";

Vue.use(VueRouter);

export enum RoutePath {
    HOME = "/",
    ABOUT = "/about",
    START = "/start",
    GAME = "/game/:gameId"
}

export enum RouteName {
    HOME = "Home",
    ABOUT = "About",
    START = "Start",
    GAME = "Game"
}

const routes = [
    {
        path: RoutePath.HOME,
        name: RouteName.HOME,
        component: Home
    },
    {
        path: RoutePath.ABOUT,
        name: RouteName.ABOUT,
        component: () => import("@web/views/About.vue")
    },
    {
        path: RoutePath.START,
        name: RouteName.START,
        component: () => import("@web/views/Start.vue")
    },
    {
        path: RoutePath.GAME,
        name: RouteName.GAME,
        component: () => import("@web/views/GameView.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;

export const RouteBuilder = {
    home() {
        return RoutePath.HOME;
    },
    about() {
        return RoutePath.ABOUT;
    },
    start() {
        return RoutePath.START;
    },
    game(gameId: string) {
        return { name: RouteName.GAME, params: { gameId } };
    }
};
