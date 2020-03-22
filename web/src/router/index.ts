import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@web/views/Home.vue";

Vue.use(VueRouter);

export enum RoutePath {
    HOME = "/",
    ABOUT = "/about",
    GAMES = "/games",
    GAME = "/games/:gameId"
}

export enum RouteName {
    HOME = "Home",
    ABOUT = "About",
    GAMES = "Games",
    GAME = "Game"
}

export const routes = [
    {
        showInNav: true,
        path: RoutePath.HOME,
        name: RouteName.HOME,
        component: Home
    },
    {
        showInNav: true,
        path: RoutePath.ABOUT,
        name: RouteName.ABOUT,
        component: () => import("@web/views/About.vue")
    },
    {
        path: RoutePath.GAMES,
        name: RouteName.GAMES,
        component: () => import("@web/views/Start.vue"),
        showInNav: true
    },
    {
        path: RoutePath.GAME,
        name: RouteName.GAME,
        component: () => import("@web/views/GameView.vue"),
        showInNav: false
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
        return RoutePath.GAMES;
    },
    game(gameId: string) {
        return { name: RouteName.GAME, params: { gameId } };
    }
};
