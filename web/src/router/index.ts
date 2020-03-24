import Vue from "vue";
import VueRouter, { RouteConfig, RouteRecord } from "vue-router";
import Home from "@web/views/Home.vue";
import { auth } from "@web/config/FirebaseConfig";
import { store } from "@web/store/GlobalStore";
import { AuthGetters } from "@web/store/modules/auth/AuthGetters";

Vue.use(VueRouter);

export enum RoutePath {
    HOME = "/",
    SIGNUP = "/signup",
    ABOUT = "/about",
    GAMES = "/games",
    GAME = "/games/:gameId"
}

export enum RouteName {
    HOME = "Home",
    SIGNUP = "Sign Up",
    ABOUT = "About",
    GAMES = "Games",
    GAME = "Game"
}

interface RouteMeta {
    requiresAuth?: boolean;
}

interface MetaRoute extends RouteConfig {
    showInNav: boolean;
    meta?: {
        requiresAuth?: boolean;
    };
}

export const routes: MetaRoute[] = [
    {
        showInNav: true,
        path: RoutePath.HOME,
        name: RouteName.HOME,
        component: Home
    },
    {
        showInNav: true,
        path: RoutePath.SIGNUP,
        name: RouteName.SIGNUP,
        component: () => import("@web/views/Signup.vue")
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
        showInNav: true,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: RoutePath.GAME,
        name: RouteName.GAME,
        component: () => import("@web/views/GameView.vue"),
        showInNav: false,
        meta: {
            requiresAuth: true
        }
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

interface MetaRouteRecord extends RouteRecord {
    meta: RouteMeta | undefined;
}

router.beforeEach((to, from, next) => {
    if (to.matched.some((record: RouteRecord) => record.meta?.requiresAuth)) {
        const authLoaded = store.getters[AuthGetters.authLoaded];
        const user = auth().currentUser;
        const displayName = store.getters[AuthGetters.displayName];
        if (!authLoaded) {
            next();
            return;
        }
        if (!user || !displayName) {
            next({
                path: RoutePath.SIGNUP,
                params: { nextUrl: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
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
