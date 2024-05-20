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
    memberExpression,
    newExpression,
    objectExpression,
    objectProperty,
    program,
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
        errorClassName,
        generateJsDoc,
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
    commentsConfig
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
}): ClientGenerationResultFile {
    const clientPropertyName = 'client';
    const commonHttpClientImportName = 'commonHttpClient';
    const {importPath: clientImportPath, filename} = getFilenameAndImportPath(name, filenameConfig);
    const clientProperty = classProperty(identifier(clientPropertyName));
    clientProperty.typeAnnotation = tsTypeAnnotation(
        tsTypeReference(tsQualifiedName(identifier(commonHttpClientImportName), identifier(commonHttpClientClassName)))
    );

    const errorTypeName = errorClassName ?? `${name}Error`;
    const errorTypeExport = exportNamedDeclaration(
        classDeclaration(
            identifier(errorTypeName),
            memberExpression(identifier(commonHttpClientImportName), identifier(commonHttpClientErrorClassName)),
            classBody([classProperty(identifier('name'), stringLiteral(errorTypeName))])
        )
    );

    const clientClassBody = classBody([
        classProperty(
            identifier(clientPropertyName),
            newExpression(
                memberExpression(identifier(commonHttpClientImportName), identifier(commonHttpClientClassName)),
                [
                    objectExpression([
                        objectProperty(identifier('baseUrl'), stringLiteral(servers[0]?.url ?? defaultServerUrl)),
                        objectProperty(identifier('binaryResponseType'), stringLiteral(responseBinaryType)),
                        objectProperty(identifier('errorClass'), identifier(errorTypeName))
                    ])
                ]
            )
        ),
        classProperty(
            identifier('getClient'),
            arrowFunctionExpression([], memberExpression(thisExpression(), identifier(clientPropertyName)))
        )
    ]);
    const dependencyImports: DependencyImports = {};
    addDependencyImport(
        dependencyImports,
        getRelativeImportPath(clientImportPath, commonHttpServiceImportPath),
        commonHttpServiceClassName
    );

    if (includeServices !== 'none') {
        const servicesToInclude =
            includeServices === 'all'
                ? generatedServiceImports
                : generatedServiceImports.filter(({tag}) => includeServices.tags.includes(tag));

        for (const {name, importPath, tag, jsdoc} of servicesToInclude
            .concat()
            .sort((a, b) => a.name.localeCompare(b.name))) {
            addDependencyImport(dependencyImports, getRelativeImportPath(clientImportPath, importPath), name);
            clientClassBody.body.push(
                attachJsDocComment(
                    classProperty(
                        identifier(applyEntityNameCase(tag, 'camelCase')),
                        newExpression(identifier(name), [memberExpression(thisExpression(), identifier('getClient'))])
                    ),
                    renderJsDoc(jsdoc, jsDocRenderConfig)
                )
            );
        }
    }

    const optionsTypeName = `${name}Options`;
    const optionsTypeExport = exportNamedDeclaration(
        tsTypeAliasDeclaration(
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
        ),
        classProperty(
            identifier('createClientWithServices'),
            memberExpression(identifier(commonHttpClientImportName), identifier('createClientWithServices')),
            null,
            null,
            false,
            true
        )
    );

    if (generatedMethods.validationStatements.length > 0) {
        clientClassBody.body.push(
            classMethod(
                'method',
                identifier('initialize'),
                [],
                blockStatement(generatedMethods.validationStatements),
                false,
                true
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

    if (exportModels) {
        for (const {modelName, importPath} of modelImportInfos) {
            addDependencyImport(dependencyImports, getRelativeImportPath(clientImportPath, importPath), modelName);
            exportTypes.specifiers.push(exportSpecifier(identifier(modelName), identifier(modelName)));
        }
    }

    const exports: ExportNamedDeclaration = exportNamedDeclaration(null, []);

    if (exportServices) {
        for (const {name, importPath} of generatedServiceImports) {
            addDependencyImport(dependencyImports, getRelativeImportPath(clientImportPath, importPath), name);
            exports.specifiers.push(exportSpecifier(identifier(name), identifier(name)));
        }
    }

    const otherStatements: Statement[] = [];
    if (validationContext) {
        addDependencyImport(
            dependencyImports,
            getRelativeImportPath(clientImportPath, validationContext.validationSchemaStorageImportPath),
            validationContext.validationSchemaStorageImportName
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
                optionsTypeExport,
                errorTypeExport,
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
