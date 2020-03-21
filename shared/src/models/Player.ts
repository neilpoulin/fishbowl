export class Player {
    userId!: string;
    displayName?: string;

    constructor(userId: string) {
        this.userId = userId;
    }
}
