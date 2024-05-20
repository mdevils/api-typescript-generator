export interface CommonHttpClientOptions {
    baseUrl: string;
    errorClass: {
        new (
            url: URL,
            request: CommonHttpClientFetchRequest | undefined,
            response: CommonHttpClientFetchResponse | undefined,
            options: CommonHttpClientOptions | undefined,
            message: string
        ): Error;
    };
    headers?: CommonHttpClientRequestHeaders;
    preprocessRequest?: (request: CommonHttpClientRequest) => Promise<CommonHttpClientRequest>;
    preprocessFetchResponse?: (
        response: CommonHttpClientFetchResponse,
        request: CommonHttpClientFetchRequest
    ) => Promise<CommonHttpClientFetchResponse>;
    fetch?: (url: URL, request: CommonHttpClientFetchRequest) => Promise<CommonHttpClientFetchResponse>;
    binaryResponseType: 'blob' | 'readableStream';
    formatHttpErrorMessage?: (response: CommonHttpClientFetchResponse, request: CommonHttpClientFetchRequest) => string;
}

export interface CommonHttpClientRequestHeaders {
    [headerName: string]: string | undefined | null;
}

export interface CommonHttpClientFetchRequestHeaders {
    [headerName: string]: string;
}

export interface CommonHttpClientFetchRequest {
    method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'PATCH';
    headers: CommonHttpClientFetchRequestHeaders;
    body?: BodyInit;
    cache: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
    credentials: 'include' | 'omit' | 'same-origin';
    redirect: 'error' | 'follow' | 'manual';
    customRequestProps?: Record<string, unknown>;
}

export type CommonHttpClientRequest = Omit<
    CommonHttpClientFetchRequest,
    'body' | 'headers' | 'cache' | 'credentials' | 'redirect'
> & {
    path: string;
    pathParams?: Record<string, unknown>;
    query?: Record<string, unknown>;
    body?: unknown;
    headers?: CommonHttpClientRequestHeaders;
} & Partial<Pick<CommonHttpClientFetchRequest, 'cache' | 'credentials' | 'redirect'>>;

export interface CommonHttpClientFetchResponse {
    status: number;
    statusText: string;
    body: CommonHttpClientFetchResponseBody;
    ok: boolean;
    url: string;
    headers: CommonHttpClientResponseHeaders;
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

export class CommonHttpClientError extends Error {
    public readonly url: URL;
    public readonly request: CommonHttpClientFetchRequest | undefined;
    public readonly response: CommonHttpClientFetchResponse | undefined;
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

type ResponseByMediaType<T extends CommonHttpClientResponse<unknown>, K extends string> = T extends any
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

export class CommonHttpClient {
    protected options: CommonHttpClientOptions;

    constructor(options: CommonHttpClientOptions) {
        this.options = options;
    }

    public setOptions(options: CommonHttpClientOptions) {
        this.options = options;
    }

    public getOptions(): CommonHttpClientOptions {
        return this.options;
    }

    protected getSearchParams(params: Record<string, unknown>): URLSearchParams {
        const result = new URLSearchParams();

        const process = (key: string, value: unknown) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    for (const arrayVal of value) {
                        process(key, arrayVal);
                    }
                } else if (typeof value === 'object') {
                    for (const [subKey, subValue] of Object.entries(params)) {
                        process(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    result.append(key, String(value));
                }
            }
        };

        for (const [key, value] of Object.entries(params)) {
            process(key, value);
        }

        return result;
    }

    protected buildUrlPath(request: CommonHttpClientRequest): string {
        const pathParams = request.pathParams;
        if (pathParams) {
            return request.path.replace(/\{(.*?)}/g, (original, paramName: string) => {
                if (Object.prototype.hasOwnProperty.call(pathParams, paramName)) {
                    return encodeURI(String(pathParams[paramName]));
                }
                return original;
            });
        }
        return request.path;
    }

    protected buildUrl(request: CommonHttpClientRequest): URL {
        const url = new URL(this.buildUrlPath(request).replace(/^\//, ''), this.options.baseUrl.replace(/\/?$/, '/'));
        if (request.query) {
            for (const [key, value] of this.getSearchParams(request.query)) {
                url.searchParams.append(key, value);
            }
        }
        return url;
    }

    protected async fetch(url: URL, request: CommonHttpClientFetchRequest): Promise<CommonHttpClientFetchResponse> {
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
        if (response.headers.has('set-cookie')) {
            if ('getSetCookie' in response.headers) {
                headers['set-cookie'] = (response.headers as {getSetCookie(): string[]}).getSetCookie();
            }
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

    public async request(request: CommonHttpClientRequest): Promise<CommonHttpClientFetchResponse> {
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
        const {
            body,
            path: _path,
            pathParams: _pathParams,
            query: _query,
            headers: requestHeaders,
            cache,
            credentials,
            redirect,
            ...otherRequestProps
        } = request;
        const headers = this.cleanupHeaders(requestHeaders);
        const fetchRequest: CommonHttpClientFetchRequest = {
            ...otherRequestProps,
            headers,
            cache: cache ?? 'default',
            credentials: credentials ?? 'same-origin',
            redirect: redirect ?? 'follow',
            body: this.getRequestBody(request)
        };
        let fetchResponse: CommonHttpClientFetchResponse;
        try {
            if (this.options.fetch) {
                fetchResponse = await this.options.fetch(url, fetchRequest);
            } else {
                fetchResponse = await this.fetch(url, fetchRequest);
            }
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
                    : `HTTP Error ${fetchResponse.status} (${fetchResponse.statusText})`
            );
        }
        return fetchResponse;
    }

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
