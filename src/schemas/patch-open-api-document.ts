import {OpenApiSchema} from './common';
import {OpenApiDocument, OpenApiHttpMethod, OpenApiOperation, OpenApiPathItem} from './openapi';
import {CommonOpenApiClientGeneratorConfigDocumentPatch} from '../schema-to-typescript/config';
import {JsonObject, JsonValue} from '../utils/json-value';

function patch<T>(document: OpenApiDocument, path: string[], patch: (data: T) => T): OpenApiDocument {
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
    (currentObject as JsonObject)[lastPathItem] = patch((currentObject as JsonObject)[lastPathItem] as T) as JsonValue;
    return document;
}

export function patchOpenApiDocument(
    document: OpenApiDocument,
    config: CommonOpenApiClientGeneratorConfigDocumentPatch
): OpenApiDocument {
    let result = document;
    if (config.patchPaths) {
        if (typeof config.patchPaths === 'function') {
            result = patch(result, ['paths'], config.patchPaths);
        } else {
            for (const [path, pathItemPatch] of Object.entries(config.patchPaths)) {
                if (typeof pathItemPatch === 'function') {
                    result = patch(
                        result,
                        ['paths', path],
                        (pathItem: OpenApiPathItem): OpenApiPathItem => pathItemPatch(pathItem, path)
                    );
                } else {
                    for (const [method, methodPatch] of Object.entries(pathItemPatch)) {
                        result = patch(
                            result,
                            ['paths', path, method],
                            (operation: OpenApiOperation): OpenApiOperation =>
                                methodPatch(operation, path, method as OpenApiHttpMethod)
                        );
                    }
                }
            }
        }
    }
    if (config.patchTags) {
        result = patch(result, ['tags'], config.patchTags);
    }
    if (config.patchSchemas) {
        if (typeof config.patchSchemas === 'function') {
            result = patch(result, ['components', 'schemas'], config.patchSchemas);
        } else {
            for (const [schemaName, schemaPatch] of Object.entries(config.patchSchemas)) {
                result = patch(
                    result,
                    ['components', 'schemas', schemaName],
                    (schema: OpenApiSchema): OpenApiSchema => schemaPatch(schema, schemaName)
                );
            }
        }
    }
    if (config.patchDocument) {
        result = config.patchDocument(result);
    }
    return result;
}
