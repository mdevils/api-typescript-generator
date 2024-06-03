import {OpenApiSchema} from './common';
import {OpenApiDocument, OpenApiHttpMethod, OpenApiOperation, OpenApiPathItem} from './openapi';
import {CommonOpenApiClientGeneratorConfigDocumentPatch} from '../schema-to-typescript/config';
import {JsonObject, JsonValue} from '../utils/json-value';

async function patch<T>(
    document: OpenApiDocument,
    path: string[],
    patch: (data: T) => T | Promise<T>
): Promise<OpenApiDocument> {
    let currentObject = document as unknown as JsonValue;
    for (const key of path.slice(0, -1)) {
        currentObject = (currentObject as JsonObject)[key];
        if (currentObject === undefined || currentObject === null) {
            throw new Error(`Path ${path.join('/')} does not exist`);
        }
        // noinspection PointlessBooleanExpressionJS
        if (typeof currentObject !== 'object' || currentObject === null) {
            throw new Error(`Path ${path.join('/')} is not an object`);
        }
    }
    const lastPathItem = path[path.length - 1];
    (currentObject as JsonObject)[lastPathItem] = (await patch(
        (currentObject as JsonObject)[lastPathItem] as T
    )) as JsonValue;
    return document;
}

export async function patchOpenApiDocument(
    document: OpenApiDocument,
    config: CommonOpenApiClientGeneratorConfigDocumentPatch
): Promise<OpenApiDocument> {
    let result = document;
    if (config.patchPaths) {
        if (typeof config.patchPaths === 'function') {
            result = await patch(result, ['paths'], config.patchPaths);
        } else {
            for (const [path, pathItemPatch] of Object.entries(config.patchPaths)) {
                if (typeof pathItemPatch === 'function') {
                    result = await patch(result, ['paths', path], (pathItem: OpenApiPathItem) =>
                        pathItemPatch(pathItem, path)
                    );
                } else {
                    for (const [method, methodPatch] of Object.entries(pathItemPatch)) {
                        result = await patch(result, ['paths', path, method], (operation: OpenApiOperation) =>
                            methodPatch(operation, path, method as OpenApiHttpMethod)
                        );
                    }
                }
            }
        }
    }
    if (config.patchTags) {
        result = await patch(result, ['tags'], config.patchTags);
    }
    if (config.patchSchemas) {
        if (typeof config.patchSchemas === 'function') {
            result = await patch(result, ['components', 'schemas'], config.patchSchemas);
        } else {
            for (const [schemaName, schemaPatch] of Object.entries(config.patchSchemas)) {
                result = await patch(result, ['components', 'schemas', schemaName], (schema: OpenApiSchema) =>
                    schemaPatch(schema, schemaName)
                );
            }
        }
    }
    if (config.patchDocument) {
        result = await config.patchDocument(result);
    }
    return result;
}
