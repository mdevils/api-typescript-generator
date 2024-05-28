import path from 'path';
import type {ESLint as ESLintClass} from 'eslint';
import {
    ClientGenerationResultFile,
    CommonOpenApiClientGeneratorConfigPostprocess
} from '../schema-to-typescript/config';

export async function postprocessFiles({
    files,
    config: {eslint: enableEslint} = {},
    outputDirPath
}: {
    files: ClientGenerationResultFile[];
    config?: CommonOpenApiClientGeneratorConfigPostprocess;
    outputDirPath: string;
}): Promise<ClientGenerationResultFile[]> {
    if (enableEslint) {
        // This is an optional dependency, so we require it here to avoid loading it when it's not needed.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {ESLint} = require('eslint') as {ESLint: typeof ESLintClass};
        const eslint = new ESLint({
            fix: true
        });

        return Promise.all(
            files.map(async (file) => {
                const [result] = await eslint.lintText(file.data, {
                    filePath: path.resolve(outputDirPath, file.filename)
                });
                return {
                    ...file,
                    data: result.output ?? file.data
                };
            })
        );
    }
    return files;
}
