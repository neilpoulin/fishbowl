import { Phase } from "@shared/models/Game";

export default class Player {
    userId!: string;
    displayName?: string;
    phase: Phase = Phase.SETUP;
    team?: number;

    constructor(userId: string) {
        this.userId = userId;
        this.phase = Phase.SETUP;
    }
}
