
export interface Config {
    allowedOrigins: (string|RegExp)[],
}


export const getConfig = () => {
    return {
        allowedOrigins: [/localhost:*/, "fishbowl.fun", "forrestofdicks.com", "fishbowl-online.firebaseapp.com", "fishbowl-online.web.app"]
    }
};