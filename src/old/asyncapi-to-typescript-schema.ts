import {
    objectExpression,
    identifier,
    exportNamedDeclaration,
    variableDeclaration,
    variableDeclarator,
    program,
    Statement,
    ObjectProperty,
    ClassProperty,
    classProperty,
    stringLiteral,
    tsTypeAnnotation,
    tsTypeLiteral,
    objectProperty,
    classExpression,
    classBody,
    isTSTypeLiteral,
    tsInterfaceDeclaration,
    tsInterfaceBody,
    tsTypeAliasDeclaration,
    tsAsExpression,
    tsTypeReference
} from '@babel/types';
import {AsyncApiDocument, asyncApiOperationTypes} from './asyncapi';
import {formatSchemaName, getParameterTypes, pathToIdentifier, sentenceToPascalCase} from './common';
import {generateSchemaType, renderTypeScript, unionTypeIfNecessary} from '../schema-to-typescript/common';
import {OpenApiParameter, OpenApiSchema} from '../schemas/common';
import {attachJsDocComment, extractJsDocString} from '../utils/jsdoc';
import {lcFirst} from '../utils/string-utils';

function bindingSchemaToParameters(
    schema: OpenApiSchema | undefined,
    parameterIn: OpenApiParameter['in']
): OpenApiParameter[] {
    if (!schema || typeof schema === 'boolean') {
        return [];
    }

    // According to spec it must be an object
    // @see https://github.com/asyncapi/bindings/tree/master/websockets
    if (schema.type !== 'object' || !schema.properties) {
        return [];
    }

    return Object.entries(schema.properties).map(([name, itemSchema]) => {
        const parameter: OpenApiParameter = {
            in: parameterIn,
            name,
            required: schema.required ? schema.required?.includes(name) : false,
            schema: itemSchema
        };

        return parameter;
    });
}

export function asyncapiToTypescriptSchema({
    document,
    apiName,
    documentUrl
}: {
    document: AsyncApiDocument;
    apiName: string;
    documentUrl: string;
}) {
    const schemaPrefix = `${sentenceToPascalCase(apiName)}Api`;
    const rootConstName = `${lcFirst(schemaPrefix)}Schema`;
    const channelNodes: ObjectProperty[] = [];
    const schemas: Statement[] = [];
    for (const [channelPath, channel] of Object.entries(document.channels)) {
        const channelInterfaceName = pathToIdentifier(channelPath);
        const channelProperties: ClassProperty[] = [];
        channelProperties.push(classProperty(identifier('path'), stringLiteral(channelPath), null, null, false, true));
        channelProperties.push(
            classProperty(
                identifier('request'),
                null,
                tsTypeAnnotation(
                    tsTypeLiteral(
                        getParameterTypes({
                            // merge parameters and channel bindings ws
                            parameters: Object.entries(channel.parameters ?? [])
                                .map(
                                    ([name, {schema, ...otherProps}]): OpenApiParameter => ({
                                        ...otherProps,
                                        name,
                                        in: 'path',
                                        schema
                                    })
                                )
                                // Merging ws binging schemas with parameters for simplicity of use
                                // @see https://github.com/asyncapi/bindings/tree/master/websockets
                                .concat(bindingSchemaToParameters(channel.bindings?.ws?.query, 'query'))
                                .concat(bindingSchemaToParameters(channel.bindings?.ws?.headers, 'header')),
                            prefix: schemaPrefix
                        })
                    )
                ),
                null,
                false,
                true
            )
        );

        for (const operationType of asyncApiOperationTypes) {
            const operation = channel[operationType];
            if (!operation) {
                continue;
            }
            const tsSchemas = operation.messages.map((message) =>
                generateSchemaType({
                    schema: message.payload ?? true,
                    getTypeName: (name) => formatSchemaName(name, {prefix: schemaPrefix}),
                    getBinaryType: () => tsTypeReference(identifier('Blob'))
                })
            );
            channelProperties.push(
                attachJsDocComment(
                    classProperty(
                        identifier(operationType),
                        null,
                        tsTypeAnnotation(unionTypeIfNecessary(tsSchemas)),
                        null,
                        false,
                        true
                    ),
                    extractJsDocString(
                        Object.assign(
                            {
                                description: operation.messages
                                    .filter((message) => Boolean(message.description))
                                    .map(({description}) => description!)
                                    .join('\n')
                            },
                            operation
                        ),
                        [{name: 'url', value: `${documentUrl}#operation/${operation.operationId}`}]
                    )
                )
            );
        }
        channelNodes.push(
            attachJsDocComment(
                objectProperty(
                    identifier(channelInterfaceName),
                    classExpression(null, null, classBody(channelProperties))
                ),
                extractJsDocString(channel)
            )
        );
    }
    if (document.components && document.components.schemas) {
        for (const [schemaName, schema] of Object.entries(document.components.schemas)) {
            const schemaType = generateSchemaType({
                schema,
                expand: true,
                getTypeName: (name) => formatSchemaName(name, {prefix: schemaPrefix}),
                getBinaryType: () => tsTypeReference(identifier('Blob'))
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
    const rootNamespace = attachJsDocComment(
        exportNamedDeclaration(
            variableDeclaration('const', [
                variableDeclarator(
                    identifier(rootConstName),
                    tsAsExpression(objectExpression(channelNodes), tsTypeReference(identifier('const')))
                )
            ])
        ),
        extractJsDocString(document.info, [{name: 'see', value: documentUrl}])
    );
    return renderTypeScript(program([rootNamespace, ...schemas], [], 'module'), {});
}
