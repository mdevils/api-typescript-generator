import * as commonHttpClient from './common-http-client';

export class CommonHttpService {
    protected serviceInstancesMap: Map<
        new (getClientInstance: () => commonHttpClient.CommonHttpClient) => CommonHttpService,
        CommonHttpService
    > = new Map();

    protected getServiceInstance<T extends CommonHttpService>(
        serviceClass: new (getClientInstance: () => commonHttpClient.CommonHttpClient) => T
    ): T {
        let serviceInstance = this.serviceInstancesMap.get(serviceClass);
        if (!serviceInstance) {
            serviceInstance = new serviceClass(this.getClientInstance);
            this.serviceInstancesMap.set(serviceClass, serviceInstance);
        }
        return serviceInstance as T;
    }

    protected getClientInstance: () => commonHttpClient.CommonHttpClient;
    constructor(getClientInstance: () => commonHttpClient.CommonHttpClient) {
        this.getClientInstance = () => {
            const classInstance = this.constructor as typeof CommonHttpService;
            if (classInstance.initialized !== true) {
                classInstance.initialized = true;
                if (classInstance.initialize !== undefined) {
                    classInstance.initialize();
                }
            }
            this.getClientInstance = getClientInstance;
            return getClientInstance();
        };
    }
    protected static initialized: boolean | undefined;
    protected static initialize: (() => void) | undefined;
}
