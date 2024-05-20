import {
    booleanLiteral,
    identifier,
    stringLiteral,
    tsLiteralType,
    tsPropertySignature,
    TSPropertySignature,
    tsTypeAnnotation,
    tsTypeLiteral,
    tsTypeReference
} from '@babel/types';
import {generateSchemaType, objectPropertyKey, unionTypeIfNecessary} from '../schema-to-typescript/common';
import {OpenApiParameter} from '../schemas/common';
import {attachJsDocComment, extractJsDocString} from '../utils/jsdoc';
import {lcFirst, ucFirst} from '../utils/string-utils';

function hasRequiredParameters(propertySignatures: TSPropertySignature[]): boolean {
    for (const propertySignature of propertySignatures) {
        if (!propertySignature.optional) {
            return true;
        }
    }
    return false;
}

// @see https://swagger.io/docs/specification/serialization/
const serializationDefaults: Record<
    OpenApiParameter['in'],
    {
        explode: Exclude<OpenApiParameter['explode'], undefined>;
        style: Exclude<OpenApiParameter['style'], undefined>;
    }
> = {
    path: {
        explode: false,
        style: 'simple'
    },
    query: {
        explode: true,
        style: 'form'
    },
    header: {
        explode: false,
        style: 'simple'
    },
    cookie: {
        explode: true,
        style: 'form'
    }
};

export function formatSchemaName(schemaName: string, {prefix, postfix}: {prefix?: string; postfix?: string}) {
    return `${prefix ?? ''}${ucFirst(schemaName)}${postfix ?? ''}`;
}

export function getParameterTypes({parameters, prefix}: {parameters?: OpenApiParameter[]; prefix: string}) {
    const nodes: TSPropertySignature[] = [];
    const parameterGroups: Record<string, {properties: TSPropertySignature[]; serialization: TSPropertySignature[]}> =
        {};
    if (parameters) {
        for (const parameter of parameters) {
            parameterGroups[parameter.in] = parameterGroups[parameter.in] || {properties: [], serialization: []};
            parameterGroups[parameter.in].properties.push(
                attachJsDocComment(
                    tsOptionalIf(
                        !parameter.required,
                        tsPropertySignature(
                            objectPropertyKey(parameter.name),
                            tsTypeAnnotation(
                                generateSchemaType({
                                    schema: parameter.schema ?? true,
                                    getTypeName: (name) => formatSchemaName(name, {prefix}),
                                    getBinaryType: () => tsTypeReference(identifier('Blob'))
                                })
                            )
                        )
                    ),
                    extractJsDocString(parameter)
                )
            );

            const defaultValues = serializationDefaults[parameter.in];
            const {explode = defaultValues.explode, style = defaultValues.style} = parameter;

            if (explode !== defaultValues.explode || style !== defaultValues.style) {
                parameterGroups[parameter.in].serialization.push(
                    tsPropertySignature(
                        objectPropertyKey(parameter.name),
                        tsTypeAnnotation(
                            tsTypeLiteral([
                                tsPropertySignature(
                                    identifier('explode'),
                                    tsTypeAnnotation(tsLiteralType(booleanLiteral(explode)))
                                ),
                                tsPropertySignature(
                                    identifier('style'),
                                    tsTypeAnnotation(tsLiteralType(stringLiteral(style)))
                                )
                            ])
                        )
                    )
                );
            }
        }
    }

    const parameterGroupEntries = Object.entries(parameterGroups);
    if (parameterGroupEntries.length > 0) {
        nodes.push(
            tsOptionalIf(
                !hasRequiredParameters(Object.values(parameterGroups).flatMap(({properties}) => properties)),
                tsPropertySignature(
                    identifier('parameters'),
                    tsTypeAnnotation(
                        tsTypeLiteral(
                            parameterGroupEntries.map(([type, {properties}]) =>
                                tsOptionalIf(
                                    !hasRequiredParameters(properties),
                                    tsPropertySignature(
                                        objectPropertyKey(type),
                                        tsTypeAnnotation(
                                            unionTypeIfNecessary([
                                                ...(properties.length > 0 ? [tsTypeLiteral(properties)] : [])
                                            ])
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );

        if (Object.values(parameterGroups).flatMap(({serialization}) => serialization).length > 0) {
            nodes.push(
                tsPropertySignature(
                    identifier('serialization'),
                    tsTypeAnnotation(
                        tsTypeLiteral(
                            parameterGroupEntries
                                .filter(([, {serialization}]) => serialization.length > 0)
                                .map(([type, {serialization}]) =>
                                    tsPropertySignature(
                                        objectPropertyKey(type),
                                        tsTypeAnnotation(tsTypeLiteral(serialization))
                                    )
                                )
                        )
                    )
                )
            );
        }
    }
    return nodes;
}

export function tsOptionalIf(condition: boolean | undefined, prop: TSPropertySignature): TSPropertySignature {
    if (condition) {
        prop.optional = true;
    }
    return prop;
}

export function getOperationDocsUrl({
    documentUrl,
    operation,
    pathname,
    methodName
}: {
    documentUrl: string;
    operation: {operationId?: string; tags?: string[]};
    pathname: string;
    methodName?: string;
}) {
    if (operation.operationId) {
        return `${documentUrl}#operation/${operation.operationId}`;
    }
    if (operation.tags && operation.tags.length > 0) {
        const [firstTag] = operation.tags;
        return `${documentUrl}#tag/${firstTag.replace(/ /g, '-')}/paths/${pathname.replace(/\//g, '~1')}${
            methodName ? `/${methodName}` : ''
        }`;
    }
    return documentUrl;
}

export function pathToIdentifier(path: string) {
    return toIdentifier(path);
}

export function toIdentifier(text: string) {
    return lcFirst(
        text.replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, (_, input) => input[0].toUpperCase()).replace(/[^a-zA-Z0-9]+/g, '')
    );
}

export function sentenceToPascalCase(input: string) {
    return input
        .split(/[^a-zA-Z0-9]+/)
        .map((bit) => bit.toLowerCase())
        .filter((bit) => Boolean(bit))
        .map(ucFirst)
        .join('');
}
