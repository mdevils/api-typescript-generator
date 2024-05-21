import {
    arrowFunctionExpression,
    exportNamedDeclaration,
    identifier,
    newExpression,
    objectExpression,
    objectProperty,
    program,
    tsTypeParameterInstantiation,
    variableDeclaration,
    variableDeclarator
} from '@babel/types';
import {ValidationProvider} from './validation-providers/validation-provider';
import {
    addDependencyImport,
    DependencyImports,
    extendDependenciesAndGetResult,
    generateTsImports
} from '../../utils/dependencies';
import {getFilenameAndImportPath, getRelativeImportPath} from '../../utils/paths';
import {CommentsRenderConfig, renderTypeScript} from '../common';
import {ClientGenerationResultFile} from '../config';
import {OpenApiClientGeneratorConfig} from '../openapi-to-typescript-client';

export async function generateValidationSchemaStorage({
    commonValidationSchemaStorage,
    validationProvider,
    validationConfig: {validationSchemaStorage: {exportName = 'validationSchemaStorage', ...filenameFormatConfig} = {}},
    commentsConfig
}: {
    commonValidationSchemaStorage: {
        importPath: string;
        className: string;
    };
    validationConfig: Exclude<OpenApiClientGeneratorConfig['validation'], undefined>;
    validationProvider: ValidationProvider;
    commentsConfig: CommentsRenderConfig;
}): Promise<{
    importPath: string;
    importName: string;
    file: ClientGenerationResultFile;
}> {
    const dependencyImports: DependencyImports = {};

    const {filename, importPath} = getFilenameAndImportPath('validation-schema-storage', filenameFormatConfig);
    addDependencyImport(
        dependencyImports,
        getRelativeImportPath(importPath, commonValidationSchemaStorage.importPath),
        commonValidationSchemaStorage.className,
        {
            kind: 'value',
            entity: {name: commonValidationSchemaStorage.className}
        }
    );

    const generatedAssertCall = validationProvider.generateAssertCall(identifier('schema'), identifier('data'));
    const exportValidationSchemaStorage = exportNamedDeclaration(
        variableDeclaration('const', [
            variableDeclarator(
                identifier(exportName),
                Object.assign(
                    newExpression(identifier(commonValidationSchemaStorage.className), [
                        objectExpression([
                            objectProperty(
                                identifier('assertDataShape'),
                                arrowFunctionExpression(
                                    [identifier('schema'), identifier('data')],
                                    generatedAssertCall.result
                                )
                            ),
                            objectProperty(
                                identifier('makeExtensible'),
                                extendDependenciesAndGetResult(
                                    await validationProvider.generateMakeExtensibleCallback(),
                                    dependencyImports
                                )
                            ),
                            objectProperty(
                                identifier('formatErrorMessage'),
                                extendDependenciesAndGetResult(
                                    await validationProvider.generateFormatErrorMessageCallback(),
                                    dependencyImports
                                )
                            )
                        ])
                    ]),
                    {
                        typeParameters: tsTypeParameterInstantiation([
                            extendDependenciesAndGetResult(validationProvider.getSchemaType(), dependencyImports)
                        ])
                    }
                )
            )
        ])
    );

    return {
        importName: exportName,
        importPath: importPath,
        file: {
            filename,
            data: renderTypeScript(
                program([...generateTsImports(dependencyImports), exportValidationSchemaStorage]),
                commentsConfig
            )
        }
    };
}
