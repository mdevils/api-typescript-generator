import fs from 'fs';
import path from 'path';
import * as R from 'ramda';
import {ClientGenerationResultFile} from '../schema-to-typescript/config';

export async function compareGenerationResult({
    files,
    outputDirPath,
    cleanupDirectories
}: {
    files: ClientGenerationResultFile[];
    outputDirPath: string;
    cleanupDirectories: string[];
}): Promise<boolean> {
    let hasChanges = false;
    const filesIndex = R.indexBy(({filename}) => path.resolve(outputDirPath, filename), files);
    await Promise.all([
        ...cleanupDirectories.map(async (directoryRelativePath) => {
            const directoryPath = path.resolve(outputDirPath, directoryRelativePath);
            let filenames: string[];
            try {
                filenames = await fs.promises.readdir(directoryPath);
            } catch (e) {
                console.error(`[to-be-created] ${directoryPath}`);
                hasChanges = true;
                return;
            }
            for (const filename of filenames) {
                const fullFilename = path.resolve(directoryPath, filename);
                if (!Object.prototype.hasOwnProperty.call(filesIndex, fullFilename)) {
                    console.error(`[to-be-deleted] ${fullFilename}`);
                    hasChanges = true;
                }
            }
        }),
        ...files.map(async ({filename, data}) => {
            const fullFilename = path.resolve(outputDirPath, filename);
            let exists = false;
            try {
                const existingContent = await fs.promises.readFile(fullFilename, 'utf8');
                exists = true;
                if (existingContent === data) {
                    return;
                }
            } catch (e) {
                // ok
            }
            hasChanges = true;
            console.log(`[${exists ? 'to-be-updated' : 'to-be-created'}] ${fullFilename}`);
        })
    ]);
    return !hasChanges;
}
