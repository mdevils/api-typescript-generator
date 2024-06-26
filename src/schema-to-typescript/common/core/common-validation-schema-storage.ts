import {
    CommonHttpClientOptions,
    isJsonMediaType,
    CommonHttpClientError,
    CommonHttpClientFetchResponse
} from './common-http-client';

type CommonValidationSchemaStorageAssertDataShape<T> = <D>(schema: T, data: D) => void;

type RegisterOnceCallback<T> = (validationSchemaStorage: CommonValidationSchemaStorage<T>) => void;

type CommonValidationSchemaStorageMakeExtensible<T> = (schema: T) => T;

type CommonValidationSchemaStorageFormatErrorMessage<T> = (error: Error, schema: T) => string;

type CommonValidationSchemaStorageLazyGetter<T> = (callback: () => T) => T;

export class CommonValidationSchemaStorage<T> {
    protected assertDataShape: CommonValidationSchemaStorageAssertDataShape<T>;
    protected makeExtensible: CommonValidationSchemaStorageMakeExtensible<T>;
    protected schemas: Record<string, T> = {};
    protected registeredCallbacks = new Set<RegisterOnceCallback<T>>();
    protected errorClass: CommonHttpClientOptions['errorClass'] = CommonHttpClientError;
    protected formatErrorMessage: CommonValidationSchemaStorageFormatErrorMessage<T>;
    protected lazyGetter: CommonValidationSchemaStorageLazyGetter<T>;

    constructor({
        assertDataShape,
        makeExtensible,
        formatErrorMessage,
        lazyGetter
    }: {
        assertDataShape: CommonValidationSchemaStorageAssertDataShape<T>;
        makeExtensible: CommonValidationSchemaStorageMakeExtensible<T>;
        formatErrorMessage: CommonValidationSchemaStorageFormatErrorMessage<T>;
        lazyGetter: CommonValidationSchemaStorageLazyGetter<T>;
    }) {
        this.assertDataShape = assertDataShape;
        this.makeExtensible = makeExtensible;
        this.formatErrorMessage = formatErrorMessage;
        this.lazyGetter = lazyGetter;
    }

    register(key: string, schema: T) {
        this.schemas[key] = schema;
    }

    registerExtensible(key: string, schema: T) {
        this.schemas[key] = this.makeExtensible(schema);
    }

    registerOnce(callbacks: RegisterOnceCallback<T>[]) {
        for (const callback of callbacks) {
            if (!this.registeredCallbacks.has(callback)) {
                this.registeredCallbacks.add(callback);
                callback(this);
            }
        }
    }

    get(key: string): T {
        return this.schemas[key];
    }

    lazy(key: string): T {
        return this.lazyGetter(() => this.schemas[key]);
    }

    validator<D extends {mediaType: string; status: number; body: unknown; response: CommonHttpClientFetchResponse}>(
        key: string
    ): (data: D) => D {
        return (data: D) => {
            const schema = this.schemas[key];
            if (schema === undefined) {
                throw new Error(`Schema with key "${key}" not found`);
            }
            if (data.mediaType !== undefined && isJsonMediaType(data.mediaType)) {
                try {
                    this.assertDataShape(schema, data);
                } catch (error) {
                    throw new this.errorClass(
                        new URL(data.response.url),
                        undefined,
                        data.response,
                        undefined,
                        error instanceof Error ? this.formatErrorMessage(error, schema) : String(error)
                    );
                }
            }
            return data;
        };
    }

    getErrorClass() {
        return this.errorClass;
    }

    setErrorClass(errorClass: CommonHttpClientOptions['errorClass']) {
        this.errorClass = errorClass;
    }
}
