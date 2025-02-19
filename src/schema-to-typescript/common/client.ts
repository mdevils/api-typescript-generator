import {
    arrowFunctionExpression,
    blockStatement,
    callExpression,
    classBody,
    classDeclaration,
    classMethod,
    classProperty,
    ExportNamedDeclaration,
    exportNamedDeclaration,
    exportSpecifier,
    expressionStatement,
    identifier,
    importDeclaration,
    importNamespaceSpecifier,
    logicalExpression,
    memberExpression,
    newExpression,
    objectExpression,
    objectProperty,
    program,
    returnStatement,
    spreadElement,
    Statement,
    stringLiteral,
    thisExpression,
    tsQualifiedName,
    tsTypeAliasDeclaration,
    tsTypeAnnotation,
    tsTypeParameterInstantiation,
    tsTypeReference
} from '@babel/types';
import {GetModelData, ModelImportInfo} from './models';
import {generateOperationMethods} from './operation-methods';
import {GeneratedServicesImportInfo} from './services';
import {OpenApiInfo, OpenApiServer} from '../../schemas/common';
import {OpenApiPaths} from '../../schemas/openapi';
import {makeProtected} from '../../utils/ast';
import {
    addDependencyImport,
    DependencyImports,
    extendDependencyImports,
    generateTsImports
} from '../../utils/dependencies';
import {attachJsDocComment, JsDocBlock, JsDocRenderConfig, renderJsDoc} from '../../utils/jsdoc';
import {getFilenameAndImportPath, getRelativeImportPath} from '../../utils/paths';
import {applyEntityNameCase} from '../../utils/string-utils';
import {attachTypeAnnotation, CommentsRenderConfig, renderTypeScript} from '../common';
import {ClientGenerationResultFile} from '../config';
import {
    OpenApiClientBuiltinBinaryType,
    OpenApiClientCustomizableBinaryType,
    OpenApiClientGeneratorConfig,
    OpenApiClientValidationContext
} from '../openapi-to-typescript-client';

const defaultServerUrl = 'http://example.com';

/**
 * Calculate model names to export based on the exportModels configuration.
 */
function calculateModelNamesToExport(
    exportModels: Exclude<OpenApiClientGeneratorConfig['client'], false>['exportModels'] = 'none',
    modelImportInfos: ModelImportInfo[]
): Set<string> {
    if (exportModels === 'none') {
        return new Set();
    }
    if (exportModels === 'all') {
        return new Set(modelImportInfos.map(({modelName}) => modelName));
    }
    if ('models' in exportModels) {
        return new Set(exportModels.models);
    }
    if ('schemas' in exportModels) {
        const schemaNamesSet = new Set(exportModels.schemas);
        return new Set(
            modelImportInfos.filter(({schemaName}) => schemaNamesSet.has(schemaName)).map(({modelName}) => modelName)
        );
    }
    throw new Error('Invalid exportModels configuration.');
}

export function generateClient({
    commonHttpClientClassName,
    commonHttpClientClassOptionsName,
    commonHttpClientErrorClassName,
    commonHttpClientImportPath,
    commonHttpServiceClassName,
    commonHttpServiceImportPath,
    clientConfig: {
        includeServices = 'all',
        name,
        exportModels,
        exportServices,
        exportErrorClass,
        exportOptionsType,
        errorClassName,
        generateJsDoc,
        generateErrorJsDoc,
        baseUrl,
        ...filenameConfig
    },
    generatedServiceImports,
    servers,
    info,
    paths,
    operationsConfig,
    getModelData,
    modelImportInfos,
    validationContext,
    responseBinaryType,
    binaryTypes,
    jsDocRenderConfig,
    commentsConfig,
    deprecatedOperations
}: {
    commonHttpClientClassName: string;
    commonHttpClientClassOptionsName: string;
    commonHttpClientErrorClassName: string;
    commonHttpClientImportPath: string;
    commonHttpServiceClassName: string;
    commonHttpServiceImportPath: string;
    clientConfig: Exclude<OpenApiClientGeneratorConfig['client'], false>;
    generatedServiceImports: GeneratedServicesImportInfo[];
    servers: OpenApiServer[];
    info: OpenApiInfo;
    paths: OpenApiPaths;
    operationsConfig: OpenApiClientGeneratorConfig['operations'];
    getModelData: GetModelData;
    modelImportInfos: ModelImportInfo[];
    validationContext?: OpenApiClientValidationContext;
    responseBinaryType: OpenApiClientBuiltinBinaryType;
    binaryTypes: OpenApiClientCustomizableBinaryType[];
    jsDocRenderConfig: JsDocRenderConfig;
    commentsConfig: CommentsRenderConfig;
    deprecatedOperations: {[methodAndPath: string]: string};
}): ClientGenerationResultFile {
    const clientPropertyName = 'client';
    const commonHttpClientImportName = 'commonHttpClient';
    const {importPath: clientImportPath, filename} = getFilenameAndImportPath(name, filenameConfig);
    const errorTypeName = errorClassName ?? `${name}Error`;
    const additionalTypeStatements: Statement[] = [];
    const errorClassDeclaration = classDeclaration(
        identifier(errorTypeName),
        memberExpression(identifier(commonHttpClientImportName), identifier(commonHttpClientErrorClassName)),
        classBody([classProperty(identifier('name'), stringLiteral(errorTypeName))])
    );
    const errorClassSuggestedJsDoc: JsDocBlock = {title: `Error class for ${info.summary}`, tags: []};
    additionalTypeStatements.push(
        attachJsDocComment(
            exportErrorClass !== false ? exportNamedDeclaration(errorClassDeclaration) : errorClassDeclaration,
            renderJsDoc(
                generateErrorJsDoc
                    ? generateErrorJsDoc({suggestedJsDoc: errorClassSuggestedJsDoc, info})
                    : errorClassSuggestedJsDoc,
                jsDocRenderConfig
            )
        )
    );

    const generatedMethods = generateOperationMethods({
        paths,
        commonHttpClientImportName,
        operationImportPath: clientImportPath,
        operationsConfig,
        getModelData,
        validationContext,
        binaryTypes,
        jsDocRenderConfig
    });

    const clientConstructorOptionsObject = objectExpression([
        objectProperty(
            identifier('apiClientClassName'),
            logicalExpression(
                '??',
                memberExpression(memberExpression(thisExpression(), identifier('constructor')), identifier('name')),
                stringLiteral('name')
            )
        ),
        objectProperty(identifier('baseUrl'), stringLiteral(baseUrl ?? servers[0]?.url ?? defaultServerUrl)),
        objectProperty(identifier('binaryResponseType'), stringLiteral(responseBinaryType)),
        objectProperty(identifier('errorClass'), identifier(errorTypeName))
    ]);

    const deprecatedOperationsTotal = {
        ...deprecatedOperations,
        ...generatedMethods.deprecatedOperations
    };

    if (operationsConfig?.showDeprecatedWarnings && Object.keys(deprecatedOperationsTotal).length > 0) {
        clientConstructorOptionsObject.properties.push(
            objectProperty(
                identifier('deprecatedOperations'),
                objectExpression(
                    Object.entries(deprecatedOperationsTotal).map(([methodAndPath, operationName]) =>
                        objectProperty(stringLiteral(methodAndPath), stringLiteral(operationName))
                    )
                )
            )
        );
    }

    const clientClassBody = classBody([
        makeProtected(
            classProperty(
                identifier(clientPropertyName),
                newExpression(
                    memberExpression(identifier(commonHttpClientImportName), identifier(commonHttpClientClassName)),
                    [clientConstructorOptionsObject]
                )
            )
        ),
        makeProtected(
            classProperty(
                identifier('getClient'),
                arrowFunctionExpression([], memberExpression(thisExpression(), identifier(clientPropertyName)))
            )
        )
    ]);
    const dependencyImports: DependencyImports = {};
    addDependencyImport(
        dependencyImports,
        getRelativeImportPath(clientImportPath, commonHttpServiceImportPath),
        commonHttpServiceClassName,
        {kind: 'value', entity: {name: commonHttpServiceClassName}}
    );

    if (includeServices !== 'none') {
        const servicesToInclude =
            includeServices === 'all'
                ? generatedServiceImports
                : generatedServiceImports.filter(({tag}) => includeServices.tags.includes(tag));

        for (const {name, importPath, tag, jsdoc} of servicesToInclude
            .concat()
            .sort((a, b) => a.name.localeCompare(b.name))) {
            addDependencyImport(dependencyImports, getRelativeImportPath(clientImportPath, importPath), name, {
                kind: 'value',
                entity: {name}
            });
            clientClassBody.body.push(
                attachJsDocComment(
                    classMethod(
                        'get',
                        identifier(applyEntityNameCase(tag, 'camelCase')),
                        [],
                        blockStatement([
                            returnStatement(
                                callExpression(memberExpression(thisExpression(), identifier('getServiceInstance')), [
                                    identifier(name)
                                ])
                            )
                        ])
                    ),
                    renderJsDoc(jsdoc, jsDocRenderConfig)
                )
            );
        }
    }

    const optionsTypeName = `${name}Options`;
    const optionsTypeDeclaration = tsTypeAliasDeclaration(
        identifier(optionsTypeName),
        null,
        tsTypeReference(
            identifier('Partial'),
            tsTypeParameterInstantiation([
                tsTypeReference(
                    tsQualifiedName(
                        identifier(commonHttpClientImportName),
                        identifier(commonHttpClientClassOptionsName)
                    )
                )
            ])
        )
    );
    const optionsTypeStatement =
        exportOptionsType === false ? optionsTypeDeclaration : exportNamedDeclaration(optionsTypeDeclaration);

    clientClassBody.body.push(...generatedMethods.methods);
    extendDependencyImports(dependencyImports, generatedMethods.dependencyImports);
    clientClassBody.body.push(
        classMethod(
            'constructor',
            identifier('constructor'),
            [
                attachTypeAnnotation(
                    Object.assign(identifier('options'), {optional: true}),
                    tsTypeAnnotation(tsTypeReference(identifier(optionsTypeName)))
                )
            ],
            blockStatement([
                expressionStatement(
                    callExpression(identifier('super'), [
                        arrowFunctionExpression([], memberExpression(thisExpression(), identifier(clientPropertyName)))
                    ])
                ),
                expressionStatement(
                    callExpression(
                        memberExpression(
                            memberExpression(thisExpression(), identifier(clientPropertyName)),
                            identifier('setOptions')
                        ),
                        [
                            objectExpression([
                                spreadElement(
                                    callExpression(
                                        memberExpression(
                                            memberExpression(thisExpression(), identifier(clientPropertyName)),
                                            identifier('getOptions')
                                        ),
                                        []
                                    )
                                ),
                                spreadElement(identifier('options'))
                            ])
                        ]
                    )
                )
            ])
        )
    );

    if (generatedMethods.validationStatements.length > 0) {
        clientClassBody.body.push(
            makeProtected(
                classMethod(
                    'method',
                    identifier('initialize'),
                    [],
                    blockStatement(generatedMethods.validationStatements),
                    false,
                    true
                )
            )
        );
    }

    const jsdoc: JsDocBlock = {
        title: info.summary ?? info.title,
        description: info.description,
        tags: [{name: 'version', value: info.version}]
    };

    const clientClass = attachJsDocComment(
        exportNamedDeclaration(
            classDeclaration(identifier(name), identifier(commonHttpServiceClassName), clientClassBody)
        ),
        renderJsDoc(generateJsDoc ? generateJsDoc({suggestedJsDoc: jsdoc, info}) : jsdoc, jsDocRenderConfig)
    );

    const exportTypes: ExportNamedDeclaration = exportNamedDeclaration(null, []);
    exportTypes.exportKind = 'type';

    const modelNamesToExport = calculateModelNamesToExport(exportModels, modelImportInfos);
    for (const {modelName, importPath} of modelImportInfos) {
        if (!modelNamesToExport.has(modelName)) {
            continue;
        }
        addDependencyImport(dependencyImports, getRelativeImportPath(clientImportPath, importPath), modelName, {
            kind: 'type',
            entity: {name: modelName}
        });
        exportTypes.specifiers.push(exportSpecifier(identifier(modelName), identifier(modelName)));
    }

    const exports: ExportNamedDeclaration = exportNamedDeclaration(null, []);

    if (exportServices && exportServices !== 'none') {
        const servicesToExport = new Set(
            exportServices === 'all' ? generatedServiceImports.map(({name}) => name) : exportServices.services
        );
        for (const {name, importPath} of generatedServiceImports) {
            if (!servicesToExport.has(name)) {
                continue;
            }
            addDependencyImport(dependencyImports, getRelativeImportPath(clientImportPath, importPath), name, {
                kind: 'value',
                entity: {name}
            });
            exports.specifiers.push(exportSpecifier(identifier(name), identifier(name)));
        }
    }

    const otherStatements: Statement[] = [];
    if (validationContext) {
        addDependencyImport(
            dependencyImports,
            getRelativeImportPath(clientImportPath, validationContext.validationSchemaStorageImportPath),
            validationContext.validationSchemaStorageImportName,
            {kind: 'value', entity: {name: validationContext.validationSchemaStorageImportName}}
        );
        otherStatements.push(
            expressionStatement(
                callExpression(
                    memberExpression(
                        identifier(validationContext.validationSchemaStorageImportName),
                        identifier('setErrorClass')
                    ),
                    [identifier(errorTypeName)]
                )
            )
        );
    }

    return {
        data: renderTypeScript(
            program([
                importDeclaration(
                    [importNamespaceSpecifier(identifier(commonHttpClientImportName))],
                    stringLiteral(getRelativeImportPath(clientImportPath, commonHttpClientImportPath))
                ),
                ...generateTsImports(dependencyImports),
                optionsTypeStatement,
                ...additionalTypeStatements,
                clientClass,
                ...otherStatements,
                ...(exportTypes.specifiers.length > 0 ? [exportTypes] : []),
                ...(exports.specifiers.length > 0 ? [exports] : [])
            ]),
            commentsConfig
        ),
        filename
    };
}
