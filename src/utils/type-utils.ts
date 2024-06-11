import {
    isBooleanLiteral,
    isIdentifier,
    isNumericLiteral,
    isStringLiteral,
    isTSCallSignatureDeclaration,
    isTSConstructSignatureDeclaration,
    isTSIntersectionType,
    isTSLiteralType,
    isTSMethodSignature,
    isTSPropertySignature,
    isTSTypeLiteral,
    isTSUnionType,
    tsBooleanKeyword,
    TSIntersectionType,
    tsIntersectionType,
    tsPropertySignature,
    TSPropertySignature,
    TSType,
    tsTypeAnnotation,
    tsTypeLiteral,
    TSTypeLiteral,
    tsUnionType,
    TSUnionType
} from '@babel/types';
import * as R from 'ramda';
import {OpenApiSchema} from '../schemas/common';

function flattenUnions(union: TSUnionType): TSUnionType {
    const result: TSUnionType = tsUnionType([]);
    let hasChanges = false;
    for (const type of union.types) {
        if (isTSUnionType(type)) {
            result.types.push(...flattenUnions(type).types);
            hasChanges = true;
        } else {
            result.types.push(type);
        }
    }
    if (hasChanges) {
        result.leadingComments = union.leadingComments;
        return result;
    }
    return union;
}

function flattenIntersections(intersection: TSIntersectionType): TSIntersectionType {
    const result: TSIntersectionType = tsIntersectionType([]);
    let hasChanges = false;
    for (const type of intersection.types) {
        if (isTSIntersectionType(type)) {
            result.types.push(...flattenIntersections(type).types);
            hasChanges = true;
        } else {
            result.types.push(type);
        }
    }
    if (hasChanges) {
        result.leadingComments = intersection.leadingComments;
        return result;
    }
    return intersection;
}

function getTypeProperties(type: TSTypeLiteral): Record<string, TSPropertySignature> {
    const result: Record<string, TSPropertySignature> = {};
    for (const property of type.members) {
        if (isTSPropertySignature(property)) {
            const key = getPropertyKey(property);
            if (key !== undefined) {
                result[key] = property;
            }
        }
    }
    return result;
}

function getPropertyKey(member: TSPropertySignature): string | undefined {
    return isIdentifier(member.key)
        ? member.key.name
        : isStringLiteral(member.key)
          ? member.key.value
          : isNumericLiteral(member.key)
            ? String(member.key.value)
            : undefined;
}

export function simplifyUnionTypeIfPossible(union: TSUnionType): TSType {
    const result: TSUnionType = tsUnionType([]);
    const itemsToProcess = [...flattenUnions(union).types];

    let hasChanges = false;

    while (itemsToProcess.length > 0) {
        let current = itemsToProcess.shift()!;
        for (let i = 0; i < itemsToProcess.length; i++) {
            const compared = itemsToProcess[i];
            if (R.equals(current, compared)) {
                itemsToProcess.splice(i, 1);
                i--;
                hasChanges = true;
            } else if (
                isTSLiteralType(current) &&
                isTSLiteralType(compared) &&
                isBooleanLiteral(current.literal) &&
                isBooleanLiteral(compared.literal) &&
                current.literal.value !== compared.literal.value
            ) {
                current = tsBooleanKeyword();
                itemsToProcess.splice(i, 1);
                i--;
                hasChanges = true;
            } else {
                if (isTSTypeLiteral(current) && isTSTypeLiteral(compared)) {
                    if (current.members.length !== compared.members.length) {
                        continue;
                    }
                    const currentProperties = getTypeProperties(current);
                    if (Object.keys(currentProperties).length !== current.members.length) {
                        continue;
                    }
                    const comparedProperties = getTypeProperties(compared);
                    if (Object.keys(comparedProperties).length !== compared.members.length) {
                        continue;
                    }
                    if (!R.equals(Object.keys(currentProperties).sort(), Object.keys(comparedProperties).sort())) {
                        continue;
                    }
                    const keysWithDifferences = Object.keys(currentProperties).filter(
                        (key) =>
                            !R.equals(
                                currentProperties[key].typeAnnotation?.typeAnnotation,
                                comparedProperties[key].typeAnnotation?.typeAnnotation
                            )
                    );
                    if (keysWithDifferences.length === 1) {
                        const [keyWithDifference] = keysWithDifferences;
                        current = R.clone(current);
                        current.members = current.members.map((member) => {
                            if (isTSPropertySignature(member)) {
                                const key = getPropertyKey(member);
                                if (key === keyWithDifference) {
                                    const propertySignature = tsPropertySignature(
                                        member.key,
                                        tsTypeAnnotation(
                                            simplifyUnionTypeIfPossible(
                                                flattenUnions(
                                                    tsUnionType([
                                                        currentProperties[keyWithDifference].typeAnnotation!
                                                            .typeAnnotation,
                                                        comparedProperties[keyWithDifference].typeAnnotation!
                                                            .typeAnnotation
                                                    ])
                                                )
                                            )
                                        )
                                    );
                                    propertySignature.leadingComments = member.leadingComments;
                                    return propertySignature;
                                }
                            }
                            return member;
                        });
                        itemsToProcess.splice(i, 1);
                        i--;
                        hasChanges = true;
                    }
                }
            }
        }
        result.types.push(current);
    }
    if (result.types.length === 1) {
        const firstType = result.types[0];
        if (!firstType.leadingComments) {
            firstType.leadingComments = union.leadingComments;
        }
        return firstType;
    }
    if (hasChanges) {
        result.leadingComments = union.leadingComments;
        return result;
    }
    return union;
}

function simplePluralize(word: string): string {
    return word.endsWith('s') ? `${word}es` : `${word}s`;
}

export function getUserFreiendlySchemaName(schema: OpenApiSchema | undefined): string | undefined {
    if (schema === undefined || typeof schema === 'boolean') {
        return undefined;
    }
    if (schema.name) {
        return schema.name;
    }
    if (schema.items && schema.items !== true && schema.items.name) {
        return simplePluralize(schema.items.name);
    }
    return undefined;
}

export function mergeTypes(first: TSType, second: TSType): TSType {
    return simplifyIntersectionTypeIfPossible(tsIntersectionType([first, second]));
}

function mergeTypeLiteralsIfPossible(first: TSTypeLiteral, second: TSTypeLiteral): TSTypeLiteral | null {
    if (first.members.length === 0) {
        return second;
    }
    if (second.members.length === 0) {
        return first;
    }
    const result = tsTypeLiteral([]);
    const firstProperties = getTypeProperties(first);
    if (Object.keys(firstProperties).length !== first.members.length) {
        return null;
    }
    const secondProperties = getTypeProperties(second);
    if (Object.keys(secondProperties).length !== second.members.length) {
        return null;
    }
    for (const [key, prop] of Object.entries(firstProperties)) {
        if (Object.prototype.hasOwnProperty.call(secondProperties, key)) {
            const newProp = R.clone(prop);
            newProp.typeAnnotation = tsTypeAnnotation(
                mergeTypes(newProp.typeAnnotation!.typeAnnotation, secondProperties[key].typeAnnotation!.typeAnnotation)
            );
            newProp.leadingComments = newProp.leadingComments ?? secondProperties[key].leadingComments;
            result.members.push(newProp);
        } else {
            result.members.push(prop);
        }
    }
    result.leadingComments = first.leadingComments ?? second.leadingComments;
    return result;
}

export function simplifyIntersectionTypeIfPossible(intersection: TSIntersectionType): TSType {
    const result: TSIntersectionType = tsIntersectionType([]);
    const itemsToProcess = [...flattenIntersections(intersection).types];

    let hasChanges = false;

    while (itemsToProcess.length > 0) {
        let current = itemsToProcess.shift()!;
        for (let i = 0; i < itemsToProcess.length; i++) {
            const compared = itemsToProcess[i];
            if (R.equals(current, compared)) {
                itemsToProcess.splice(i, 1);
                i--;
                hasChanges = true;
            } else if (isTSTypeLiteral(current) && isTSTypeLiteral(compared)) {
                const merged = mergeTypeLiteralsIfPossible(current, compared);
                if (merged) {
                    current = merged;
                    itemsToProcess.splice(i, 1);
                    i--;
                    hasChanges = true;
                }
            }
        }
        result.types.push(current);
    }
    if (result.types.length === 1) {
        const firstType = result.types[0];
        if (!firstType.leadingComments) {
            firstType.leadingComments = intersection.leadingComments;
        }
        return firstType;
    }
    if (hasChanges) {
        result.leadingComments = intersection.leadingComments;
        return result;
    }
    return intersection;
}

export function isAssignableToEmptyObject(type: TSType): boolean {
    if (isTSTypeLiteral(type)) {
        for (const member of type.members) {
            if (isTSCallSignatureDeclaration(member) || isTSConstructSignatureDeclaration(member)) {
                return false;
            } else if ((isTSMethodSignature(member) || isTSPropertySignature(member)) && !member.optional) {
                return false;
            }
        }
        return true;
    } else if (isTSIntersectionType(type)) {
        return type.types.every(isAssignableToEmptyObject);
    } else if (isTSUnionType(type)) {
        return type.types.some(isAssignableToEmptyObject);
    }
    return false;
}
