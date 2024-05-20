import {
    ZodArray,
    ZodIntersection,
    ZodLazy,
    ZodNever,
    ZodNullable,
    ZodObject,
    ZodOptional,
    ZodTypeAny,
    ZodUnion
} from 'zod';

export const makeExtensible = function makeExtensible(zodSchema: ZodTypeAny): ZodTypeAny {
    if (zodSchema instanceof ZodObject) {
        let zodObject = zodSchema;
        const currentShape: Record<string, ZodTypeAny> = zodObject.shape;
        const newShape = Object.fromEntries(
            Object.entries(currentShape).map(([key, value]) => [key, makeExtensible(value)])
        );
        if (Object.entries(newShape).some(([key, value]) => value !== currentShape[key])) {
            zodObject = zodObject.extend(newShape);
        }

        const newCatchall = makeExtensible(zodSchema._def.catchall);
        if (newCatchall !== zodSchema._def.catchall) {
            zodObject = zodObject.catchall(newCatchall);
        }

        if (!(zodObject._def.catchall instanceof ZodNever)) {
            return zodObject;
        }
        if (zodObject._def.unknownKeys === 'passthrough') {
            return zodObject;
        }
        return zodObject.passthrough();
    } else if (zodSchema instanceof ZodOptional) {
        const nestedType = makeExtensible(zodSchema.unwrap());
        if (nestedType !== zodSchema.unwrap()) {
            return new ZodOptional({
                ...zodSchema._def,
                innerType: nestedType
            });
        }
    } else if (zodSchema instanceof ZodNullable) {
        const nestedType = makeExtensible(zodSchema.unwrap());
        if (nestedType !== zodSchema.unwrap()) {
            return new ZodNullable({
                ...zodSchema._def,
                innerType: nestedType
            });
        }
    } else if (zodSchema instanceof ZodArray) {
        const nestedType = makeExtensible(zodSchema.element);
        if (nestedType !== zodSchema.element) {
            return new ZodArray({
                ...zodSchema._def,
                type: nestedType
            });
        }
    } else if (zodSchema instanceof ZodIntersection) {
        const left = makeExtensible(zodSchema._def.left);
        const right = makeExtensible(zodSchema._def.right);
        if (left !== zodSchema._def.left || right !== zodSchema._def.right) {
            return new ZodIntersection({
                ...zodSchema._def,
                left,
                right
            });
        }
    } else if (zodSchema instanceof ZodUnion) {
        const newOptions = (zodSchema._def.options as ZodTypeAny[]).map((type) => makeExtensible(type));
        if (newOptions.some((type, i) => type !== zodSchema._def.options[i])) {
            return new ZodUnion({
                ...zodSchema._def,
                options: newOptions as [ZodTypeAny, ...ZodTypeAny[]]
            });
        }
    } else if (zodSchema instanceof ZodLazy) {
        return new ZodLazy({
            ...zodSchema._def,
            getter: () => makeExtensible(zodSchema._def.getter())
        });
    }
    return zodSchema;
};
