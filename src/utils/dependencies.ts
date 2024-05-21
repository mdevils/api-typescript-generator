import {
    identifier,
    importDeclaration,
    ImportDeclaration,
    importDefaultSpecifier,
    importSpecifier,
    isImportSpecifier,
    stringLiteral,
    tsNullKeyword
} from '@babel/types';
import R from 'ramda';
import {getRelativeImportPath} from './paths';
import {generateSchemaType, GenerateSchemaTypeParams, isNamedSchema} from '../schema-to-typescript/common';
import {OpenApiClientExternalValueSourceImportEntity} from '../schema-to-typescript/openapi-to-typescript-client';
import {OpenApiSchema} from '../schemas/common';

interface DependencyImportsEntity {
    kind: 'value' | 'type';
    entity: OpenApiClientExternalValueSourceImportEntity;
}

export interface DependencyImports {
    [importPath: string]: {
        [aliasName: string]: DependencyImportsEntity;
    };
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
                modelName,
                {
                    kind: 'type',
                    entity: {name: modelName}
                }
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
    const entries = Object.entries(dependencyImports).sort(([a], [b]) => a.localeCompare(b));
    const result: ImportDeclaration[] = [];
    for (const [path, imports] of entries) {
        const allTypes = Object.values(imports).every(({kind}) => kind === 'type');
        const importSpecifiers = Object.entries(imports).map(([alias, {kind, entity}]) => {
            const specifier =
                entity === 'default'
                    ? importDefaultSpecifier(identifier(alias))
                    : importSpecifier(identifier(entity.name), identifier(entity.name));
            if (isImportSpecifier(specifier) && !allTypes && kind === 'type') {
                specifier.importKind = 'type';
            }
            return specifier;
        });
        const declaration = importDeclaration(importSpecifiers, stringLiteral(path));
        if (allTypes) {
            declaration.importKind = 'type';
        }
        result.push(declaration);
    }
    return result;
}

export function addDependencyImport(
    dependencyImports: DependencyImports,
    importPath: string,
    aliasName: string,
    entity: DependencyImportsEntity
) {
    dependencyImports[importPath] || (dependencyImports[importPath] = {});
    dependencyImports[importPath][aliasName] = entity;
}

export function extendDependencyImports(dependencyImports: DependencyImports, extension: DependencyImports) {
    for (const [importPath, entities] of Object.entries(extension)) {
        dependencyImports[importPath] || (dependencyImports[importPath] = {});
        for (const [aliasName, entity] of Object.entries(entities)) {
            dependencyImports[importPath][aliasName] = entity;
        }
    }
}
