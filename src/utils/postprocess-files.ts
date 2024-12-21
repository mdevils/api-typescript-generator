import fs from 'node:fs/promises';
import path from 'node:path';
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
        // TypeScript parser expects files to be present, so we need to create directories for them.
        const directoriesToRemove: string[] = [];
        const directories: Set<string> = new Set();
        for (const file of files) {
            const directory = path.dirname(path.resolve(outputDirPath, file.filename));
            directories.add(directory);
        }

        for (const directory of Array.from(directories)) {
            try {
                await fs.stat(directory);
            } catch (_e) {
                const directoryBits = directory.split(path.sep);
                let currentDirectory = directoryBits.shift() || '/';
                for (;;) {
                    try {
                        await fs.stat(currentDirectory);
                    } catch (e) {
                        await fs.mkdir(currentDirectory);
                        directoriesToRemove.unshift(currentDirectory);
                    }
                    const subDirectory = directoryBits.shift();
                    if (!subDirectory) {
                        break;
                    }
                    currentDirectory = path.join(currentDirectory, subDirectory);
                }
            }
        }

        try {
            // This is an optional dependency, so we require it here to avoid loading it when it's not needed.
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const {ESLint} = require('eslint') as {ESLint: typeof ESLintClass};
            const eslint = new ESLint({
                fix: true
            });

            return await Promise.all(
                files.map(async (file) => {
                    const filePath = path.resolve(outputDirPath, file.filename);
                    let fileCreated = false;
                    try {
                        try {
                            await fs.stat(filePath);
                        } catch (_e) {
                            await fs.writeFile(filePath, file.data);
                            fileCreated = true;
                        }
                        const [result] = await eslint.lintText(file.data, {filePath});
                        for (const message of result.messages) {
                            if (message.fatal) {
                                throw new Error(`Fatal ESLint error in ${file.filename}: ${message.message}`);
                            }
                        }
                        return {
                            ...file,
                            data: result.output ?? file.data
                        };
                    } finally {
                        if (fileCreated) {
                            await fs.unlink(filePath);
                        }
                    }
                })
            );
        } finally {
            for (const directory of directoriesToRemove) {
                await fs.rmdir(directory);
            }
        }
    }
    return files;
}
