import path from 'path';
import {
    blockStatement,
    classBody,
    classDeclaration,
    classMethod,
    exportNamedDeclaration,
    identifier,
    importDeclaration,
    ImportDeclaration,
    importNamespaceSpecifier,
    importSpecifier,
    program,
    stringLiteral
} from '@babel/types';
import {GetModelData} from './models';
import {generateOperationMethods} from './operation-methods';
import {openApiHttpMethods, OpenApiPaths, OpenApiTag} from '../../schemas/openapi';
import {makeProtected} from '../../utils/ast';
import {generateTsImports} from '../../utils/dependencies';
import {attachJsDocComment, JsDocBlock, JsDocRenderConfig, renderJsDoc} from '../../utils/jsdoc';
import {getRelativeImportPath} from '../../utils/paths';
import {applyEntityNameCase, FilenameFormat, formatFilename} from '../../utils/string-utils';
import {CommentsRenderConfig, renderTypeScript} from '../common';
import {ClientGenerationResultFile} from '../config';
import {
    GenerateOperationName,
    OpenApiClientGeneratorConfig,
    OpenApiClientValidationContext,
    GenerateOperationJsDoc,
    OpenApiClientCustomizableBinaryType
} from '../openapi-to-typescript-client';

const defaultServiceFilenameFormat: FilenameFormat = {
    postfix: '-service',
    filenameCase: 'kebabCase'
};

export interface GeneratedServicesImportInfo {
    name: string;
    importPath: string;
    tag: string;
    jsdoc: JsDocBlock;
}

export interface GeneratedServices {
    files: ClientGenerationResultFile[];
    services: GeneratedServicesImportInfo[];
    deprecatedOperations: {[methodAndPath: string]: string};
}

export const defaultServicesRelativeDirPath = 'services';

export function generateServices({
    taggedPaths,
    tags,
    commonHttpClientImportPath,
    commonHttpServiceImportPath,
    commonHttpServiceClassName,
    servicesConfig: {
        filenameFormat,
        relativeDirPath = defaultServicesRelativeDirPath,
        generateName,
        generateJsDoc
    } = {},
    operationsConfig,
    getModelData,
    validationContext,
    binaryTypes,
    jsDocRenderConfig,
    commentsConfig
}: {
    taggedPaths: Record<string, OpenApiPaths>;
    tags: Record<string, OpenApiTag>;
    servicesConfig: Exclude<OpenApiClientGeneratorConfig['services'], boolean>;
    commonHttpClientImportPath: string;
    commonHttpServiceClassName: string;
    commonHttpServiceImportPath: string;
    operationsConfig?: OpenApiClientGeneratorConfig['operations'];
    generateOperationName?: GenerateOperationName;
    generateOperationJsDoc?: GenerateOperationJsDoc;
    getModelData: GetModelData;
    validationContext?: OpenApiClientValidationContext;
    binaryTypes: OpenApiClientCustomizableBinaryType[];
    jsDocRenderConfig: JsDocRenderConfig;
    commentsConfig: CommentsRenderConfig;
}): GeneratedServices {
    const commonHttpClientImportName = 'commonHttpClient';
    const files: ClientGenerationResultFile[] = [];
    const services: GeneratedServicesImportInfo[] = [];
    const deprecatedOperations: {[methodAndPath: string]: string} = {};
    for (const [tag, paths] of Object.entries(taggedPaths)) {
        const importPath = path.join(
            relativeDirPath,
            formatFilename(tag, {...defaultServiceFilenameFormat, ...filenameFormat})
        );
        const suggestedName = applyEntityNameCase(tag + '-service', 'pascalCase');
        const serviceName = generateName
            ? generateName({
                  suggestedName,
                  tag: tags[tag] ?? {name: tag},
                  paths
              })
            : suggestedName;

        let jsdoc: JsDocBlock = {
            description: tags[tag]?.description,
            tags: []
        };
        if (
            Object.values(paths).every((path) =>
                openApiHttpMethods.every((method) => !path[method] || path[method]?.deprecated)
            )
        ) {
            jsdoc.tags.push({name: 'deprecated'});
        }
        if (generateJsDoc) {
            jsdoc = generateJsDoc({
                suggestedJsDoc: jsdoc,
                serviceName,
                tag: tags[tag] ?? {name: tag},
                paths
            });
        }

        services.push({
            name: serviceName,
            tag,
            importPath,
            jsdoc
        });

        const serviceMethods = generateOperationMethods({
            paths,
            serviceName,
            operationsConfig,
            getModelData,
            validationContext,
            commonHttpClientImportName,
            operationImportPath: importPath,
            binaryTypes,
            jsDocRenderConfig
        });
        const serviceClassBody = classBody([...serviceMethods.methods]);

        Object.assign(
            deprecatedOperations,
            Object.fromEntries(
                Object.entries(serviceMethods.deprecatedOperations).map(([methodAndPath, operationName]) => [
                    methodAndPath,
                    `${applyEntityNameCase(tag, 'camelCase')}.${operationName}`
                ])
            )
        );

        if (serviceMethods.validationStatements.length > 0) {
            serviceClassBody.body.push(
                makeProtected(
                    classMethod(
                        'method',
                        identifier('initialize'),
                        [],
                        blockStatement(serviceMethods.validationStatements),
                        false,
                        true
                    )
                )
            );
        }

        const classObj = classDeclaration(
            identifier(serviceName),
            identifier(commonHttpServiceClassName),
            serviceClassBody
        );
        const imports: ImportDeclaration[] = [
            importDeclaration(
                [importNamespaceSpecifier(identifier(commonHttpClientImportName))],
                stringLiteral(getRelativeImportPath(importPath, commonHttpClientImportPath))
            ),
            importDeclaration(
                [importSpecifier(identifier(commonHttpServiceClassName), identifier(commonHttpServiceClassName))],
                stringLiteral(getRelativeImportPath(importPath, commonHttpServiceImportPath))
            ),
            ...generateTsImports(serviceMethods.dependencyImports)
        ];
        files.push({
            filename: path.join(
                relativeDirPath,
                formatFilename(tag, {...defaultServiceFilenameFormat, ...filenameFormat, extension: '.ts'})
            ),
            data: renderTypeScript(
                program([
                    ...imports,
                    attachJsDocComment(exportNamedDeclaration(classObj), renderJsDoc(jsdoc, jsDocRenderConfig))
                ]),
                commentsConfig
            )
        });
    }
    return {files, services, deprecatedOperations};
}
