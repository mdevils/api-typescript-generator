import {
    identifier,
    importDeclaration,
    ImportDeclaration,
    importDefaultSpecifier,
    importSpecifier,
    stringLiteral,
    tsNullKeyword
} from '@babel/types';
import R from 'ramda';
import {getRelativeImportPath} from './paths';
import {generateSchemaType, GenerateSchemaTypeParams, isNamedSchema} from '../schema-to-typescript/common';
import {OpenApiSchema} from '../schemas/common';

export interface DependencyImports {
    [importPath: string]: {[dependencyName: string]: string};
}

export function collectSchemaDependencies(schema: OpenApiSchema): Record<string, OpenApiSchema> {
    if (isNamedSchema(schema)) {
        return {[schema.name]: R.omit(['name'], schema)};
    }

    const result: Record<string, OpenApiSchema> = {};
    generateSchemaType({
        schema,
        expand: true,
        getTypeName: (schemaName, subSchema) => {
            result[schemaName] = R.omit(['name'], subSchema);
            return schemaName;
        },
        getBinaryType: () => tsNullKeyword()
    });
    return result;
}

export function generateSchemaTypeAndImports(
    params: Omit<GenerateSchemaTypeParams, 'getTypeName'> & {
        sourceImportPath: string;
        getModelData(schemaName: string): {modelName: string; importPath: string};
    }
) {
    const dependencyImports: DependencyImports = {};
    const result = generateSchemaType({
        ...params,
        getTypeName: (schemaName) => {
            const {modelName, importPath} = params.getModelData(schemaName);
            addDependencyImport(
                dependencyImports,
                getRelativeImportPath(params.sourceImportPath, importPath),
                modelName
            );
            return modelName;
        }
    });
    return {result, dependencyImports};
}

export function extendDependenciesAndGetResult<T>(
    output: {result: T; dependencyImports: DependencyImports},
    dependencyImports: DependencyImports
): T {
    extendDependencyImports(dependencyImports, output.dependencyImports);
    return output.result;
}

export function generateTsImports(dependencyImports: DependencyImports): ImportDeclaration[] {
    return Object.entries(dependencyImports)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([depPath, importsIndex]) =>
            importDeclaration(
                Object.entries(importsIndex).map(([name, alias]) => {
                    if (name === 'default') {
                        return importDefaultSpecifier(identifier(alias));
                    } else {
                        return importSpecifier(identifier(name), identifier(alias));
                    }
                }),
                stringLiteral(depPath)
            )
        );
}

export function addDependencyImport(
    dependencyImports: DependencyImports,
    importPath: string,
    entityName: string,
    alias?: string
) {
    dependencyImports[importPath] || (dependencyImports[importPath] = {});
    dependencyImports[importPath][entityName] = alias ?? entityName;
}

export function extendDependencyImports(dependencyImports: DependencyImports, extension: DependencyImports) {
    for (const [importPath, entities] of Object.entries(extension)) {
        dependencyImports[importPath] || (dependencyImports[importPath] = {});
        for (const [entityName, alias] of Object.entries(entities)) {
            dependencyImports[importPath][entityName] = alias;
        }
    }
}
