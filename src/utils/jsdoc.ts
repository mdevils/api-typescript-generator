import {addComment, Node} from '@babel/types';
import {wordWrap} from './string-utils';
import {AnnotatedApiEntity} from '../schema-to-typescript/common';
import {OpenApiClientGeneratorConfig} from '../schema-to-typescript/openapi-to-typescript-client';

function processDescription(info: string): string {
    return info
        .trim()
        .replace(/<a\s*href\s*=\s*['"]([^'"]+)['"]\s*>/g, '$1 ')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<\/a>/g, '');
}

function exampleToString(example: unknown) {
    if (typeof example !== 'string') {
        return JSON.stringify(example, null, 4);
    }
    try {
        return JSON.stringify(JSON.parse(example), null, 2);
    } catch (e) {
        return example;
    }
}

/**
 * JsDoc block to be rendered.
 */
export interface JsDocBlock {
    /**
     * The first line of the JsDoc block.
     */
    title?: string;
    /**
     * The description of the JsDoc block. Follows the title, separated by a blank line.
     */
    description?: string;
    /**
     * JsDoc tags.
     */
    tags: JsDocBlockTag[];
}

/**
 * JsDoc tag.
 */
export interface JsDocBlockTag {
    /**
     * Tag name.
     */
    name: string;
    /**
     * Tag value. Can be empty, a single line, or multiline. Example: `@example This is a single line example`
     */
    value?: string;
}

export function extractJsDoc(entity: AnnotatedApiEntity | boolean): JsDocBlock {
    const result: JsDocBlock = {tags: []};
    if (typeof entity === 'boolean') {
        return result;
    }
    if (entity.title) {
        result.title = processDescription(entity.title);
    }
    if (entity.description) {
        result.description = processDescription(entity.description);
    }
    if (entity.deprecated) {
        result.tags.push({name: 'deprecated'});
    }
    if (entity.example !== undefined) {
        result.tags.push({name: 'example', value: exampleToString(entity.example)});
    }
    if (entity.examples !== undefined) {
        for (const [exampleName, example] of Object.entries(entity.examples)) {
            const exampleInfo = exampleName ? [exampleName] : [];
            if (example.description) {
                exampleInfo.push(example.description);
            }
            result.tags.push({
                name: 'example',
                value: `${exampleInfo.length > 0 ? ` ${exampleInfo.join('. ')}` : ''} ${exampleToString(example.value)}`
            });
        }
    }
    return result;
}

export function renderJsDocList(items: string[]): string {
    return items.map((item) => ` * ${item.trim().replace(/\n/g, '\n   ')}`).join('\n\n');
}

export function renderJsDocAsPlainText(jsdoc: JsDocBlock): string | null {
    const bits: string[] = [];
    const title = jsdoc.title && jsdoc.title.trim();
    if (title) {
        bits.push(title);
    }
    const description = jsdoc.description && jsdoc.description.trim();
    if (description) {
        bits.push(description);
    }
    if (jsdoc.tags.length > 0) {
        bits.push(jsdoc.tags.map(({name, value}) => `${name}${value ? `: ${value.trim()}` : ''}`).join('\n'));
    }
    if (bits.length === 0) {
        return null;
    }
    return bits.join('\n\n');
}

const defaultWordWrapLineWidth = 80;

export type JsDocRenderConfig = OpenApiClientGeneratorConfig['jsDoc'];

export function renderJsDoc(jsdoc: JsDocBlock, config: JsDocRenderConfig = {}): string | null {
    function processText(text: string) {
        if (config?.wordWrap !== false) {
            return wordWrap(text, config?.wordWrap?.lineLength ?? defaultWordWrapLineWidth);
        }
        return text;
    }

    const jsdocParts: string[] = [];
    const title = jsdoc.title && jsdoc.title.trim();
    if (title) {
        jsdocParts.push(processText(title));
    }
    const description = jsdoc.description && jsdoc.description.trim();
    if (description) {
        jsdocParts.push(processText(description));
    }
    if (jsdoc.tags.length > 0) {
        jsdocParts.push(
            jsdoc.tags.map(({name, value}) => `@${name}${value ? ` ${processText(value.trim())}` : ''}`).join('\n')
        );
    }
    if (jsdocParts.length === 0) {
        return null;
    }
    return jsdocParts.join('\n\n');
}

export function attachJsDocComment<T extends Node>(node: T, jsdoc: string | null): T {
    if (jsdoc) {
        if (!jsdoc.match(/\n/)) {
            addComment(node, 'leading', `* ${jsdoc.replace(/\*\//g, '* /')} `, false);
            node.leadingComments![0].loc = {
                filename: '',
                identifierName: undefined,
                start: {line: 0, column: 0, index: 0},
                end: {line: 1, column: 1, index: 1}
            };
        } else {
            addComment(node, 'leading', `*\n * ${jsdoc.replace(/\*\//g, '* /').split('\n').join('\n * ')}\n `, false);
        }
    }
    return node;
}

export function extractJsDocString(entity: AnnotatedApiEntity | boolean, params: JsDocBlockTag[] = []): string | null {
    const jsdoc = extractJsDoc(entity);
    jsdoc.tags = jsdoc.tags.concat(params);
    return renderJsDoc(jsdoc);
}
