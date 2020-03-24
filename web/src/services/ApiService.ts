import { Config } from "@web/config/AppConfig";
import axios, { AxiosInstance } from "axios";
import { deserializeJson, isAxiosError } from "@web/util/ApiUtil";
import Logger from "@shared/Logger";
import { auth } from "@web/config/FirebaseConfig";

type EndpointGetter = () => string;

export const Endpoint = {
    gameNextTurn: (gameId: string): EndpointGetter => () => `/games/${ gameId }/next-turn`,
};

export default class ApiService {
    config = Config;
    request: AxiosInstance;
    logger = new Logger("ApiService");
    static shared = new ApiService();

    constructor() {
        this.logger.info("AppConfig = ", JSON.stringify(Config));
        const domain = Config.apiDomain;
        axios.defaults.baseURL = `${ domain }`;
        axios.defaults.timeout = 30000; //30 second timeout
        this.request = axios.create({
            baseURL: Config.apiDomain,
            transformResponse: [(data: string) => {
                return deserializeJson(data)
            }]
        });
    }

    async getAuthHeaders(): Promise<{ [key: string]: string }> {
        const user = auth().currentUser;
        if (!user) {
            return {};
        }
        const token = await user.getIdToken();
        return { Authorization: `Bearer ${ token }` };
    }

    async post<Req, Resp>(endpoint: EndpointGetter, payload: Req): Promise<Resp | undefined> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await axios.post<Resp>(endpoint(), payload, { headers: { ...authHeaders } });
            return response.data;
        } catch (error) {
            if (isAxiosError<Resp>(error)) {
                const data = error.response?.data;
                this.logger.error(`Request to ${ endpoint() } returned status ${ error.response?.status }. ${ JSON.stringify(data) }`)
            } else {
                this.logger.error(`Failed to process request to "${ endpoint() }"`, error);
                return;
            }

        }
    }

    async get<Resp>(endpoint: EndpointGetter): Promise<Resp | undefined> {
        try {
            const authHeaders = await this.getAuthHeaders();
            const response = await axios.get<Resp>(endpoint(), { headers: { ...authHeaders } });
            return response.data;
        } catch (error) {
            if (isAxiosError<Resp>(error)) {
                const data = error.response?.data;
                this.logger.error(`Request to ${ endpoint() } returned status ${ error.response?.status }. ${ JSON.stringify(data) }`)
            } else {
                this.logger.error(`Failed to process request to "${ endpoint() }"`, error);
                return;
            }

        }
    }

}
