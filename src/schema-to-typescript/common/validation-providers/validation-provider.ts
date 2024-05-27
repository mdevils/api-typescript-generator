import {Expression, TSType} from '@babel/types';
import {OpenApiSchema} from '../../../schemas/common';
import {DependencyImports} from '../../../utils/dependencies';

export interface ValidationProviderContext {
    getNamedSchemaReference(name: string): Expression;
}

export interface ResultWithDependencyImports<T> {
    result: T;
    dependencyImports: DependencyImports;
}

export abstract class ValidationProvider {
    abstract getSchemaType(): ResultWithDependencyImports<TSType>;
    abstract generateSchema(
        schema: OpenApiSchema,
        context: ValidationProviderContext
    ): ResultWithDependencyImports<Expression>;
    abstract generateLazyGetter(expression: Expression): ResultWithDependencyImports<Expression>;
    abstract generateAssertCall(
        validationSchema: Expression,
        data: Expression
    ): ResultWithDependencyImports<Expression>;
    abstract generateSetModelNameCall(
        validationSchema: Expression,
        modelName: string
    ): ResultWithDependencyImports<Expression>;
    abstract generateOperationResponseSchema(responses: {
        [statusCode: string]: {[mediaType: string]: Expression | null};
    }): ResultWithDependencyImports<Expression>;
    abstract generateMakeExtensibleCallback(): Promise<ResultWithDependencyImports<Expression>>;
    abstract generateFormatErrorMessageCallback(): Promise<ResultWithDependencyImports<Expression>>;
}
