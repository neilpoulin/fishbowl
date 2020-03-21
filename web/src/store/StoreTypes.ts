import { AuthState } from "@web/store/modules/auth/AuthModuleTypes";
import { GamesState } from "@web/store/modules/games/GamesModule";

export enum Namespace {
    auth = "auth",
    games = "games"
}

export interface RootState {
    version: string;
}

export interface GlobalState extends RootState {
    [Namespace.auth]: AuthState;
    [Namespace.games]: GamesState;
}
