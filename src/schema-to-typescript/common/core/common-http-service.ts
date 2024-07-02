import * as commonHttpClient from './common-http-client';

/**
 * Base class for all services that need to make HTTP requests.
 */
export class CommonHttpService {
    /**
     * Map of child service instances to avoid creating multiple instances of the same service.
     */
    protected serviceInstancesMap: Map<
        new (getClientInstance: () => commonHttpClient.CommonHttpClient) => CommonHttpService,
        CommonHttpService
    > = new Map();

    /**
     * Get an instance of the specified service class.
     */
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

    /**
     * Get an instance of the HTTP client.
     */
    protected getClientInstance: () => commonHttpClient.CommonHttpClient;

    /**
     * Create a new instance of the service.
     */
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

    /**
     * Flag to indicate if the class has been initialized to avoid multiple initializations.
     */
    protected static initialized: boolean | undefined;

    /**
     * Method to initialize the class. Normally used to set up validation rules.
     */
    protected static initialize: (() => void) | undefined;
}
