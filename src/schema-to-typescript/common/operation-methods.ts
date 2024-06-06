import {
    arrayExpression,
    assignmentPattern,
    blockStatement,
    callExpression,
    classMethod,
    ClassMethod,
    Expression,
    expressionStatement,
    Identifier,
    identifier,
    isValidIdentifier,
    memberExpression,
    objectExpression,
    objectPattern,
    objectProperty,
    returnStatement,
    Statement,
    stringLiteral,
    thisExpression,
    tsLiteralType,
    tsPropertySignature,
    tsStringKeyword,
    TSType,
    tsTypeAnnotation,
    tsTypeLiteral,
    tsTypeParameterInstantiation,
    tsTypeReference,
    tsUndefinedKeyword,
    tsUnionType
} from '@babel/types';
import * as R from 'ramda';
import {generateBinaryType} from './binary';
import {GetModelData} from './models';
import {getOperationReturnType} from './operation-return';
import {OpenApiParameter} from '../../schemas/common';
import {openApiHttpMethods, OpenApiMediaType, OpenApiPaths} from '../../schemas/openapi';
import {
    DependencyImports,
    extendDependenciesAndGetResult,
    extendDependencyImports,
    generateSchemaTypeAndImports
} from '../../utils/dependencies';
import {attachJsDocComment, extractJsDoc, JsDocRenderConfig, renderJsDoc} from '../../utils/jsdoc';
import {isJsonMediaType, isWildcardMediaType} from '../../utils/media-types';
import {applyEntityNameCase} from '../../utils/string-utils';
import {getUserFreiendlySchemaName, mergeTypes} from '../../utils/type-utils';
import {objectPropertyKey, valueToAstExpression} from '../common';
import {
    OpenApiClientCustomizableBinaryType,
    OpenApiClientGeneratorConfig,
    OpenApiClientValidationContext
} from '../openapi-to-typescript-client';

const parametersSortTable = {
    path: 0,
    query: 1,
    header: 2,
    cookie: 3
};
function sortParameters(parameters: OpenApiParameter[]) {
    return parameters.concat().sort((a, b) => parametersSortTable[a.in] - parametersSortTable[b.in]);
}

function generateUniqueName(source: string, postfixes: string[], usedNames: Record<string, true>) {
    let result = applyEntityNameCase(source, 'camelCase');
    if (!result && isValidIdentifier(source)) {
        result = source;
    }
    if (!usedNames[result]) {
        return result;
    }
    for (const postfix of postfixes) {
        const result = applyEntityNameCase(`${source} ${postfix}`, 'camelCase');
        if (result && !usedNames[result]) {
            return result;
        }
    }
    let i = 0;
    const baseName =
        applyEntityNameCase(source, 'camelCase') || (isValidIdentifier(source) ? source : postfixes[0]) || 'param';
    while (usedNames[result]) {
        i++;
        result = applyEntityNameCase(`${baseName} ${i}`, 'camelCase');
    }
    return result;
}

interface OpenApiParameterFromArgument {
    paramName: string;
    argumentName: string;
    defaultValue?: Expression;
    optional?: boolean;
    docs: string | null;
    type?: TSType;
}

interface OpenApiParameterValue {
    paramName: string;
    value: Expression;
}

function isOperationParameterFromArgument(
    value: OpenApiParameterFromArgument | OpenApiParameterValue
): value is OpenApiParameterFromArgument {
    return 'argumentName' in value;
}

function renderParameter(parameter: OpenApiParameterFromArgument | OpenApiParameterValue) {
    const {paramName} = parameter;
    const propertyName = objectPropertyKey(paramName);
    if (isOperationParameterFromArgument(parameter)) {
        const {argumentName} = parameter;
        return objectProperty(propertyName, identifier(argumentName), false, paramName === argumentName);
    } else {
        const {value} = parameter;
        return objectProperty(propertyName, value, false, false);
    }
}

export function generateOperationMethods({
    paths,
    serviceName,
    getModelData,
    commonHttpClientImportName,
    validationContext,
    operationsConfig: {
        generateOperationName,
        generateOperationJsDoc,
        generateOperationResultDescription,
        generateOperationParameterArgumentName,
        generateOperationRequestBodyArgumentName,
        mediaTypeArgumentName,
        generateOperationParameterJsDoc,
        generateOperationRequestBodyJsDoc,
        validateResponse,
        makeResponseValidationSchemasExtensible,
        responseBinaryType = 'blob'
    } = {},
    operationImportPath,
    binaryTypes,
    jsDocRenderConfig
}: {
    paths: OpenApiPaths;
    serviceName?: string;
    getModelData: GetModelData;
    commonHttpClientImportName: string;
    validationContext?: OpenApiClientValidationContext;
    operationsConfig?: OpenApiClientGeneratorConfig['operations'];
    operationImportPath: string;
    binaryTypes: OpenApiClientCustomizableBinaryType[];
    jsDocRenderConfig: JsDocRenderConfig;
}) {
    const dependencyImports: DependencyImports = {};
    const getBinaryType = () =>
        extendDependenciesAndGetResult(generateBinaryType(binaryTypes, operationImportPath), dependencyImports);

    const modelRegisterValidationSchemaImports: Record<string, true> = {};
    const methods: ClassMethod[] = [];
    const validationStatements: Statement[] = [];

    if (validateResponse && !validationContext) {
        throw new Error('Validation should be configured for response validation.');
    }

    if (makeResponseValidationSchemasExtensible && !validateResponse) {
        throw new Error('makeResponseValidationSchemasExtensible should be used with validateResponse.');
    }

    function getParameterErrorLocation(param: OpenApiParameter, path: string, httpMethod: string) {
        return (
            `${JSON.stringify(param.name)} at path ` +
            `${JSON.stringify(path)}, method ${httpMethod.toUpperCase()}: unsupported style :` +
            JSON.stringify(param.style)
        );
    }

    function createIncompatibleParameterStyleError(param: OpenApiParameter, path: string, httpMethod: string) {
        return new Error(`Could not process parameter ${getParameterErrorLocation(param, path, httpMethod)}`);
    }

    for (const [path, pathItem] of Object.entries(paths)) {
        for (const httpMethod of openApiHttpMethods) {
            const operation = pathItem[httpMethod];
            if (!operation) {
                continue;
            }
            const suggestedOperationMethodName = applyEntityNameCase(
                operation.operationId ?? `${httpMethod}:${path}`,
                'camelCase'
            );
            const operationName = generateOperationName
                ? generateOperationName({
                      suggestedName: suggestedOperationMethodName,
                      operation,
                      pathItem,
                      path,
                      serviceName,
                      httpMethod
                  })
                : suggestedOperationMethodName;
            const operationReturn = getOperationReturnType({
                operation,
                getModelData,
                operationImportPath,
                commonHttpClientImportName,
                serviceName,
                validationContext,
                makeResponseValidationSchemasExtensible,
                binaryType: responseBinaryType
            });
            validationStatements.push(...operationReturn.validationStatements);
            Object.assign(modelRegisterValidationSchemaImports, operationReturn.modelRegisterValidationSchemaImports);
            const parameters = sortParameters(operation.parameters ?? []);
            const requestLiteral = objectExpression([]);
            requestLiteral.properties.push(objectProperty(identifier('path'), stringLiteral(path)));
            const usedInputNames: Record<string, true> = {};
            const inputParameters: {
                [K in Exclude<OpenApiParameter['in'], 'cookie'> | 'body']: (
                    | OpenApiParameterFromArgument
                    | OpenApiParameterValue
                )[];
            } = {
                path: [],
                query: [],
                header: [],
                body: []
            };
            for (const parameter of parameters) {
                if (parameter.in === 'path') {
                    if (parameter.style && parameter.style !== 'simple') {
                        throw createIncompatibleParameterStyleError(parameter, path, httpMethod);
                    }
                    if (!parameter.required) {
                        throw new Error(
                            `Path parameters should be required: ${getParameterErrorLocation(parameter, path, httpMethod)}`
                        );
                    }
                } else if (parameter.in === 'query') {
                    if (parameter.style && parameter.style !== 'form') {
                        throw createIncompatibleParameterStyleError(parameter, path, httpMethod);
                    }
                } else if (parameter.in === 'header') {
                    if (parameter.style && parameter.style !== 'simple') {
                        throw createIncompatibleParameterStyleError(parameter, path, httpMethod);
                    }
                } else if (parameter.in === 'cookie') {
                    throw new Error(
                        `Parameters in cookies are not supported: ${getParameterErrorLocation(parameter, path, httpMethod)}`
                    );
                } else {
                    throw new Error(
                        `Unknown parameter type ${parameter.in}: ${getParameterErrorLocation(parameter, path, httpMethod)}`
                    );
                }
                const schema = parameter.schema ?? true;
                if (typeof schema !== 'boolean' && schema.const !== undefined) {
                    inputParameters[parameter.in].push({
                        paramName: parameter.name,
                        value: valueToAstExpression(schema.const)
                    });
                } else {
                    const suggestedParameterName = generateUniqueName(
                        parameter.name,
                        [parameter.in, `${parameter.in} param`],
                        usedInputNames
                    );
                    const parameterName = generateUniqueName(
                        generateOperationParameterArgumentName
                            ? generateOperationParameterArgumentName({
                                  operation,
                                  path,
                                  serviceName,
                                  parameter,
                                  pathItem,
                                  operationName,
                                  suggestedName: suggestedParameterName,
                                  httpMethod
                              })
                            : suggestedParameterName,
                        [],
                        usedInputNames
                    );
                    usedInputNames[parameterName] = true;
                    const paramJsDoc = extractJsDoc(parameter);
                    inputParameters[parameter.in].push({
                        paramName: parameter.name,
                        argumentName: parameterName,
                        optional: !parameter.required,
                        type: extendDependenciesAndGetResult(
                            generateSchemaTypeAndImports({
                                schema,
                                sourceImportPath: operationImportPath,
                                getModelData,
                                getBinaryType
                            }),
                            dependencyImports
                        ),
                        docs: renderJsDoc(
                            generateOperationParameterJsDoc
                                ? generateOperationParameterJsDoc({
                                      suggestedJsDoc: paramJsDoc,
                                      operation,
                                      operationName,
                                      serviceName,
                                      parameter,
                                      pathItem,
                                      path,
                                      httpMethod
                                  })
                                : paramJsDoc,
                            jsDocRenderConfig
                        )
                    });
                }
            }
            let jsdoc = extractJsDoc(operation);
            if (operationReturn.suggestedDescription || generateOperationResultDescription) {
                jsdoc.tags.push({
                    name: 'returns',
                    value: generateOperationResultDescription
                        ? generateOperationResultDescription({
                              serviceName,
                              suggestedDescription: operationReturn.suggestedDescription,
                              operation,
                              pathItem,
                              path,
                              httpMethod
                          })
                        : operationReturn.suggestedDescription
                });
            }
            if (generateOperationJsDoc) {
                jsdoc = generateOperationJsDoc({
                    suggestedJsDoc: jsdoc,
                    serviceName,
                    httpMethod,
                    pathItem,
                    path,
                    operation
                });
            }

            const requestObject = objectExpression([
                objectProperty(identifier('path'), stringLiteral(path)),
                objectProperty(identifier('method'), stringLiteral(httpMethod.toUpperCase()))
            ]);

            let requestBodyArgumentNames: string[] | undefined;
            let argumentExtensionType: TSType | undefined;
            const requestBody = operation.requestBody;
            if (requestBody) {
                inputParameters['body'] = [];
                const mediaTypes = Object.entries(requestBody.content).sort(([a], [b]) => a.localeCompare(b));
                if (mediaTypes.length > 1) {
                    for (let i = 0; i < mediaTypes.length; i++) {
                        if (isWildcardMediaType(mediaTypes[i][0])) {
                            mediaTypes.splice(i, 1);
                        }
                    }
                }
                const mediaTypeName = generateUniqueName(mediaTypeArgumentName ?? 'mediaType', [], usedInputNames);
                usedInputNames[mediaTypeName] = true;
                const additionUnion = tsUnionType([]);
                let defaultMediaType: string | undefined;
                const mediaTypesWithRequestBodyNames: {
                    mediaType: string;
                    content: OpenApiMediaType;
                    requestBodyName: string;
                }[] = mediaTypes.map(([mediaType, content]) => {
                    const requestBodySuggestedName = generateUniqueName(
                        getUserFreiendlySchemaName(content.schema ?? true) ?? 'request body',
                        [],
                        usedInputNames
                    );
                    return {
                        mediaType,
                        content,
                        requestBodyName: generateUniqueName(
                            generateOperationRequestBodyArgumentName
                                ? generateOperationRequestBodyArgumentName({
                                      path,
                                      pathItem,
                                      operation,
                                      operationName,
                                      serviceName,
                                      content,
                                      requestBody,
                                      mediaType,
                                      suggestedName: requestBodySuggestedName,
                                      httpMethod
                                  })
                                : requestBodySuggestedName,
                            [],
                            usedInputNames
                        )
                    };
                });

                const allRequestBodyNames = R.uniq(
                    mediaTypesWithRequestBodyNames.map(({requestBodyName}) => requestBodyName)
                ).sort(([a, b]) => a.localeCompare(b));

                requestBodyArgumentNames = allRequestBodyNames;

                if (mediaTypesWithRequestBodyNames.length > 1) {
                    for (const {mediaType, content, requestBodyName} of mediaTypesWithRequestBodyNames) {
                        const schema = content.schema ?? true;
                        let isDefaultType = false;
                        if (!defaultMediaType && isJsonMediaType(mediaType)) {
                            isDefaultType = true;
                            defaultMediaType = mediaType;
                        }
                        const mediaTypeArgumentType = isWildcardMediaType(mediaType)
                            ? tsStringKeyword()
                            : tsLiteralType(stringLiteral(mediaType));
                        const mediaTypePropertySignature = tsPropertySignature(
                            identifier(mediaTypeName),
                            tsTypeAnnotation(mediaTypeArgumentType)
                        );
                        mediaTypePropertySignature.optional = isDefaultType;
                        const jsdoc = extractJsDoc({...requestBody, ...content});
                        additionUnion.types.push(
                            tsTypeLiteral([
                                mediaTypePropertySignature,
                                ...allRequestBodyNames.map((requestBodyNameItem) => {
                                    const isCurrentRequestBody = requestBodyNameItem === requestBodyName;
                                    const property = attachJsDocComment(
                                        tsPropertySignature(
                                            identifier(requestBodyName),
                                            tsTypeAnnotation(
                                                isCurrentRequestBody
                                                    ? extendDependenciesAndGetResult(
                                                          generateSchemaTypeAndImports({
                                                              schema,
                                                              sourceImportPath: operationImportPath,
                                                              getModelData,
                                                              getBinaryType
                                                          }),
                                                          dependencyImports
                                                      )
                                                    : tsUndefinedKeyword()
                                            )
                                        ),
                                        renderJsDoc(
                                            generateOperationRequestBodyJsDoc
                                                ? generateOperationRequestBodyJsDoc({
                                                      suggestedJsDoc: jsdoc,
                                                      serviceName,
                                                      operation,
                                                      pathItem,
                                                      operationName,
                                                      content,
                                                      requestBody,
                                                      path,
                                                      mediaType,
                                                      httpMethod
                                                  })
                                                : jsdoc,
                                            jsDocRenderConfig
                                        )
                                    );
                                    property.optional = !isCurrentRequestBody;
                                    return property;
                                })
                            ])
                        );
                    }
                    inputParameters['header'].push({
                        paramName: 'Content-Type',
                        argumentName: mediaTypeName,
                        docs: null,
                        defaultValue: defaultMediaType ? stringLiteral(defaultMediaType) : undefined
                    });
                    for (const requestBodyName of allRequestBodyNames) {
                        inputParameters['body'].push({
                            argumentName: requestBodyName,
                            paramName: requestBodyName,
                            docs: null
                        });
                    }
                    argumentExtensionType = additionUnion;
                } else if (mediaTypesWithRequestBodyNames.length === 1) {
                    const [{mediaType, content, requestBodyName}] = mediaTypesWithRequestBodyNames;
                    const schema = content.schema ?? true;
                    const jsdoc = extractJsDoc({...requestBody, ...content});
                    if (mediaType.includes('*')) {
                        inputParameters['header'].push({
                            paramName: 'Content-Type',
                            argumentName: mediaTypeName,
                            docs: null,
                            type: tsStringKeyword()
                        });
                    } else {
                        inputParameters['header'].push({
                            paramName: 'Content-Type',
                            value: stringLiteral(mediaType)
                        });
                    }
                    inputParameters['body'].push({
                        paramName: requestBodyName,
                        argumentName: requestBodyName,
                        type: extendDependenciesAndGetResult(
                            generateSchemaTypeAndImports({
                                schema,
                                sourceImportPath: operationImportPath,
                                getModelData,
                                getBinaryType
                            }),
                            dependencyImports
                        ),
                        docs: renderJsDoc(
                            generateOperationRequestBodyJsDoc
                                ? generateOperationRequestBodyJsDoc({
                                      suggestedJsDoc: jsdoc,
                                      serviceName,
                                      operation,
                                      pathItem,
                                      operationName,
                                      content,
                                      requestBody,
                                      path,
                                      mediaType,
                                      httpMethod
                                  })
                                : jsdoc,
                            jsDocRenderConfig
                        )
                    });
                }
            }

            if (inputParameters['path'].length > 0) {
                requestObject.properties.push(
                    objectProperty(
                        identifier('pathParams'),
                        objectExpression(inputParameters['path'].map(renderParameter))
                    )
                );
            }

            if (inputParameters['query'].length > 0) {
                requestObject.properties.push(
                    objectProperty(identifier('query'), objectExpression(inputParameters['query'].map(renderParameter)))
                );
            }

            if (inputParameters['header'].length > 0) {
                requestObject.properties.push(
                    objectProperty(
                        identifier('headers'),
                        objectExpression(inputParameters['header'].map(renderParameter))
                    )
                );
            }

            const argument = objectPattern([]);
            const argumentType = tsTypeLiteral([]);
            for (const {argumentName, type, optional, docs, defaultValue} of Object.values(inputParameters)
                .flatMap((params) => params)
                .filter(isOperationParameterFromArgument)) {
                argument.properties.push(
                    objectProperty(
                        identifier(argumentName),
                        defaultValue
                            ? assignmentPattern(identifier(argumentName), defaultValue)
                            : identifier(argumentName),
                        false,
                        true
                    )
                );
                if (type) {
                    const propertySignature = attachJsDocComment(
                        tsPropertySignature(identifier(argumentName), tsTypeAnnotation(type)),
                        docs
                    );
                    propertySignature.optional = optional;
                    argumentType.members.push(propertySignature);
                }
            }
            argument.typeAnnotation = tsTypeAnnotation(
                argumentExtensionType ? mergeTypes(argumentType, argumentExtensionType) : argumentType
            );

            if (requestBodyArgumentNames && requestBodyArgumentNames.length > 0) {
                requestObject.properties.push(
                    objectProperty(
                        identifier('body'),
                        requestBodyArgumentNames.length > 1
                            ? callExpression(
                                  memberExpression(identifier('commonHttpClient'), identifier('pickRequestBody')),
                                  requestBodyArgumentNames.map(identifier)
                              )
                            : identifier(requestBodyArgumentNames[0])
                    )
                );
            }

            const operationMethod = classMethod(
                'method',
                identifier(operationName),
                argument.properties.length > 0 ? [argument] : [],
                blockStatement([
                    returnStatement(
                        operationReturn.wrapResultExpression(
                            callExpression(
                                memberExpression(
                                    callExpression(
                                        memberExpression(thisExpression(), identifier('getClientInstance')),
                                        []
                                    ),
                                    identifier('request')
                                ),
                                [requestObject]
                            )
                        )
                    )
                ])
            );
            operationMethod.returnType = tsTypeAnnotation(
                tsTypeReference(identifier('Promise'), tsTypeParameterInstantiation([operationReturn.type]))
            );
            extendDependencyImports(dependencyImports, operationReturn.dependencyImports);
            methods.push(attachJsDocComment(operationMethod, renderJsDoc(jsdoc, jsDocRenderConfig)));
        }
    }
    if (Object.keys(modelRegisterValidationSchemaImports).length > 0 && validationContext) {
        validationStatements.push(
            expressionStatement(
                callExpression(
                    memberExpression(
                        identifier(validationContext.validationSchemaStorageImportName),
                        identifier('registerOnce')
                    ),
                    [
                        arrayExpression(
                            Object.keys(modelRegisterValidationSchemaImports).map((registerCallbackName) =>
                                identifier(registerCallbackName)
                            )
                        )
                    ]
                )
            )
        );
    }

    methods.sort((a, b) => (a.key as Identifier).name.localeCompare((b.key as Identifier).name));

    return {methods, dependencyImports, validationStatements};
}
