export enum Level {
    info = "info",
    warn = "warn",
    error = "error",
    success = "success"
}

export class AlertMessage {
    level: Level = Level.info;
    message?: string | undefined;

    constructor(level: Level, message?: string) {
        this.level = level;
        this.message = message;
    }

    static error(message: string): AlertMessage {
        return new AlertMessage(Level.error, message);
    }

    static info(message: string): AlertMessage {
        return new AlertMessage(Level.info, message);
    }

    static warn(message: string): AlertMessage {
        return new AlertMessage(Level.warn, message);
    }

    static success(message: string): AlertMessage {
        return new AlertMessage(Level.success, message);
    }
}
