import {ZodError} from 'zod';

export const formatErrorMessage = function formatErrorMessage(error: Error) {
    if (error instanceof ZodError) {
        return error.errors
            .map(({message, path}) => `${message}${path.length > 0 ? ` at ${path.join('.')}` : ''}`)
            .join(', ');
    }
    return error.message;
};
