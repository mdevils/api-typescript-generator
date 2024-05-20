import * as commonHttpClient from './common-http-client';

export class CommonHttpService {
    protected getClientInstance: () => commonHttpClient.CommonHttpClient;
    constructor(getClientInstance: () => commonHttpClient.CommonHttpClient) {
        this.getClientInstance = () => {
            const classInstance = this.constructor as typeof CommonHttpService;
            if (!classInstance.initialized) {
                classInstance.initialized = true;
                if (classInstance.initialize) {
                    classInstance.initialize();
                }
            }
            this.getClientInstance = getClientInstance;
            return getClientInstance();
        };
    }
    protected static initialized: boolean | undefined;
    protected static initialize: () => void | undefined;
}
