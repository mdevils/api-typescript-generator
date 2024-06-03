import fs from 'fs';
import yaml from 'js-yaml';
import {CommonApiToTypescriptGeneratorSource} from '../schema-to-typescript/config';

export async function fetchSource(source: CommonApiToTypescriptGeneratorSource): Promise<unknown> {
    if (source.type === 'url') {
        const response = await fetch(source.url);
        if (!response.ok) {
            throw new Error(`Error downloading "${source.url}": ${response.statusText}`);
        }
        return yaml.load(await response.text());
    } else if (source.type === 'file') {
        try {
            return yaml.load(await fs.promises.readFile(source.path, 'utf8'));
        } catch (e) {
            throw new Error(`Error reading file "${source.path}": ${e instanceof Error ? e.message : e}`);
        }
    } else if (source.type === 'object') {
        return source.object;
    } else if (source.type === 'string') {
        return yaml.load(source.data);
    } else {
        throw new Error(`Unknown source type: ${(source as {type: string}).type}`);
    }
}
