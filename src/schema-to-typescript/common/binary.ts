import {
    Identifier,
    identifier,
    tsQualifiedName,
    TSQualifiedName,
    TSType,
    tsTypeParameterInstantiation,
    TSTypeParameterInstantiation,
    tsTypeReference,
    tsUnionType
} from '@babel/types';
import {addDependencyImport, DependencyImports, extendDependenciesAndGetResult} from '../../utils/dependencies';
import {getRelativeImportPath, isRelativeImportPath} from '../../utils/paths';
import {ucFirst} from '../../utils/string-utils';
import {simplifyUnionTypeIfPossible} from '../../utils/type-utils';
import {OpenApiClientCustomizableBinaryType} from '../openapi-to-typescript-client';

function qualifiedTypeName(name: string | string[]): Identifier | TSQualifiedName {
    if (name.length === 0) {
        throw new Error('qualifiedTypeName: name is empty');
    }
    if (Array.isArray(name) && name.length > 1) {
        return tsQualifiedName(qualifiedTypeName(name.slice(0, -1)), identifier(name[name.length - 1]));
    } else {
        return identifier(Array.isArray(name) ? name[0] : name);
    }
}

export function generateBinaryType(
    config: OpenApiClientCustomizableBinaryType[],
    basePath: string
): {
    result: TSType;
    dependencyImports: DependencyImports;
} {
    const dependencyImports: DependencyImports = {};
    const result = tsUnionType([]);
    for (const binaryType of config) {
        if (typeof binaryType === 'string') {
            result.types.push(tsTypeReference(identifier(ucFirst(binaryType))));
        } else {
            const {name, source, typeParameters} = binaryType;
            let typeTemplateParameters: TSTypeParameterInstantiation | undefined;
            if (typeParameters) {
                typeTemplateParameters = tsTypeParameterInstantiation([]);
                for (const typeParameter of typeParameters) {
                    typeTemplateParameters.params.push(
                        extendDependenciesAndGetResult(generateBinaryType([typeParameter], basePath), dependencyImports)
                    );
                }
            }
            if (source) {
                const importedEntityName = Array.isArray(name) ? name[0] : name;
                addDependencyImport(
                    dependencyImports,
                    isRelativeImportPath(source.importPath)
                        ? getRelativeImportPath(basePath, source.importPath)
                        : source.importPath,
                    importedEntityName,
                    {
                        kind: 'type',
                        entity: source.import
                    }
                );
            }
            result.types.push(tsTypeReference(qualifiedTypeName(name), typeTemplateParameters));
        }
    }
    return {result: simplifyUnionTypeIfPossible(result), dependencyImports};
}
