import {
    ZodArray,
    ZodError,
    ZodIntersection,
    ZodLazy,
    ZodNullable,
    ZodObject,
    ZodOptional,
    ZodTuple,
    ZodTypeAny,
    ZodUnion
} from 'zod';

export const formatErrorMessage = function formatErrorMessage(error: Error, schema: ZodTypeAny) {
    interface ModelNameWithFieldPath {
        modelName: string;
        path: (string | number)[];
    }

    function findModelNameByPath(schema: ZodTypeAny, path: (string | number)[]): ModelNameWithFieldPath | undefined {
        let result: ModelNameWithFieldPath | undefined = undefined;
        if (schema instanceof ZodLazy) {
            return findModelNameByPath(schema.schema, path) ?? result;
        }
        if (schema.description !== undefined) {
            result = {modelName: schema.description, path};
        }
        if (path.length === 0) {
            return result;
        }
        if (schema instanceof ZodObject) {
            const [pathBit, ...restPath] = path;
            const field = schema.shape[pathBit];
            if (field !== undefined) {
                result = findModelNameByPath(field, restPath) ?? result;
            }
            const catchall = schema._def.catchall;
            if (catchall !== undefined) {
                result = findModelNameByPath(catchall, restPath) ?? result;
            }
        } else if (schema instanceof ZodArray) {
            const [, ...restPath] = path;
            result = findModelNameByPath(schema.element, restPath) ?? result;
        } else if (schema instanceof ZodTuple) {
            const [pathBit, ...restPath] = path;
            const element = schema.items[pathBit];
            if (element !== undefined) {
                result = findModelNameByPath(element, restPath) ?? result;
            }
        } else if (schema instanceof ZodOptional) {
            result = findModelNameByPath(schema.unwrap(), path) ?? result;
        } else if (schema instanceof ZodNullable) {
            result = findModelNameByPath(schema.unwrap(), path) ?? result;
        } else if (schema instanceof ZodIntersection) {
            result =
                findModelNameByPath(schema._def.left, path) ?? findModelNameByPath(schema._def.right, path) ?? result;
        } else if (schema instanceof ZodUnion) {
            result = schema.options.reduce(
                (acc: ModelNameWithFieldPath | undefined, option: ZodTypeAny) =>
                    findModelNameByPath(option, path) ?? acc,
                result
            );
        }

        return result;
    }

    function pathToString(path: (string | number)[]): string {
        return path.map((p, index) => (typeof p === 'number' ? `[${p}]` : `${index > 0 ? '.' : ''}${p}`)).join('');
    }

    if (error instanceof ZodError) {
        return error.errors
            .map(({message, path}) => {
                const info = findModelNameByPath(schema, path);
                const modelInfo = info ? ` at '${pathToString([info.modelName, ...info.path])}'` : '';
                return `${message}${path.length > 0 ? `${modelInfo}, full path: '${pathToString(path)}'.` : ''}`;
            })
            .join(' ');
    }
    return error.message;
};
