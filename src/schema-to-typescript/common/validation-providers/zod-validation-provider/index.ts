import * as fs from 'fs';
import * as path from 'path';
import {parse} from '@babel/parser';
import {
    arrayExpression,
    arrowFunctionExpression,
    binaryExpression,
    blockStatement,
    callExpression,
    Expression,
    expressionStatement,
    identifier,
    ifStatement,
    isIdentifier,
    isImportSpecifier,
    isVariableDeclaration,
    memberExpression,
    newExpression,
    numericLiteral,
    objectExpression,
    objectPattern,
    objectProperty,
    returnStatement,
    Statement,
    stringLiteral,
    templateElement,
    templateLiteral,
    tsTypeReference
} from '@babel/types';
import * as R from 'ramda';
import {extendSchema, OpenApiSchema} from '../../../../schemas/common';
import {addDependencyImport, DependencyImports} from '../../../../utils/dependencies';
import {isJsonMediaType} from '../../../../utils/media-types';
import {objectPropertyKey, valueToAstExpression} from '../../../common';
import {ResultWithDependencyImports, ValidationProvider, ValidationProviderContext} from '../validation-provider';

function member(name: string) {
    return memberExpression(identifier('z'), identifier(name));
}

function zCall(name: string, args: Expression[]) {
    return callExpression(member(name), args);
}

function addIssue({message, path, code = 'custom'}: {message: Expression; path: string[]; code?: string}): Statement {
    return expressionStatement(
        callExpression(memberExpression(identifier('ctx'), identifier('addIssue')), [
            objectExpression([
                objectProperty(identifier('code'), memberExpression(member('ZodIssueCode'), identifier(code))),
                objectProperty(identifier('path'), arrayExpression(path.map(stringLiteral))),
                objectProperty(identifier('message'), message)
            ])
        ])
    );
}

function blockStatementIfNecessary(statement: Statement) {
    return statement.type === 'BlockStatement' ? statement : blockStatement([statement]);
}

async function loadExportsFromFile(filename: string) {
    const ast = parse(await fs.promises.readFile(filename, 'utf-8'), {
        sourceType: 'module',
        plugins: ['typescript']
    });
    const dependencyImports: DependencyImports = {};
    const exports: Record<string, Expression> = {};
    for (const statement of ast.program.body) {
        if (statement.type === 'ImportDeclaration') {
            for (const specifier of statement.specifiers) {
                if (isImportSpecifier(specifier)) {
                    if (
                        specifier.imported.type !== specifier.local.type ||
                        specifier.imported.name !== specifier.local.name
                    ) {
                        throw new Error('Import specifiers should not alter imported names.');
                    }
                    addDependencyImport(dependencyImports, statement.source.value, specifier.local.name, {
                        kind: specifier.importKind === 'type' ? 'type' : 'value',
                        entity: {name: specifier.imported.name}
                    });
                }
            }
        }
        if (statement.type === 'ExportNamedDeclaration' && statement.declaration) {
            if (isVariableDeclaration(statement.declaration)) {
                for (const declaration of statement.declaration.declarations) {
                    if (!isIdentifier(declaration.id)) {
                        throw new Error('Only identifiers can be exported.');
                    }
                    if (!declaration.init) {
                        throw new Error('Only initialized variables can be exported.');
                    }
                    exports[declaration.id.name] = declaration.init;
                }
            }
        }
    }
    return {exports, dependencyImports};
}

export class ZodValidationProvider extends ValidationProvider {
    getSchemaType() {
        const dependencyImports: DependencyImports = {};
        addDependencyImport(dependencyImports, 'zod', 'ZodTypeAny', {
            kind: 'type',
            entity: {name: 'ZodTypeAny'}
        });
        return {result: tsTypeReference(identifier('ZodTypeAny')), dependencyImports};
    }
    withDependencyImports<T>(result: T): {result: T; dependencyImports: DependencyImports} {
        const dependencyImports: DependencyImports = {};
        addDependencyImport(dependencyImports, 'zod', 'z', {
            kind: 'value',
            entity: {name: 'z'}
        });
        return {result, dependencyImports};
    }
    generateSchema(schema: OpenApiSchema, context: ValidationProviderContext): ResultWithDependencyImports<Expression> {
        return this.withDependencyImports(this.generateSchemaItem(schema, context));
    }
    generateSchemaItem(schema: OpenApiSchema, context: ValidationProviderContext): Expression {
        if (schema === true) {
            return zCall('unknown', []);
        }
        if (schema === false) {
            return zCall('never', []);
        }
        if (schema.nullable) {
            return zCall('nullable', [this.generateSchemaItem({...schema, nullable: false}, context)]);
        }
        if (schema.name) {
            return context.getNamedSchemaReference(schema.name);
        }
        if (Array.isArray(schema.type)) {
            return zCall('union', [
                arrayExpression(schema.type.map((type) => this.generateSchemaItem({...schema, type}, context)))
            ]);
        }
        if ('oneOf' in schema && schema.oneOf) {
            const {oneOf, ...flatSchema} = schema;
            if (oneOf.length === 1) {
                return this.generateSchemaItem(extendSchema(flatSchema, oneOf[0]), context);
            }
            return zCall('union', [
                arrayExpression(
                    schema.oneOf.map((subSchema) =>
                        this.generateSchemaItem(extendSchema(flatSchema, subSchema), context)
                    )
                )
            ]);
        }
        if ('anyOf' in schema && schema.anyOf) {
            const {anyOf, ...flatSchema} = schema;
            if (anyOf.length === 1) {
                return this.generateSchemaItem(extendSchema(flatSchema, anyOf[0]), context);
            }
            return zCall('union', [
                arrayExpression(
                    schema.anyOf.map((subSchema) =>
                        this.generateSchemaItem(extendSchema(flatSchema, subSchema), context)
                    )
                )
            ]);
        }
        if ('allOf' in schema && schema.allOf) {
            const {allOf, ...flatSchema} = schema;
            let result = this.generateSchemaItem(extendSchema(flatSchema, allOf[0]), context);
            for (let i = 1; i < allOf.length; i++) {
                result = zCall('intersection', [
                    result,
                    this.generateSchemaItem(extendSchema(flatSchema, allOf[i]), context)
                ]);
            }
            return result;
        }
        if (schema.not !== undefined) {
            throw new Error('"not" is not supported');
        }
        if (schema.const !== undefined) {
            return zCall('literal', [valueToAstExpression(schema.const)]);
        }
        if (schema.enum !== undefined) {
            return zCall('enum', [arrayExpression(schema.enum.map((value) => valueToAstExpression(value)))]);
        }
        if (schema.type === 'null') {
            return zCall('null', []);
        }
        if (schema.type === 'boolean') {
            return zCall('boolean', []);
        }
        if (schema.type === 'string') {
            let result = zCall('string', []);
            if (schema.minLength !== undefined) {
                result = callExpression(memberExpression(result, identifier('min')), [
                    valueToAstExpression(schema.minLength)
                ]);
            }
            if (schema.maxLength !== undefined) {
                result = callExpression(memberExpression(result, identifier('max')), [
                    valueToAstExpression(schema.maxLength)
                ]);
            }
            if (schema.pattern !== undefined) {
                result = callExpression(memberExpression(result, identifier('regex')), [
                    newExpression(identifier('RegExp'), [valueToAstExpression(schema.pattern)])
                ]);
            }
            return result;
        }
        if (schema.type === 'number' || schema.type === 'integer') {
            let result = zCall('number', []);
            if (schema.type === 'integer') {
                result = callExpression(memberExpression(result, identifier('int')), []);
            }
            if (schema.minimum !== undefined) {
                result = callExpression(memberExpression(result, identifier('min')), [
                    valueToAstExpression(schema.minimum)
                ]);
            }
            if (schema.exclusiveMinimum !== undefined) {
                result = callExpression(memberExpression(result, identifier('gt')), [
                    valueToAstExpression(schema.exclusiveMinimum)
                ]);
            }
            if (schema.maximum !== undefined) {
                result = callExpression(memberExpression(result, identifier('max')), [
                    valueToAstExpression(schema.maximum)
                ]);
            }
            if (schema.exclusiveMaximum !== undefined) {
                result = callExpression(memberExpression(result, identifier('lt')), [
                    valueToAstExpression(schema.exclusiveMaximum)
                ]);
            }
            if (schema.multipleOf !== undefined) {
                result = callExpression(memberExpression(result, identifier('multipleOf')), [
                    valueToAstExpression(schema.multipleOf)
                ]);
            }
            return result;
        }
        if (schema.type === 'array') {
            let result;
            if (schema.prefixItems) {
                result = zCall('tuple', [
                    arrayExpression(schema.prefixItems.map((item) => this.generateSchemaItem(item, context)))
                ]);
                if (schema.items !== false) {
                    result = callExpression(memberExpression(result, identifier('rest')), [
                        this.generateSchemaItem(schema.items ?? true, context)
                    ]);
                }
                if (schema.minItems !== undefined) {
                    result = callExpression(memberExpression(result, identifier('superRefine')), [
                        arrowFunctionExpression(
                            [identifier('items'), identifier('ctx')],
                            blockStatement([
                                ifStatement(
                                    binaryExpression(
                                        '<',
                                        memberExpression(identifier('items'), identifier('length')),
                                        numericLiteral(schema.minItems)
                                    ),
                                    blockStatement([
                                        addIssue({
                                            message: stringLiteral(
                                                `Array must contain at least ${schema.minItems} element(s)`
                                            ),
                                            path: [],
                                            code: 'too_small'
                                        })
                                    ])
                                )
                            ])
                        )
                    ]);
                }
                if (schema.maxItems !== undefined) {
                    result = callExpression(memberExpression(result, identifier('superRefine')), [
                        arrowFunctionExpression(
                            [identifier('items'), identifier('ctx')],
                            blockStatement([
                                ifStatement(
                                    binaryExpression(
                                        '>',
                                        memberExpression(identifier('items'), identifier('length')),
                                        numericLiteral(schema.maxItems)
                                    ),
                                    blockStatement([
                                        addIssue({
                                            message: stringLiteral(
                                                `Array must contain at most ${schema.maxItems} element(s)`
                                            ),
                                            path: [],
                                            code: 'too_big'
                                        })
                                    ])
                                )
                            ])
                        )
                    ]);
                }
            } else {
                result = zCall('array', [this.generateSchemaItem(schema.items || true, context)]);
                if (schema.minItems !== undefined) {
                    result = callExpression(memberExpression(result, identifier('min')), [
                        valueToAstExpression(schema.minItems)
                    ]);
                }
                if (schema.maxItems !== undefined) {
                    result = callExpression(memberExpression(result, identifier('max')), [
                        valueToAstExpression(schema.maxItems)
                    ]);
                }
            }
            if (schema.uniqueItems === true) {
                let processedItems: Expression = callExpression(
                    memberExpression(identifier('items'), identifier('map')),
                    [
                        arrowFunctionExpression(
                            [identifier('item')],
                            callExpression(memberExpression(identifier('JSON'), identifier('stringify')), [
                                identifier('item')
                            ])
                        )
                    ]
                );
                if (
                    schema.items &&
                    typeof schema.items !== 'boolean' &&
                    (schema.items.type === 'string' ||
                        schema.items.type === 'number' ||
                        schema.items.type === 'boolean' ||
                        schema.items.type === 'null')
                ) {
                    processedItems = identifier('items');
                }
                result = callExpression(memberExpression(result, identifier('superRefine')), [
                    arrowFunctionExpression(
                        [identifier('items'), identifier('ctx')],
                        blockStatement([
                            ifStatement(
                                binaryExpression(
                                    '!==',
                                    memberExpression(
                                        newExpression(identifier('Set'), [processedItems]),
                                        identifier('size')
                                    ),
                                    memberExpression(identifier('items'), identifier('length'))
                                ),
                                blockStatement([
                                    addIssue({
                                        message: stringLiteral('Array items must be unique'),
                                        path: []
                                    })
                                ])
                            )
                        ])
                    )
                ]);
            }
            if (schema.contains !== undefined) {
                throw new Error('contains is not supported');
            }
            if (schema.minContains !== undefined) {
                throw new Error('minContains is not supported');
            }
            if (schema.maxContains !== undefined) {
                throw new Error('maxContains is not supported');
            }
            return result;
        }

        if (schema.type === 'object') {
            const requiredIndex = R.indexBy(R.identity, schema.required || []);
            let result = zCall('object', [
                objectExpression(
                    schema.properties
                        ? Object.entries(schema.properties).map(([key, value]) => {
                              let propertyValueType = this.generateSchemaItem(value, context);
                              if (!requiredIndex[key]) {
                                  propertyValueType = callExpression(
                                      memberExpression(propertyValueType, identifier('optional')),
                                      []
                                  );
                              }
                              return objectProperty(objectPropertyKey(key), propertyValueType);
                          })
                        : []
                )
            ]);
            if (schema.additionalProperties === false) {
                result = callExpression(memberExpression(result, identifier('strict')), []);
            } else {
                result = callExpression(memberExpression(result, identifier('catchall')), [
                    this.generateSchemaItem(schema.additionalProperties ?? true, context)
                ]);
            }
            if (schema.minProperties !== undefined) {
                result = callExpression(memberExpression(result, identifier('superRefine')), [
                    arrowFunctionExpression(
                        [identifier('obj'), identifier('ctx')],
                        blockStatement([
                            ifStatement(
                                binaryExpression(
                                    '<',
                                    memberExpression(
                                        callExpression(memberExpression(identifier('Object'), identifier('keys')), [
                                            identifier('obj')
                                        ]),
                                        identifier('length')
                                    ),
                                    numericLiteral(schema.minProperties)
                                ),
                                blockStatement([
                                    addIssue({
                                        message: stringLiteral(
                                            `Should have at least ${schema.minProperties} properties`
                                        ),
                                        path: []
                                    })
                                ])
                            )
                        ])
                    )
                ]);
            }
            if (schema.maxProperties !== undefined) {
                result = callExpression(memberExpression(result, identifier('superRefine')), [
                    arrowFunctionExpression(
                        [identifier('obj'), identifier('ctx')],
                        blockStatement([
                            ifStatement(
                                binaryExpression(
                                    '>',
                                    memberExpression(
                                        callExpression(memberExpression(identifier('Object'), identifier('keys')), [
                                            identifier('obj')
                                        ]),
                                        identifier('length')
                                    ),
                                    numericLiteral(schema.maxProperties)
                                ),
                                blockStatement([
                                    addIssue({
                                        message: stringLiteral(
                                            `Should have at most ${schema.maxProperties} properties`
                                        ),
                                        path: []
                                    })
                                ])
                            )
                        ])
                    )
                ]);
            }
            if (schema.patternProperties !== undefined) {
                throw new Error('patternProperties is not supported');
            }
            return result;
        }

        return zCall('unknown', []);
    }
    generateLazyGetter(expression: Expression) {
        return this.withDependencyImports(zCall('lazy', [arrowFunctionExpression([], expression)]));
    }
    generateAssertCall(validationSchema: Expression, data: Expression) {
        return this.withDependencyImports(
            callExpression(memberExpression(validationSchema, identifier('parse')), [data])
        );
    }
    generateOperationResponseSchema(responses: {[statusCode: string]: {[mediaType: string]: Expression | null}}) {
        function generateMediaTypeSchema(mediaType: string) {
            if (mediaType === '*/*') {
                return zCall('string', []);
            } else {
                return zCall('literal', [stringLiteral(mediaType)]);
            }
        }

        const responseEntries = Object.entries(responses);
        if (
            responseEntries.length === 0 ||
            responseEntries.every(([_, mediaTypes]) => Object.keys(mediaTypes).length === 0)
        ) {
            return this.withDependencyImports(zCall('unknown', []));
        }
        if (responseEntries.length === 1) {
            const [status, mediaTypes] = responseEntries[0];
            const mediaTypeEntries = Object.entries(mediaTypes);
            if (mediaTypeEntries.length === 1) {
                const [mediaType, bodySchema] = mediaTypeEntries[0];
                return this.withDependencyImports(
                    zCall('object', [
                        objectExpression([
                            objectProperty(
                                identifier('status'),
                                zCall('literal', [numericLiteral(parseInt(status, 10))])
                            ),
                            objectProperty(identifier('mediaType'), generateMediaTypeSchema(mediaType)),
                            objectProperty(identifier('body'), bodySchema ? bodySchema : zCall('unknown', []))
                        ])
                    ])
                );
            }
        }

        type ResponseProperty = 'status' | 'mediaType' | 'body';
        const usedResponseProperties: Record<ResponseProperty, boolean> = {
            status: false,
            mediaType: false,
            body: false
        };
        function useResponseProperty(propertyName: ResponseProperty) {
            usedResponseProperties[propertyName] = true;
            return identifier(propertyName);
        }

        function generateValidateBodyCall(bodySchema: Expression | null) {
            return bodySchema
                ? expressionStatement(
                      callExpression(memberExpression(bodySchema, identifier('parse')), [useResponseProperty('body')])
                  )
                : returnStatement();
        }

        function generateIfStatementSequence<T>(
            cases: Record<string, T>,
            buildCondition: (key: string) => Expression,
            buildStatement: (value: T, key: string) => Statement,
            otherwiseCallback: () => Statement
        ) {
            let caseEntries = Object.entries(cases);
            if (caseEntries.length === 0) {
                return returnStatement();
            }
            if (caseEntries.length === 1) {
                return buildStatement(caseEntries[0][1], caseEntries[0][0]);
            }
            cases = {...cases};
            let otherwise: Statement | undefined = otherwiseCallback();
            for (const [key, value] of caseEntries) {
                if (R.equals(buildStatement(value, key), otherwise)) {
                    delete cases[key];
                }
            }
            if (R.equals(otherwise, blockStatement([returnStatement()]))) {
                otherwise = undefined;
            }
            caseEntries = Object.entries(cases);
            let prefIfStatement = ifStatement(
                buildCondition(caseEntries[0][0]),
                buildStatement(caseEntries[0][1], caseEntries[0][0])
            );
            const result = prefIfStatement;
            for (let i = 1; i < caseEntries.length; i++) {
                const newIfStatement = ifStatement(
                    buildCondition(caseEntries[i][0]),
                    buildStatement(caseEntries[i][1], caseEntries[i][0])
                );
                prefIfStatement.alternate = newIfStatement;
                prefIfStatement = newIfStatement;
            }
            if (otherwise) {
                prefIfStatement.alternate = otherwise;
            }
            return result;
        }

        function generateMediaTypeSwitch(mediaTypes: {[mediaType: string]: Expression | null}) {
            let wildcardMediaTypeSchema: Expression | null = null;
            if (mediaTypes['*/*'] !== undefined) {
                wildcardMediaTypeSchema = mediaTypes['*/*'];
                mediaTypes = {...mediaTypes};
                delete mediaTypes['*/*'];
            }

            return generateIfStatementSequence(
                mediaTypes,
                (mediaType) => binaryExpression('===', useResponseProperty('mediaType'), stringLiteral(mediaType)),
                (bodySchema, mediaType) =>
                    isJsonMediaType(mediaType)
                        ? blockStatement([generateValidateBodyCall(bodySchema)])
                        : blockStatement([returnStatement()]),
                () => {
                    if (wildcardMediaTypeSchema) {
                        return blockStatementIfNecessary(generateValidateBodyCall(wildcardMediaTypeSchema));
                    }
                    return blockStatement([
                        addIssue({
                            message: templateLiteral(
                                [templateElement({raw: 'Unexpected media type: '}), templateElement({raw: ''})],
                                [useResponseProperty('mediaType')]
                            ),
                            path: ['mediaType']
                        })
                    ]);
                }
            );
        }

        const suprtRefineBody = blockStatementIfNecessary(
            generateIfStatementSequence(
                responses,
                (status) =>
                    binaryExpression('===', useResponseProperty('status'), numericLiteral(parseInt(status, 10))),
                (mediaTypes) => blockStatementIfNecessary(generateMediaTypeSwitch(mediaTypes)),
                () =>
                    blockStatement([
                        addIssue({
                            message: templateLiteral(
                                [templateElement({raw: 'Unexpected status code: '}), templateElement({raw: ''})],
                                [useResponseProperty('status')]
                            ),
                            path: ['status']
                        })
                    ])
            )
        );
        return this.withDependencyImports(
            callExpression(
                memberExpression(
                    zCall('object', [
                        objectExpression([
                            objectProperty(identifier('status'), zCall('number', [])),
                            objectProperty(identifier('mediaType'), zCall('string', [])),
                            objectProperty(identifier('body'), zCall('unknown', []))
                        ])
                    ]),
                    identifier('superRefine')
                ),
                [
                    arrowFunctionExpression(
                        [
                            objectPattern(
                                Object.entries(usedResponseProperties)
                                    .map(([key, value]) =>
                                        value ? objectProperty(identifier(key), identifier(key)) : null
                                    )
                                    .filter((prop): prop is Exclude<typeof prop, null> => prop !== null)
                            ),
                            identifier('ctx')
                        ],
                        suprtRefineBody
                    )
                ]
            )
        );
    }
    async generateMakeExtensibleCallback(): Promise<ResultWithDependencyImports<Expression>> {
        const {exports, dependencyImports} = await loadExportsFromFile(path.join(__dirname, 'make-extensible.ts'));
        if (!exports.makeExtensible) {
            throw new Error('makeExtensible function must be exported.');
        }
        return {result: exports.makeExtensible, dependencyImports};
    }
    async generateFormatErrorMessageCallback(): Promise<ResultWithDependencyImports<Expression>> {
        const {exports, dependencyImports} = await loadExportsFromFile(path.join(__dirname, 'format-error-message.ts'));
        if (!exports.formatErrorMessage) {
            throw new Error('formatErrorMessage function must be exported.');
        }
        return {result: exports.formatErrorMessage, dependencyImports};
    }
}
