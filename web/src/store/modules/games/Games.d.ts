import { Phase } from "@shared/models/Game";

declare interface JoinGameParams {
    gameId: string;
}

declare interface LoadGameParams {
    gameId: string;
}

declare interface CreateGameParams {
    name?: string;
}

declare interface AddWordParams {
    word: string,
}

declare interface SetPhaseParams {
    phase: Phase
}