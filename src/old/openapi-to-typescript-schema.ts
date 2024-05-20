import {
    classBody,
    classExpression,
    classProperty,
    exportNamedDeclaration,
    identifier,
    isTSTypeLiteral,
    numericLiteral,
    objectExpression,
    objectProperty,
    ObjectProperty,
    program,
    Statement,
    stringLiteral,
    tsAsExpression,
    tsInterfaceBody,
    tsInterfaceDeclaration,
    tsNeverKeyword,
    tsNumberKeyword,
    tsPropertySignature,
    TSPropertySignature,
    TSType,
    tsTypeAliasDeclaration,
    tsTypeAnnotation,
    tsTypeLiteral,
    tsTypeReference,
    tsUndefinedKeyword,
    variableDeclaration,
    variableDeclarator
} from '@babel/types';
import {
    formatSchemaName,
    getOperationDocsUrl,
    getParameterTypes,
    pathToIdentifier,
    sentenceToPascalCase,
    tsOptionalIf
} from './common';
import {
    generateSchemaType,
    primitiveValueToType,
    renderTypeScript,
    unionTypeIfNecessary
} from '../schema-to-typescript/common';
import {OpenApiParameter} from '../schemas/common';
import {OpenApiDocument, openApiHttpMethods, OpenApiResponse} from '../schemas/openapi';
import {attachJsDocComment, extractJsDocString} from '../utils/jsdoc';
import {lcFirst} from '../utils/string-utils';

function canParseAsInt(input: string): boolean {
    return Boolean(input.match(/^\d+$/));
}

function createHttpResponse({
    status,
    contentType,
    body,
    statusJsDoc,
    contentJsDoc,
    bodyJsDoc
}: {
    status: string;
    contentType?: string;
    body?: TSType;
    statusJsDoc: string | null;
    contentJsDoc?: string | null;
    bodyJsDoc?: string | null;
}) {
    const nodes: TSPropertySignature[] = [];
    nodes.push(
        attachJsDocComment(
            tsPropertySignature(
                identifier('status'),
                tsTypeAnnotation(canParseAsInt(status) ? primitiveValueToType(parseInt(status)) : tsNumberKeyword())
            ),
            statusJsDoc
        )
    );
    nodes.push(tsPropertySignature(identifier('ok'), tsTypeAnnotation(primitiveValueToType(isStatusPositive(status)))));
    nodes.push(
        attachJsDocComment(
            tsPropertySignature(
                identifier('contentType'),
                tsTypeAnnotation(contentType ? primitiveValueToType(contentType) : tsUndefinedKeyword())
            ),
            contentJsDoc ?? null
        )
    );
    nodes.push(
        attachJsDocComment(
            tsPropertySignature(identifier('body'), tsTypeAnnotation(body ?? tsUndefinedKeyword())),
            bodyJsDoc ?? null
        )
    );
    return tsTypeLiteral(nodes);
}

function getResponseSchema(responses: Record<string, OpenApiResponse>, schemaPrefix: string) {
    return tsTypeLiteral(
        Object.entries(responses).map(([status, response]) =>
            tsPropertySignature(
                canParseAsInt(status) ? numericLiteral(parseInt(status)) : stringLiteral(status),
                tsTypeAnnotation(
                    response.content
                        ? unionTypeIfNecessary(
                              Object.entries(response.content).map(([contentType, content]) =>
                                  createHttpResponse({
                                      status,
                                      contentType,
                                      body: generateSchemaType({
                                          schema: content.schema ?? false,
                                          getTypeName: (name) => formatSchemaName(name, {prefix: schemaPrefix}),
                                          getBinaryType: () => tsTypeReference(identifier('Blob'))
                                      }),
                                      contentJsDoc: extractJsDocString(content),
                                      statusJsDoc: extractJsDocString(response),
                                      bodyJsDoc: extractJsDocString(content.schema ?? false)
                                  })
                              )
                          )
                        : createHttpResponse({status, statusJsDoc: extractJsDocString(response)})
                )
            )
        )
    );
}

function isStatusPositive(status: string) {
    return parseInt(status) < 300;
}

export function openapiToTypescriptSchema({
    document,
    apiName,
    documentUrl
}: {
    document: OpenApiDocument;
    apiName: string;
    documentUrl: string;
}) {
    const schemaPrefix = `${sentenceToPascalCase(apiName)}Api`;
    const rootConstName = `${lcFirst(schemaPrefix)}Schema`;
    const pathNodes: ObjectProperty[] = [];
    const schemas: Statement[] = [];
    for (const [pathname, path] of Object.entries(document.paths ?? {})) {
        const pathConstName = pathToIdentifier(pathname);
        const operationNodes: ObjectProperty[] = [];
        for (const methodName of openApiHttpMethods) {
            const operation = path[methodName];
            if (!operation) {
                continue;
            }

            const contentTypes = Array.from(
                new Set(
                    Object.entries(operation.responses ?? {}).flatMap(([status, response]): string[] => {
                        if (!isStatusPositive(status)) {
                            return [];
                        }
                        if (!response.content) {
                            return [];
                        }

                        return Object.keys(response.content);
                    })
                ).values()
            ).filter(Boolean);

            const acceptParameters: OpenApiParameter[] = contentTypes.length
                ? [
                      {
                          required: false,
                          name: 'accept',
                          in: 'header',
                          schema: {
                              type: 'string',
                              enum: contentTypes
                          }
                      }
                  ]
                : [];

            const requestNodes: TSPropertySignature[] = getParameterTypes({
                parameters: [...(operation.parameters ?? []), ...acceptParameters],
                prefix: schemaPrefix
            });

            const requestBodyContent = Object.entries(operation.requestBody?.content ?? {}).map(
                ([contentType, content]) =>
                    tsTypeLiteral([
                        attachJsDocComment(
                            tsPropertySignature(
                                identifier('contentType'),
                                tsTypeAnnotation(primitiveValueToType(contentType))
                            ),
                            extractJsDocString(content)
                        ),
                        attachJsDocComment(
                            tsPropertySignature(
                                identifier('body'),
                                tsTypeAnnotation(
                                    generateSchemaType({
                                        schema: content.schema ?? false,
                                        getTypeName: (name) => formatSchemaName(name, {prefix: schemaPrefix}),
                                        getBinaryType: () => tsTypeReference(identifier('Blob'))
                                    })
                                )
                            ),
                            extractJsDocString(content.schema ?? false)
                        )
                    ])
            );
            if (requestBodyContent.length > 0) {
                requestNodes.push(
                    attachJsDocComment(
                        tsOptionalIf(
                            requestBodyContent.length === 0,
                            tsPropertySignature(
                                identifier('input'),
                                tsTypeAnnotation(
                                    requestBodyContent.length > 0
                                        ? unionTypeIfNecessary(requestBodyContent)
                                        : tsNeverKeyword()
                                )
                            )
                        ),
                        extractJsDocString(operation.requestBody ?? {})
                    )
                );
            }
            const requestType = requestNodes.length > 0 ? tsTypeLiteral(requestNodes) : tsUndefinedKeyword();

            const successfulResponses: Record<string, OpenApiResponse> = {};
            const failedResponses: Record<string, OpenApiResponse> = {};
            for (const [status, response] of Object.entries(operation.responses ?? {})) {
                if (isStatusPositive(status)) {
                    successfulResponses[status] = response;
                } else {
                    failedResponses[status] = response;
                }
            }

            operationNodes.push(
                attachJsDocComment(
                    objectProperty(
                        identifier(methodName),
                        classExpression(
                            null,
                            null,
                            classBody([
                                classProperty(identifier('path'), stringLiteral(pathname), null, null, false, true),
                                classProperty(identifier('method'), stringLiteral(methodName), null, null, false, true),
                                classProperty(
                                    identifier('request'),
                                    null,
                                    tsTypeAnnotation(requestType),
                                    null,
                                    false,
                                    true
                                ),
                                classProperty(
                                    identifier('successfulResponse'),
                                    null,
                                    tsTypeAnnotation(getResponseSchema(successfulResponses, schemaPrefix)),
                                    null,
                                    false,
                                    true
                                ),
                                classProperty(
                                    identifier('failedResponse'),
                                    null,
                                    tsTypeAnnotation(getResponseSchema(failedResponses, schemaPrefix)),
                                    null,
                                    false,
                                    true
                                )
                            ])
                        )
                    ),
                    extractJsDocString(operation, [
                        {name: 'url', value: getOperationDocsUrl({documentUrl, operation, pathname, methodName})}
                    ])
                )
            );
        }

        pathNodes.push(
            attachJsDocComment(
                objectProperty(identifier(pathConstName), objectExpression(operationNodes)),
                extractJsDocString(path)
            )
        );
    }
    if (document.components && document.components.schemas) {
        for (const [schemaName, schema] of Object.entries(document.components.schemas)) {
            const schemaType = generateSchemaType({
                schema,
                getTypeName: (name) => formatSchemaName(name, {prefix: schemaPrefix}),
                getBinaryType: () => tsTypeReference(identifier('Blob')),
                expand: true
            });
            schemas.push(
                attachJsDocComment(
                    exportNamedDeclaration(
                        isTSTypeLiteral(schemaType)
                            ? tsInterfaceDeclaration(
                                  identifier(formatSchemaName(schemaName, {prefix: schemaPrefix})),
                                  null,
                                  null,
                                  tsInterfaceBody(schemaType.members)
                              )
                            : tsTypeAliasDeclaration(
                                  identifier(formatSchemaName(schemaName, {prefix: schemaPrefix})),
                                  null,
                                  schemaType
                              )
                    ),
                    extractJsDocString(schema)
                )
            );
        }
    }
    const rootConst = attachJsDocComment(
        exportNamedDeclaration(
            variableDeclaration('const', [
                variableDeclarator(
                    identifier(rootConstName),
                    tsAsExpression(
                        objectExpression([
                            attachJsDocComment(
                                objectProperty(identifier('paths'), objectExpression(pathNodes)),
                                'REST API paths'
                            )
                        ]),
                        tsTypeReference(identifier('const'))
                    )
                )
            ])
        ),
        extractJsDocString(document.info, [{name: 'see', value: documentUrl}])
    );
    return renderTypeScript(program([rootConst, ...schemas], [], 'module'), {});
}
