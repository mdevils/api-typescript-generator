import generate from '@babel/generator';
import {
    arrayExpression,
    booleanLiteral,
    CommentBlock,
    CommentLine,
    Expression,
    Identifier,
    identifier,
    isValidIdentifier,
    nullLiteral,
    NumericLiteral,
    numericLiteral,
    objectExpression,
    objectProperty,
    Program,
    StringLiteral,
    stringLiteral,
    tsArrayType,
    tsBooleanKeyword,
    tsIndexSignature,
    tsIntersectionType,
    tsLiteralType,
    tsNeverKeyword,
    tsNullKeyword,
    tsNumberKeyword,
    tsPropertySignature,
    tsRestType,
    tsStringKeyword,
    tsTupleType,
    TSType,
    TSTypeAnnotation,
    tsTypeAnnotation,
    tsTypeLiteral,
    tsTypeReference,
    tsUnionType,
    tsUnknownKeyword
} from '@babel/types';
import {OpenApiClientGeneratorConfig} from './openapi-to-typescript-client';
import {
    extendSchema,
    OpenApiExample,
    OpenApiExpandedSchema,
    OpenApiSchema,
    OpenApiSchemaPrimitiveValue
} from '../schemas/common';
import {attachJsDocComment, extractJsDoc, JsDocBlock, JsDocRenderConfig, renderJsDoc} from '../utils/jsdoc';
import {applyEntityNameCase} from '../utils/string-utils';
import {simplifyIntersectionTypeIfPossible, simplifyUnionTypeIfPossible} from '../utils/type-utils';

export interface GenerateSchemaTypeParams {
    schema: OpenApiSchema;
    getTypeName: (name: string, schema: OpenApiSchema) => string;
    getBinaryType: () => TSType;
    expand?: boolean;
    processJsDoc?: (jsdoc: JsDocBlock, entity: OpenApiSchema, path: string[]) => JsDocBlock;
    processJsDocPath?: string[];
    jsDocRenderConfig?: JsDocRenderConfig;
}

/**
 * @see http://json-schema.org/draft/2020-12/json-schema-core.html#rfc.section.4.2.1
 * @see https://www.asyncapi.com/docs/specifications/2.0.0#dataTypeFormat
 */
export function generateSchemaType({
    schema,
    getTypeName,
    expand = false,
    processJsDoc,
    processJsDocPath,
    getBinaryType,
    jsDocRenderConfig
}: GenerateSchemaTypeParams): TSType {
    const commonSchemaGenerationOptions = {
        getTypeName,
        getBinaryType,
        processJsDoc,
        processJsDocPath,
        jsDocRenderConfig
    };
    if (schema === true) {
        return tsUnknownKeyword();
    }
    if (schema === false) {
        return tsNeverKeyword();
    }
    if (schema.nullable) {
        return simplifyUnionTypeIfPossible(
            tsUnionType([
                generateSchemaType({
                    schema: Object.assign({}, schema, {nullable: false}),
                    ...commonSchemaGenerationOptions
                }),
                tsNullKeyword()
            ])
        );
    }
    if (!expand && isNamedSchema(schema)) {
        return tsTypeReference(identifier(getTypeName(schema.name, schema)));
    }
    if (Array.isArray(schema.type)) {
        const {type, ...flatSchema} = schema;
        return simplifyUnionTypeIfPossible(
            tsUnionType(
                schema.type.map((type) =>
                    generateSchemaType({schema: {...flatSchema, type}, ...commonSchemaGenerationOptions})
                )
            )
        );
    }
    if ('oneOf' in schema && schema.oneOf) {
        const {oneOf, ...flatSchema} = schema;
        return simplifyUnionTypeIfPossible(
            tsUnionType(
                schema.oneOf.map((subSchema) =>
                    generateSchemaType({schema: extendSchema(flatSchema, subSchema), ...commonSchemaGenerationOptions})
                )
            )
        );
    }
    if ('anyOf' in schema && schema.anyOf) {
        const {anyOf, ...flatSchema} = schema;
        return simplifyUnionTypeIfPossible(
            tsUnionType(
                schema.anyOf.map((subSchema) =>
                    generateSchemaType({schema: extendSchema(flatSchema, subSchema), ...commonSchemaGenerationOptions})
                )
            )
        );
    }
    if ('allOf' in schema && schema.allOf) {
        const {allOf, ...flatSchema} = schema;
        return simplifyIntersectionTypeIfPossible(
            tsIntersectionType(
                schema.allOf.map((subSchema) =>
                    generateSchemaType({schema: extendSchema(flatSchema, subSchema), ...commonSchemaGenerationOptions})
                )
            )
        );
    }
    if (schema.const !== undefined) {
        return primitiveValueToType(schema.const);
    }
    if (schema.enum !== undefined) {
        return simplifyUnionTypeIfPossible(tsUnionType(schema.enum.map(primitiveValueToType)));
    }
    if (schema.type === 'null') {
        return tsNullKeyword();
    }
    if (schema.type === 'string') {
        if (schema.format === 'binary') {
            return getBinaryType();
        } else {
            return tsStringKeyword();
        }
    }
    if (schema.type === 'boolean') {
        return tsBooleanKeyword();
    }
    if (schema.type === 'number' || schema.type === 'integer') {
        return tsNumberKeyword();
    }
    if (schema.type === 'array') {
        if (schema.prefixItems) {
            return tsTupleType([
                ...schema.prefixItems.map((item) =>
                    generateSchemaType({schema: item, ...commonSchemaGenerationOptions})
                ),
                ...(schema.items !== false
                    ? [
                          tsRestType(
                              tsArrayType(
                                  generateSchemaType({
                                      schema: schema.items ?? true,
                                      ...commonSchemaGenerationOptions
                                  })
                              )
                          )
                      ]
                    : [])
            ]);
        }
        return tsArrayType(generateSchemaType({schema: schema.items ?? true, ...commonSchemaGenerationOptions}));
    }
    if (schema.type === 'object') {
        const objectIntersection: TSType[] = [];

        if (schema.properties) {
            const requiredFieldsIndex = (schema.required ?? []).reduce(
                (res, fieldName) => {
                    res[fieldName] = true;
                    return res;
                },
                {} as Record<string, boolean>
            );
            objectIntersection.push(
                tsTypeLiteral(
                    Object.entries(schema.properties).map(([fieldName, fieldSchema]) => {
                        let jsdoc = extractJsDoc(fieldSchema);
                        const currentProcessJsDocPath = processJsDocPath ?? [];
                        if (processJsDoc) {
                            jsdoc = processJsDoc(jsdoc, fieldSchema, currentProcessJsDocPath);
                        }
                        return attachJsDocComment(
                            Object.assign(
                                tsPropertySignature(
                                    objectPropertyKey(fieldName),
                                    tsTypeAnnotation(
                                        generateSchemaType({
                                            schema: fieldSchema,
                                            ...commonSchemaGenerationOptions,
                                            processJsDocPath: currentProcessJsDocPath.concat(fieldName)
                                        })
                                    )
                                ),
                                {
                                    optional: !requiredFieldsIndex[fieldName]
                                }
                            ),
                            renderJsDoc(jsdoc, jsDocRenderConfig)
                        );
                    })
                )
            );
        }

        const additionalProperties = schema.additionalProperties ?? true;
        if (additionalProperties !== false) {
            let keyName = 'key';
            if (typeof additionalProperties === 'object' && additionalProperties.title) {
                keyName = applyEntityNameCase(additionalProperties.title, 'camelCase');
            }
            objectIntersection.push(
                tsTypeLiteral([
                    attachJsDocComment(
                        tsIndexSignature(
                            [attachTypeAnnotation(identifier(keyName), tsTypeAnnotation(tsStringKeyword()))],
                            tsTypeAnnotation(
                                generateSchemaType({schema: additionalProperties, ...commonSchemaGenerationOptions})
                            )
                        ),
                        renderJsDoc(extractJsDoc(additionalProperties), jsDocRenderConfig)
                    )
                ])
            );
        }

        if (objectIntersection.length === 0) {
            return tsTypeLiteral([]);
        }

        return simplifyIntersectionTypeIfPossible(tsIntersectionType(objectIntersection));
    }
    return tsUnknownKeyword();
}

export function unionTypeIfNecessary(types: TSType[]): TSType {
    return types.length > 1 ? tsUnionType(types) : types[0];
}

export function objectPropertyKey(id: string | number): Identifier | StringLiteral | NumericLiteral {
    return typeof id === 'number'
        ? numericLiteral(id)
        : isValidIdentifier(id, false)
          ? identifier(id)
          : stringLiteral(id);
}

export interface AnnotatedApiEntity {
    title?: string;
    description?: string;
    example?: unknown;
    examples?: Record<string, OpenApiExample>;
    deprecated?: boolean;
}

export function primitiveValueToType(value: OpenApiSchemaPrimitiveValue): TSType {
    if (typeof value === 'string') {
        return tsLiteralType(stringLiteral(value));
    }
    if (typeof value === 'number') {
        return tsLiteralType(numericLiteral(value));
    }
    if (typeof value === 'boolean') {
        return tsLiteralType(booleanLiteral(value));
    }
    return tsNullKeyword();
}

export function valueToAstExpression(value: unknown): Expression {
    if (typeof value === 'string') {
        return stringLiteral(value);
    }
    if (typeof value === 'number') {
        return numericLiteral(value);
    }
    if (typeof value === 'boolean') {
        return booleanLiteral(value);
    }
    if (value === null) {
        return nullLiteral();
    }
    if (Array.isArray(value)) {
        return arrayExpression(value.map(valueToAstExpression));
    }
    if (typeof value === 'object') {
        return objectExpression(
            Object.entries(value).map(([key, value]) =>
                objectProperty(objectPropertyKey(key), valueToAstExpression(value))
            )
        );
    }
    return nullLiteral();
}

export function isNamedSchema(schema: OpenApiSchema): schema is OpenApiExpandedSchema & {name: string} {
    return typeof schema !== 'boolean' && schema.name !== undefined;
}

export function attachTypeAnnotation(node: Identifier, typeAnnotation: TSTypeAnnotation): Identifier {
    node.typeAnnotation = typeAnnotation;
    return node;
}

export type CommentsRenderConfig = OpenApiClientGeneratorConfig['comments'];

function addComment(node: Program, position: 'leading' | 'trailing', comment: string): void {
    const comments: (CommentLine | CommentBlock)[] = comment
        .split('\n')
        .map((line) => line.trim())
        .map(
            (line): CommentLine => ({
                type: 'CommentLine',
                value: ` ${line}`
            })
        );
    if (position === 'leading') {
        node.leadingComments = comments.concat(node.leadingComments ?? []);
    } else {
        node.trailingComments = (node.trailingComments ?? []).concat(comments);
    }
}

export function renderTypeScript(node: Program, commentsConfig: CommentsRenderConfig = {}): string {
    if (commentsConfig.leadingComment) {
        addComment(node, 'leading', commentsConfig.leadingComment);
    }
    if (commentsConfig.trailingComment) {
        addComment(node, 'trailing', commentsConfig.trailingComment);
    }
    return generate(node).code;
}
