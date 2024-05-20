import * as R from 'ramda';
import {
    OpenApiInfo,
    OpenApiExternalDocumentation,
    OpenApiParameter,
    OpenApiSchema,
    OpenApiServer
} from '../schemas/common';

export interface AsyncApiDocument {
    asyncapi: string;
    info: OpenApiInfo;
    channels: Record<string, AsyncApiChannel>;
    externalDocs?: OpenApiExternalDocumentation;
    components?: {
        schemas: Record<string, OpenApiSchema>;
        messages: Record<string, OpenApiSchema>;
    };
    servers?: Record<string, OpenApiServer>;
}

export function isAsyncApiDocument(document: unknown): document is AsyncApiDocument {
    return typeof document === 'object' && document !== null && 'asyncapi' in document;
}

export const asyncApiOperationTypes = ['publish', 'subscribe'] as const;

export type AsyncApiOperationType = (typeof asyncApiOperationTypes)[number];

export type AsyncApiChannel = {
    description?: string;
    parameters?: Record<string, OpenApiParameter>;
    bindings?: {
        // @see https://github.com/asyncapi/bindings/tree/master/websockets
        ws?: {
            method: 'get' | 'post';
            query?: OpenApiSchema;
            headers?: OpenApiSchema;
            bindingVersion?: string;
        };
    };
} & {[K in (typeof asyncApiOperationTypes)[number]]?: AsyncApiOperation};

export interface AsyncApiOperation {
    operationId: string;
    tags?: string[];
    summary?: string;
    description?: string;
    externalDocs?: OpenApiExternalDocumentation;
    message?: AsyncApiMessage | {oneOf: AsyncApiMessage[]};
    messages: AsyncApiMessage[];
    deprecated?: boolean;
}

export interface AsyncApiMessage {
    name?: string;
    title?: string;
    summary?: string;
    description?: string;
    payload?: OpenApiSchema;
    contentType?: string;
}

export const asyncApiSchemaStorages = ['schemas', 'messages'] as const;

export function processAsyncApiDocument({
    document,
    documentUrl,
    serverUrls,
    excludedServerUrls
}: {
    document: unknown;
    documentUrl: string;
    serverUrls: Record<string, string[]>;
    excludedServerUrls: string[];
}): AsyncApiDocument {
    const asyncApiDocument = R.clone(document) as AsyncApiDocument;
    if (asyncApiDocument.components && asyncApiDocument.components.schemas) {
        for (const [name, schema] of Object.entries(asyncApiDocument.components.schemas)) {
            if (typeof schema !== 'boolean') {
                schema.name = name;
            }
        }
    }
    for (const channel of Object.values(asyncApiDocument.channels)) {
        for (const operationType of asyncApiOperationTypes) {
            const operation = channel[operationType];
            if (operation) {
                if (operation.message) {
                    if ('oneOf' in operation.message) {
                        operation.messages = operation.message.oneOf;
                    } else {
                        operation.messages = [operation.message];
                    }
                } else {
                    operation.messages = [];
                }
            }
        }
    }

    const documentUrlOrigin = new URL(documentUrl).origin;
    const excludedServerUrlsIndex = R.indexBy((url) => url, excludedServerUrls);
    asyncApiDocument.servers = Object.fromEntries(
        R.uniq(
            Object.values(asyncApiDocument.servers ?? {})
                .map(({url}) => new URL(url, documentUrl).origin)
                .concat(documentUrlOrigin)
                .filter((url) => !(url in excludedServerUrlsIndex))
                .concat(serverUrls[asyncApiDocument.info.title] ?? [])
        ).map((url) => [url, {url, description: url === documentUrlOrigin ? 'Self' : ''}])
    );

    return asyncApiDocument;
}
