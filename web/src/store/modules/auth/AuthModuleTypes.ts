import { User } from "firebase";
import Player from "@shared/models/Player";

export interface AuthState {
    hasLoaded: boolean;
    user?: User;
    displayName: string | null;
    player: Player | null;
}

export interface AuthChangedPayload {
    user: User | null | undefined;
}

export interface SetDisplayNamePayload {
    displayName: string;
}
