import {OpenApiSchema} from '../schemas/common';

/**
 * Sometimes schemas have unnecessary properties that can be removed to make the schema cleaner.
 */
export function cleanupSchema(schema: OpenApiSchema): OpenApiSchema {
    if (typeof schema === 'boolean') {
        return schema;
    }
    if ('enum' in schema && schema.enum) {
        const {enum: enumValues, ...rest} = schema;
        if (enumValues.length === 0) {
            return rest;
        }
        if (enumValues.length === 1) {
            return {
                ...rest,
                const: enumValues[0]
            };
        }
        if (enumValues.length === 2 && enumValues.every((v) => typeof v === 'boolean')) {
            return {
                ...rest,
                type: 'boolean'
            };
        }
    }
    return schema;
}
