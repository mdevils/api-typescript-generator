import {mkdir} from 'node:fs/promises';

export async function makeDir(path: string) {
    try {
        await mkdir(path, {recursive: true});
    } catch (e) {
        if (e instanceof Error && (e as NodeJS.ErrnoException).code !== 'EEXIST') {
            throw e;
        }
    }
}
