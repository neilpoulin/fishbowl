declare global {
    interface AppConfig {
        apiDomain: string,
    }
}

export const Config:AppConfig = {
    apiDomain: process.env.VUE_APP_API_DOMAIN
};