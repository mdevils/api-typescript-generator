import {promises as fs} from 'fs';
import * as path from 'path';

const root = path.resolve(__dirname, '..');

async function cleanupDocs() {
    const readmePath = path.join(root, 'README.md');
    // Remove breadcrumbs from README
    await fs.writeFile(
        readmePath,
        (await fs.readFile(readmePath, 'utf8')).replace(/^api-typescript-generator \/ \[Modules].*\n\n/, '')
    );
}

cleanupDocs().catch(console.error);
