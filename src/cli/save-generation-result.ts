import fs from 'fs';
import path from 'path';
import * as R from 'ramda';
import {ClientGenerationResultFile} from '../schema-to-typescript/config';
import {lock} from '../utils/lock';

export async function saveGenerationResult({
    files,
    outputDirPath,
    cleanupDirectories
}: {
    files: ClientGenerationResultFile[];
    outputDirPath: string;
    cleanupDirectories: string[];
}) {
    const filesIndex = R.indexBy(({filename}) => path.resolve(outputDirPath, filename), files);
    await Promise.all([
        ...cleanupDirectories.map(async (directoryRelativePath) => {
            const directoryPath = path.resolve(outputDirPath, directoryRelativePath);
            for (const filename of await fs.promises.readdir(directoryPath)) {
                const fullFilename = path.resolve(directoryPath, filename);
                if (!Object.prototype.hasOwnProperty.call(filesIndex, fullFilename)) {
                    console.log('[deleted] ' + fullFilename);
                    await fs.promises.rm(fullFilename, {recursive: true});
                }
            }
        }),
        ...files.map(async ({filename, data}) => {
            const fullFilename = path.resolve(outputDirPath, filename);
            try {
                await lock(`file:${fullFilename}`, async () => {
                    let exists = false;
                    try {
                        const existingContent = await fs.promises.readFile(fullFilename, 'utf8');
                        exists = true;
                        if (existingContent === data) {
                            console.log('[no change] ' + fullFilename);
                            return;
                        }
                    } catch (e) {
                        // ok
                    }
                    await fs.promises.writeFile(fullFilename, data);
                    console.log(`[${exists ? 'updated' : 'created'}] ${fullFilename}`);
                });
            } catch (e) {
                throw new Error(`Could not save file "${fullFilename}": ${e instanceof Error ? e.message : e}.`);
            }
        })
    ]);
}
