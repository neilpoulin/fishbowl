import Vue from "vue";
import VueRouter, { RouteConfig, RouteRecord } from "vue-router";
import Home from "@web/views/Home.vue";
import { auth } from "@web/config/FirebaseConfig";
import { store } from "@web/store/GlobalStore";
import { AuthGetters } from "@web/store/modules/auth/AuthGetters";
import Logger from "@shared/Logger";
import { AuthMutations } from "@web/store/modules/auth/AuthMutations";
import AnalyticsService from "@web/services/AnalyticsService";

Vue.use(VueRouter);

const logger = new Logger("Router.index");

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
        hideNav?: boolean;
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
        showInNav: false,
        path: RoutePath.SIGNUP,
        name: RouteName.SIGNUP,
        component: () => import("@web/views/Signup.vue")
    },
    {
        showInNav: false,
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
            requiresAuth: true,
            hideNav: false
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

router.afterEach((to, from) => {
    logger.info(`to: ${to.path} | from: ${from.path}`);
    AnalyticsService.shared.routeChanged(to);
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record: RouteRecord) => record.meta?.requiresAuth)) {
        const authLoaded = store.getters[AuthGetters.authLoaded];

        const user = auth().currentUser;
        const displayName = store.getters[AuthGetters.displayName];
        if (!authLoaded || !user || !displayName) {
            logger.info("Before route - auth loaded = ", authLoaded);
            logger.info("Setting continue url to ", to.fullPath);
            store.commit(AuthMutations.continueUrl, { continueUrl: to.fullPath });
            next({
                path: RoutePath.SIGNUP
            });
            return;
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
