/**
 * Options for the common HTTP client.
 */
export interface CommonHttpClientOptions {
    /**
     * Base URL for the API. Endpoints are relative to this URL.
     */
    baseUrl: string;
    /**
     * Error class to be thrown when an error occurs.
     */
    errorClass: {
        new (
            url: URL,
            request: CommonHttpClientFetchRequest | undefined,
            response: CommonHttpClientFetchResponse | undefined,
            options: CommonHttpClientOptions | undefined,
            message: string
        ): Error;
    };
    /**
     * Class name of the API client.
     */
    apiClientClassName: string;
    /**
     * Default headers to be sent with each request.
     */
    headers?: CommonHttpClientRequestHeaders;
    /**
     * Preprocess the request before sending it.
     */
    preprocessRequest?: (request: CommonHttpClientRequest) => Promise<CommonHttpClientRequest>;
    /**
     * Preprocess the response before returning it.
     */
    preprocessFetchResponse?: (
        response: CommonHttpClientFetchResponse,
        request: CommonHttpClientFetchRequest
    ) => Promise<CommonHttpClientFetchResponse>;
    /**
     * Fetch function. Default is window.fetch-based implementation.
     */
    fetch?: (url: URL, request: CommonHttpClientFetchRequest) => Promise<CommonHttpClientFetchResponse>;
    /**
     * Type of the response body for binary responses.
     */
    binaryResponseType: 'blob' | 'readableStream';
    /**
     * Format the HTTP error message.
     */
    formatHttpErrorMessage?: (response: CommonHttpClientFetchResponse, request: CommonHttpClientFetchRequest) => string;
    /**
     * Custom validation error handling. Can be used to log errors.
     */
    handleValidationError?: (error: Error) => void;
    /**
     * Deprecated operations. Used to warn about deprecated operations.
     */
    deprecatedOperations?: {[methodAndPath: string]: string /* Operation name */};
    /**
     * Log a deprecation warning.
     */
    logDeprecationWarning?(params: {
        /**
         * Either operation method name in case if it's not part of the service, or service name and operation method
         * name separated by a dot.
         *
         * Examples: `users.getUserById`, `getSystemConfig`
         */
        operationName: string;
        path: string;
        method: CommonHttpClientFetchRequest['method'];
    }): void;
    /**
     * Determine whether to retry on error.
     */
    shouldRetryOnError?: (error: Error, attemptNumber: number) => boolean | Promise<boolean>;
    /**
     * Process the error before throwing it. Can be used to add additional information to the error.
     */
    processError?: (error: Error) => Error;
    /**
     * External fetch method. Will be used for external redirects.
     */
    externalFetch?: (url: URL, request: CommonHttpClientFetchRequest) => Promise<CommonHttpClientFetchResponse>;
    /**
     * Whether to follow redirects. Default is true. Can also be a function that decides what to do on a redirect.
     */
    followRedirects?:
        | boolean
        | ((params: {
              url: URL;
              request: CommonHttpClientFetchRequest;
              response: CommonHttpClientFetchResponse;
          }) => Promise<
              | {
                    type: 'error';
                    error?: Error;
                }
              | {
                    type: 'response';
                    response: CommonHttpClientFetchResponse;
                }
              | {
                    type: 'redirect';
                    request?: CommonHttpClientFetchRequest;
                }
              | {
                    type: 'externalRedirect';
                    request?: CommonHttpClientFetchRequest;
                }
          >);
}

/**
 * Request headers as used by the fetch function.
 */
export interface CommonHttpClientFetchRequestHeaders {
    [headerName: string]: string;
}

/**
 * A forgiving version of the request headers. Undefined and null values are allowed.
 */
export interface CommonHttpClientRequestHeaders {
    [headerName: string]: string | undefined | null;
}

/**
 * Request prepared for the fetch function.
 */
export interface CommonHttpClientFetchRequest {
    /**
     * HTTP Method.
     */
    method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'PATCH';
    /**
     * Request headers.
     */
    headers: CommonHttpClientFetchRequestHeaders;
    /**
     * Request body.
     */
    body?: BodyInit;
    /**
     * Cache mode.
     */
    cache: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
    /**
     * Credentials mode.
     */
    credentials: 'include' | 'omit' | 'same-origin';
    /**
     * Custom request properties. Can be used to pass metadata to the fetch function.
     */
    customRequestProps?: Record<string, unknown>;
    /**
     * Redirect mode.
     */
    redirect: 'error' | 'follow' | 'manual';
}

/**
 * Parameter serialization style.
 */
export type CommonHttpClientRequestParameterSerializeStyle =
    | 'simple'
    | 'label'
    | 'matrix'
    | 'form'
    | 'spaceDelimited'
    | 'pipeDelimited'
    | 'deepObject';

/**
 * Information about how to serialize a request parameter.
 */
export interface CommonHttpClientRequestParameterSerializeInfo {
    /**
     * Serialization style.
     */
    style?: CommonHttpClientRequestParameterSerializeStyle;
    /**
     * Serialization explode.
     */
    explode?: boolean;
}

/**
 * Request parameter location.
 */
export type CommonHttpClientRequestParameterLocation = 'path' | 'query' | 'header' | 'cookie';

/**
 * Request parameters.
 */
export type CommonHttpClientRequestParameters = {
    [K in CommonHttpClientRequestParameterLocation]?: Record<string, CommonHttpClientRequestParameterSerializeInfo>;
};

/**
 * Request in terms of OpenAPI.
 */
export type CommonHttpClientRequest = Omit<
    CommonHttpClientFetchRequest,
    'body' | 'headers' | 'cache' | 'credentials' | 'redirect'
> & {
    /**
     * Path to the resource.
     */
    path: string;
    /**
     * Path parameters, i.e. {id}.
     */
    pathParams?: Record<string, unknown>;
    /**
     * Query parameters.
     */
    query?: Record<string, unknown>;
    /**
     * Request body.
     */
    body?: unknown;
    /**
     * Request headers.
     */
    headers?: CommonHttpClientRequestHeaders;
    /**
     * Request parameters serialization information.
     */
    parameters?: CommonHttpClientRequestParameters;
} & Partial<Pick<CommonHttpClientFetchRequest, 'cache' | 'credentials'>>;

/**
 * Response of the fetch function.
 */
export interface CommonHttpClientFetchResponse {
    /**
     * HTTP status code.
     */
    status: number;
    /**
     * HTTP status code explanation.
     */
    statusText: string;
    /**
     * Response body.
     */
    body: CommonHttpClientFetchResponseBody;
    /**
     * Whether the request was successful. True for 2xx status codes.
     */
    ok: boolean;
    /**
     * The final URL of the request (after redirects).
     */
    url: string;
    /**
     * Response headers.
     */
    headers: CommonHttpClientResponseHeaders;
    /**
     * Custom request properties. Can be used to pass metadata outside the fetch function.
     */
    customRequestProps?: Record<string, unknown>;
}

export type CommonHttpClientResponseHeaders = Record<string, string> & {
    'set-cookie'?: string[];
};

export type CommonHttpClientFetchResponseBody =
    | {type: 'json'; data: unknown}
    | {type: 'blob'; data: Blob}
    | {type: 'readableStream'; data: ReadableStream<Uint8Array>};

export interface CommonHttpClientResponse<T> {
    status: number;
    mediaType?: string;
    body: T;
    response: CommonHttpClientFetchResponse;
}

/**
 * Error thrown by the common HTTP client.
 */
export class CommonHttpClientError extends Error {
    /**
     * URL of the request.
     */
    public readonly url: URL;
    /**
     * Request that caused the error. Can be undefined in case of failure during request building phase.
     */
    public readonly request: CommonHttpClientFetchRequest | undefined;
    /**
     * Response that caused the error. Can be undefined in case of network failure.
     */
    public readonly response: CommonHttpClientFetchResponse | undefined;
    /**
     * Options of the common HTTP client.
     */
    public readonly options: CommonHttpClientOptions | undefined;
    constructor(
        url: URL,
        request: CommonHttpClientFetchRequest | undefined,
        response: CommonHttpClientFetchResponse | undefined,
        options: CommonHttpClientOptions | undefined,
        message: string
    ) {
        super(message);
        this.name = 'OpenApiClientError';
        this.url = url;
        this.request = request;
        this.response = response;
        this.options = options;
    }
}

const jsonContentTypeRegExp = /^application\/(\w+\+)?json/;

function readableStreamToBlob(stream: ReadableStream<Uint8Array>): Promise<Blob> {
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();
    return new Promise((resolve, reject) => {
        reader.read().then(function process({done, value}) {
            if (value) {
                chunks.push(value);
            }
            if (done) {
                resolve(new Blob(chunks));
                return;
            }
            reader.read().then(process, reject);
        }, reject);
    });
}

/**
 * Convert the response body to the desired type.
 */
async function convertResponseBody(
    body: CommonHttpClientFetchResponseBody,
    destType: CommonHttpClientFetchResponseBody['type']
): Promise<CommonHttpClientFetchResponseBody> {
    if (body.type === destType) {
        return body;
    }
    if (body.type === 'json') {
        const blob = new Blob([JSON.stringify(body.data)]);
        if (destType === 'blob') {
            return {type: 'blob', data: blob};
        } else if (destType === 'readableStream') {
            return {type: 'readableStream', data: blob.stream()};
        } else {
            throw new Error('Invalid destination type.');
        }
    }
    if (body.type === 'blob') {
        if (destType === 'json') {
            return {type: 'json', data: JSON.parse(await body.data.text())};
        } else if (destType === 'readableStream') {
            return {type: 'readableStream', data: body.data.stream()};
        } else {
            throw new Error('Invalid destination type.');
        }
    }
    if (body.type === 'readableStream') {
        if (destType === 'json') {
            return {type: 'json', data: JSON.parse(await (await readableStreamToBlob(body.data)).text())};
        } else if (destType === 'blob') {
            return {type: 'blob', data: await readableStreamToBlob(body.data)};
        } else {
            throw new Error('Invalid destination type.');
        }
    }
    throw new Error('Invalid response body type.');
}

/**
 * `extends unknown` is a trick to split the union into individual types.
 */
type ResponseByMediaType<T extends CommonHttpClientResponse<unknown>, K extends string> = T extends unknown
    ? ((a: T) => void) extends (a: {
          mediaType: K;
          status: infer _Status;
          body: infer _Body;
          response: CommonHttpClientFetchResponse;
      }) => void
        ? T
        : never
    : never;

export function checkReponseMediaType<T extends CommonHttpClientResponse<unknown>, K extends string>(
    response: T,
    mediaType: K
): response is ResponseByMediaType<T, K> extends never ? ResponseByMediaType<T, '*/*'> : ResponseByMediaType<T, K> {
    return response.mediaType === mediaType;
}

export function isJsonMediaType(mediaType: string): boolean {
    return Boolean(mediaType.match(jsonContentTypeRegExp));
}

type AsCreatedResponseFunction<KCreated extends string, KOther extends string> = <
    T extends CommonHttpClientResponse<unknown>
>(
    response: T
) =>
    | ({[K in KCreated]: Extract<T, {status: 201}>['body']} & {created: true})
    | ({[K in KOther]: Extract<T, {status: 200}>['body']} & {created: false});

export function asCreatedResponse<KCreated extends string>(
    keyCreated: KCreated
): AsCreatedResponseFunction<KCreated, KCreated>;
export function asCreatedResponse<KCreated extends string, KOther extends string>(
    keyCreated: KCreated,
    keyOther: KOther
): AsCreatedResponseFunction<KCreated, KOther>;
export function asCreatedResponse(...keys: [string] | [string, string]): AsCreatedResponseFunction<string, string> {
    const keyCreated = keys[0];
    const keyOther = keys[1] ?? keyCreated;
    return (response: CommonHttpClientResponse<unknown>) => {
        if (response.status === 201) {
            return {
                created: true,
                [keyCreated]: response.body
            };
        } else {
            return {
                created: false,
                [keyOther]: response.body
            };
        }
    };
}

export const getBody = <T>({body}: CommonHttpClientResponse<T>): T => body;
export const castResponse =
    <T extends Omit<CommonHttpClientResponse<unknown>, 'response'>>() =>
    (response: CommonHttpClientResponse<unknown>) =>
        response as WithResponse<T>;
export const discardResult = (): void => {};

export type WithResponse<T> = T & {response: CommonHttpClientFetchResponse};

export function createClientWithServices<
    TOptions,
    TClient extends {getClient(): CommonHttpClient},
    TServices extends Record<string, {new (client: CommonHttpClient): unknown}>
>(
    this: {new (options?: TOptions): TClient},
    services: TServices,
    options?: TOptions
): TClient & {
    [K in keyof TServices as K extends string
        ? Uncapitalize<K extends `${infer TName}Service` ? TName : K>
        : K]: InstanceType<TServices[K]>;
} {
    const client = new this(options);
    const extension: Record<string, unknown> = {};
    for (const serviceName in services) {
        if (Object.prototype.hasOwnProperty.call(services, serviceName)) {
            extension[serviceName.replace(/[^\b]Service$/, '').replace(/^\w/, (s) => s.toLowerCase())] = new services[
                serviceName
            ](client.getClient());
        }
    }
    return Object.assign(client, extension as never);
}

function getErrorMessage(e: unknown) {
    return e instanceof Error ? e.message : String(e);
}

/**
 * Parameter formatter.
 */
type ParameterFormatter = (key: string, value: unknown, explode: boolean) => ParameterFormatterResult;

/**
 * Parameter formatter result.
 */
interface ParameterFormatterResult {
    pairs: {key?: string; value: string}[];
    pairSeparator?: string;
    keyValueSeparator?: string;
}

function parameterHasValue(value: unknown): value is string | number | boolean | Record<string, unknown> | unknown[] {
    return (
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0) &&
        (typeof value !== 'object' || Object.keys(value).length > 0)
    );
}

function parameterFormattedParameterToString({
    pairs,
    pairSeparator = '',
    keyValueSeparator = ''
}: ParameterFormatterResult): string {
    return pairs
        .map(({key, value}) => (key !== undefined ? `${key}${keyValueSeparator}${value}` : value))
        .join(pairSeparator);
}

const formatParameter: Record<CommonHttpClientRequestParameterSerializeStyle, ParameterFormatter> = {
    simple(_key: string, value: unknown, explode: boolean): ParameterFormatterResult {
        if (!parameterHasValue(value)) {
            return {pairs: []};
        }
        if (Array.isArray(value)) {
            return {pairs: [{value: value.join(',')}]};
        }
        if (typeof value === 'object' && value !== null) {
            return {
                pairs: [
                    {
                        value: Object.entries(value)
                            .map(([key, val]) => `${key}${explode ? '=' : ','}${val}`)
                            .join(',')
                    }
                ]
            };
        }
        return {pairs: [{value: String(value)}]};
    },
    label(_key: string, value: unknown, explode: boolean): ParameterFormatterResult {
        if (!parameterHasValue(value)) {
            return {pairs: [{value: '.'}]};
        }
        if (Array.isArray(value)) {
            return {pairs: [{value: '.' + value.join('.')}]};
        }
        if (typeof value === 'object' && value !== null) {
            return {
                pairs: [
                    {
                        value: Object.entries(value)
                            .map(([key, val]) => `.${key}${explode ? '=' : '.'}${val}`)
                            .join('')
                    }
                ]
            };
        }
        return {pairs: [{value: '.' + String(value)}]};
    },
    matrix(key: string, value: unknown, explode: boolean): ParameterFormatterResult {
        if (!parameterHasValue(value)) {
            return {pairs: [{value: `;${key}`}]};
        }
        if (Array.isArray(value)) {
            return {
                pairs: [{value: explode ? value.map((val) => `;${key}=${val}`).join('') : `;${key}=${value.join(',')}`}]
            };
        }
        if (typeof value === 'object') {
            return {
                pairs: [
                    {
                        value: explode
                            ? Object.entries(value)
                                  .map(([subKey, subValue]) => `;${subKey}=${subValue}`)
                                  .join('')
                            : `;${key}=${Object.entries(value)
                                  .map(([subKey, subValue]) => `${subKey},${subValue}`)
                                  .join(',')}`
                    }
                ]
            };
        }
        return {pairs: [{value: `;${key}=${String(value)}`}]};
    },
    form(key: string, value: unknown, explode: boolean): ParameterFormatterResult {
        if (!parameterHasValue(value)) {
            return {pairs: []};
        }
        if (Array.isArray(value)) {
            return {
                pairs: explode ? value.map((val) => ({key, value: String(val)})) : [{key, value: value.join(',')}],
                pairSeparator: '&',
                keyValueSeparator: '='
            };
        }
        if (typeof value === 'object') {
            return {
                pairs: explode
                    ? Object.entries(value).map(([subKey, subValue]) => ({key: subKey, value: String(subValue)}))
                    : [
                          {
                              key,
                              value: Object.entries(value)
                                  .map(([subKey, subValue]) => `${subKey},${subValue}`)
                                  .join(',')
                          }
                      ],
                pairSeparator: '&',
                keyValueSeparator: '='
            };
        }
        return {pairs: [{key, value: String(value)}]};
    },
    spaceDelimited(key: string, value: unknown): ParameterFormatterResult {
        if (!parameterHasValue(value)) {
            return {pairs: []};
        }
        if (Array.isArray(value)) {
            return {
                pairs: [{key, value: value.join(' ')}]
            };
        }
        if (typeof value === 'object') {
            return {
                pairs: [
                    {
                        key,
                        value: Object.entries(value)
                            .map(([subKey, subValue]) => `${subKey} ${subValue}`)
                            .join(' ')
                    }
                ]
            };
        }
        return {pairs: [{key, value: String(value)}]};
    },
    pipeDelimited(key: string, value: unknown): ParameterFormatterResult {
        if (!parameterHasValue(value)) {
            return {pairs: []};
        }
        if (Array.isArray(value)) {
            return {
                pairs: [{key, value: value.join('|')}]
            };
        }
        if (typeof value === 'object') {
            return {
                pairs: [
                    {
                        key,
                        value: Object.entries(value)
                            .map(([subKey, subValue]) => `${subKey}|${subValue}`)
                            .join('|')
                    }
                ]
            };
        }
        return {pairs: [{key, value: String(value)}]};
    },
    deepObject(key: string, value: unknown): ParameterFormatterResult {
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            return {
                pairs: Object.entries(value).flatMap(
                    ([subKey, subValue]) => formatParameter.deepObject(`${key}[${subKey}]`, subValue, true).pairs
                ),
                pairSeparator: '&',
                keyValueSeparator: '='
            };
        }
        return {
            pairs: [{key, value: String(value)}]
        };
    }
};

/**
 * Stores the deprecation warning state. For every shown deprecation warning, the method and path are stored in order to
 * avoid showing the same warning appearing multiple times.
 */
const deprecationWarningShown: {[methodAndPath: string]: boolean} = {};

/**
 * Default implementation of the redirect handler.
 */
const defaultRedirectHandler: Exclude<CommonHttpClientOptions['followRedirects'], boolean | undefined> = async ({
    url,
    response
}: {
    url: URL;
    response: CommonHttpClientFetchResponse;
}) => {
    const redirectUrl = new URL(response.headers['location'], url);
    let responseUrl;
    try {
        responseUrl = new URL(response.url);
    } catch (e) {
        responseUrl = url;
    }

    if (responseUrl.host !== redirectUrl.host) {
        return {type: 'externalRedirect'};
    } else {
        return {type: 'redirect'};
    }
};

/**
 * Default fetch implementation.
 */
async function defaultFetch(url: URL, request: CommonHttpClientFetchRequest): Promise<CommonHttpClientFetchResponse> {
    const {...requestProps} = request;
    const requestInit: RequestInit = requestProps;
    const response = await fetch(url, requestInit);
    const body: CommonHttpClientFetchResponseBody = isJsonMediaType(response.headers.get('content-type') ?? '')
        ? {type: 'json', data: await response.json()}
        : {type: 'blob', data: await response.blob()};
    const headers: CommonHttpClientResponseHeaders = {};
    response.headers.forEach((value, key) => {
        headers[key] = value;
    });
    if (response.headers.has('set-cookie') && 'getSetCookie' in response.headers) {
        headers['set-cookie'] = (response.headers as {getSetCookie(): string[]}).getSetCookie();
    }
    return {
        status: response.status,
        statusText: response.statusText,
        body,
        url: response.url,
        headers,
        ok: response.ok,
        customRequestProps: request.customRequestProps
    };
}

/**
 * Common HTTP client. Configurable for different environments.
 */
export class CommonHttpClient {
    protected options: CommonHttpClientOptions;

    constructor(options: CommonHttpClientOptions) {
        this.options = options;
    }

    /**
     * Configure the client.
     */
    public setOptions(options: CommonHttpClientOptions) {
        this.options = options;
    }

    /**
     * Get the current configuration.
     */
    public getOptions(): CommonHttpClientOptions {
        return this.options;
    }

    /**
     * Logs a deprecation warning if the operation is deprecated.
     */
    protected logDeprecationWarningIfNecessary(params: {path: string; method: CommonHttpClientFetchRequest['method']}) {
        const methodAndPath = `${params.method} ${params.path}`;
        const operationName = this.options.deprecatedOperations?.[methodAndPath];
        if (!operationName) {
            return;
        }
        if (!deprecationWarningShown[methodAndPath]) {
            deprecationWarningShown[methodAndPath] = true;
            if (this.options.logDeprecationWarning) {
                this.options.logDeprecationWarning({method: params.method, path: params.path, operationName});
            } else {
                console.warn(
                    `Deprecated API call ${this.options.apiClientClassName}.${operationName}: ${methodAndPath}`
                );
            }
        }
    }

    /**
     * Turns an object with query params into a URLSearchParams object.
     */
    protected getSearchParams(
        params: Record<string, unknown>,
        parameters: Record<string, CommonHttpClientRequestParameterSerializeInfo>
    ): URLSearchParams {
        const result = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            const {style = 'form', explode = style === 'form'}: CommonHttpClientRequestParameterSerializeInfo =
                parameters[key] ?? {};
            const {pairs} = formatParameter[style](key, value, explode);
            for (const {key, value} of pairs) {
                if (key !== undefined) {
                    result.append(key, value);
                }
            }
        }
        return result;
    }

    /**
     * Build the URL path from the request by applying path params.
     */
    protected buildUrlPath(
        request: CommonHttpClientRequest,
        parameters: Record<string, CommonHttpClientRequestParameterSerializeInfo>
    ): string {
        const pathParams = request.pathParams;
        if (pathParams) {
            return request.path.replace(/\{(.*?)}/g, (original, paramName: string) => {
                if (Object.prototype.hasOwnProperty.call(pathParams, paramName)) {
                    const {style = 'simple', explode = false} = parameters[paramName] ?? {};
                    return encodeURI(
                        parameterFormattedParameterToString(
                            formatParameter[style](paramName, pathParams[paramName], explode)
                        )
                    );
                }
                return original;
            });
        }
        return request.path;
    }

    /**
     * Build the full URL from the request.
     */
    protected buildUrl(request: CommonHttpClientRequest): URL {
        const url = new URL(
            this.buildUrlPath(request, request.parameters?.path ?? {}).replace(/^\//, ''),
            this.options.baseUrl.replace(/\/?$/, '/')
        );
        if (request.query) {
            for (const [key, value] of this.getSearchParams(request.query, request.parameters?.query ?? {})) {
                url.searchParams.append(key, value);
            }
        }
        return url;
    }

    protected processErrorIfNecessary(error: unknown) {
        if (this.options.processError) {
            return this.options.processError(error instanceof Error ? error : new Error(String(error)));
        }
        return error;
    }

    protected async handleRedirect(error: CommonHttpClientError) {
        if (this.options.followRedirects === false) {
            throw this.processErrorIfNecessary(error);
        }

        const {request, response, url} = error;

        if (!request || !response) {
            throw this.processErrorIfNecessary(error);
        }

        if (response.status <= 300 || response.status >= 400 || !response.headers['location']) {
            throw this.processErrorIfNecessary(error);
        }

        const redirectHandler =
            typeof this.options.followRedirects === 'function' ? this.options.followRedirects : defaultRedirectHandler;

        const action = await redirectHandler({url, request, response});

        if (!action || !('type' in action)) {
            error.message = `Invalid redirect handler result for ${error.message}.`;
            throw this.processErrorIfNecessary(error);
        }

        const redirectPreservingMethod = response.status === 307 || response.status === 308;
        const newUrl = new URL(response.headers['location'], url);

        if (action.type === 'error') {
            error.message = `Redirect to ${newUrl.toString()} not allowed by redirect handler. ${error.message}`;
            throw this.processErrorIfNecessary(action.error ?? error);
        } else if (action.type === 'response') {
            return action.response;
        } else if (action.type === 'redirect') {
            const fetchRequest =
                action.request ??
                (await this.generateFetchRequest({
                    path: newUrl.pathname,
                    method: redirectPreservingMethod ? request.method : 'GET'
                }));
            return this.performFetchRequest(newUrl, fetchRequest, this.options.fetch ?? defaultFetch).catch((error) =>
                this.handleRequestError(error)
            );
        } else if (action.type === 'externalRedirect') {
            const fetchRequest = action.request ?? {
                // Change method to GET for 301, 302, 303 redirects
                method: redirectPreservingMethod ? request.method : 'GET',
                headers: {},
                cache: request.cache,
                credentials: request.credentials,
                redirect: 'error'
            };
            return this.performFetchRequest(newUrl, fetchRequest, this.options.externalFetch ?? defaultFetch).catch(
                (error) => this.handleRequestError(error)
            );
        } else {
            error.message = `Invalid redirect handler result for ${error.message}.`;
            throw this.processErrorIfNecessary(error);
        }
    }

    protected handleRequestError(e: unknown): never | Promise<CommonHttpClientFetchResponse> {
        const error = e as CommonHttpClientError;
        return this.handleRedirect(error);
    }

    /**
     * Request wrapper. It performs the request and handles errors.
     */
    public async request(request: CommonHttpClientRequest): Promise<CommonHttpClientFetchResponse> {
        try {
            return await this.performRequest(request);
        } catch (e) {
            return await this.handleRequestError(e);
        }
    }

    protected async generateFetchRequest(request: CommonHttpClientRequest): Promise<CommonHttpClientFetchRequest> {
        try {
            request = await this.preprocessRequest(request);
        } catch (e) {
            let url;
            try {
                url = this.buildUrl(request);
            } catch (e) {
                throw new this.options.errorClass(
                    new URL(request.path, this.options.baseUrl),
                    undefined,
                    undefined,
                    this.options,
                    `Error building request URL: ${getErrorMessage(e)}`
                );
            }
            throw new this.options.errorClass(
                url,
                undefined,
                undefined,
                this.options,
                `preprocessRequest error: ${getErrorMessage(e)}`
            );
        }
        const {
            body,
            path: _path,
            pathParams: _pathParams,
            query: _query,
            headers: requestHeaders,
            cache,
            credentials,
            ...otherRequestProps
        } = request;
        const headers = this.cleanupHeaders(requestHeaders);
        return {
            ...otherRequestProps,
            headers,
            cache: cache ?? 'default',
            credentials: credentials ?? 'same-origin',
            redirect: 'error',
            body: this.getRequestBody(request)
        };
    }

    protected async performFetchRequest(
        url: URL,
        fetchRequest: CommonHttpClientFetchRequest,
        fetchMethod: (url: URL, request: CommonHttpClientFetchRequest) => Promise<CommonHttpClientFetchResponse>
    ): Promise<CommonHttpClientFetchResponse> {
        let attemptNumber = 1;
        for (;;) {
            try {
                let fetchResponse: CommonHttpClientFetchResponse;
                try {
                    fetchResponse = await fetchMethod(url, fetchRequest);
                } catch (e) {
                    throw new this.options.errorClass(url, fetchRequest, undefined, this.options, getErrorMessage(e));
                }
                if (this.options.preprocessFetchResponse) {
                    try {
                        fetchResponse = await this.options.preprocessFetchResponse(fetchResponse, fetchRequest);
                    } catch (e) {
                        throw new this.options.errorClass(
                            url,
                            fetchRequest,
                            fetchResponse,
                            this.options,
                            `preprocessFetchResponse error: ${getErrorMessage(e)}`
                        );
                    }
                }
                if (!fetchResponse.ok) {
                    throw new this.options.errorClass(
                        url,
                        fetchRequest,
                        fetchResponse,
                        this.options,
                        this.options.formatHttpErrorMessage
                            ? this.options.formatHttpErrorMessage(fetchResponse, fetchRequest)
                            : `HTTP Error ${fetchRequest.method} ${url.toString()} ${fetchResponse.status} (${fetchResponse.statusText})`
                    );
                }
                return fetchResponse;
            } catch (error) {
                if (!(await this.options.shouldRetryOnError?.(error as Error, attemptNumber))) {
                    throw error;
                }
                attemptNumber++;
            }
        }
    }

    /**
     * Perform a request.
     */
    protected async performRequest(request: CommonHttpClientRequest): Promise<CommonHttpClientFetchResponse> {
        this.logDeprecationWarningIfNecessary(request);
        const fetchRequest = await this.generateFetchRequest(request);
        let url;
        try {
            url = this.buildUrl(request);
        } catch (e) {
            throw new this.options.errorClass(
                new URL(request.path, this.options.baseUrl),
                undefined,
                undefined,
                this.options,
                `Error building request URL: ${getErrorMessage(e)}`
            );
        }
        return this.performFetchRequest(url, fetchRequest, this.options.fetch ?? defaultFetch);
    }

    /**
     * Post-process the response.
     */
    responseHandler(distribution: {
        [statusCode: string]: {[mediaType: string]: CommonHttpClientFetchResponseBody['type']};
    }) {
        return async (response: CommonHttpClientFetchResponse): Promise<CommonHttpClientResponse<unknown>> => {
            const body = response.body;
            const contentType = response.headers['content-type'];
            const mediaType = contentType ? contentType.replace(/;.*$/, '') : undefined;

            const mediaTypes = distribution[response.status] ?? {};

            let destType;
            if (mediaType) {
                destType = mediaTypes[mediaType];

                if (!destType) {
                    destType = mediaTypes[mediaType.replace(/\/.*$/, '/*')];
                }
                if (!destType) {
                    destType = mediaTypes[mediaType.replace(/^.*\//, '*/')];
                }
                if (!destType) {
                    destType = mediaTypes['*/*'];
                }
            } else {
                destType = mediaTypes['*/*'];
            }

            if (!destType) {
                let binaryBody;
                try {
                    binaryBody = await convertResponseBody(body, this.options.binaryResponseType);
                } catch (e) {
                    throw new this.options.errorClass(
                        new URL(response.url),
                        undefined,
                        response,
                        this.options,
                        `Error converting response body: ${getErrorMessage(e)}`
                    );
                }
                return {
                    mediaType,
                    status: response.status,
                    body: binaryBody,
                    response
                };
            }

            try {
                const convertedBody = await convertResponseBody(body, destType);
                return {
                    mediaType,
                    status: response.status,
                    body: convertedBody.data,
                    response
                };
            } catch (e) {
                throw new this.options.errorClass(
                    new URL(response.url),
                    undefined,
                    response,
                    this.options,
                    `Error converting response body: ${getErrorMessage(e)}`
                );
            }
        };
    }

    public validation<D>(validator: (data: D) => D): (data: D) => D {
        const handleValidationError = this.options.handleValidationError;
        if (!handleValidationError) {
            return validator;
        }
        return (data: D) => {
            try {
                return validator(data);
            } catch (error) {
                handleValidationError(error instanceof Error ? error : new Error(String(error)));
                return data;
            }
        };
    }

    /**
     * Remove undefined and null values from headers.
     */
    private cleanupHeaders(headers?: CommonHttpClientRequestHeaders): CommonHttpClientFetchRequestHeaders {
        if (headers === undefined) {
            return {};
        }
        return Object.fromEntries(
            Object.entries(headers ?? {})
                .filter((header): header is [string, string] => header[1] !== undefined && header[1] !== null)
                .map(([key, value]) => [key.toLowerCase(), value])
        );
    }

    protected getRequestBody(request: CommonHttpClientRequest): BodyInit | undefined {
        if (request.body === undefined) {
            return undefined;
        }
        for (const [key, value] of Object.entries(request.headers ?? {})) {
            if (key.toLowerCase() === 'content-type' && value && isJsonMediaType(value)) {
                return JSON.stringify(request.body);
            }
        }
        return request.body as BodyInit;
    }

    protected async preprocessRequest(request: CommonHttpClientRequest): Promise<CommonHttpClientRequest> {
        const requestWithHeaders = {
            ...request,
            headers: {
                ...this.options.headers,
                ...this.cleanupHeaders(request.headers)
            }
        };
        return this.options.preprocessRequest ? this.options.preprocessRequest(requestWithHeaders) : requestWithHeaders;
    }
}
