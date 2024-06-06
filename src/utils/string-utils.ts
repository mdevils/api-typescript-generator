export function ucFirst(input: string) {
    return input[0].toUpperCase() + input.slice(1);
}

export function lcFirst(input: string) {
    return input[0].toLowerCase() + input.slice(1);
}

export type EntityNameCase = 'kebabCase' | 'camelCase' | 'snakeCase' | 'pascalCase';

export interface FilenameFormat {
    filenameCase?: EntityNameCase;
    prefix?: string;
    postfix?: string;
    extension?: string;
}

export function applyEntityNameCase(input: string, entityNameCase: EntityNameCase) {
    let before = input;
    for (;;) {
        input = input
            .replace(/([a-z0-9])([A-Z][a-z]|[A-Z]{2,})/g, '$1 $2')
            .replace(/([a-z][0-9]+)([a-z])/g, '$1 $2')
            .replace(/([A-Z]{2,}[0-9]*)([A-Z][a-z])/g, '$1 $2');
        if (input === before) {
            break;
        }
        before = input;
    }

    const bits = input
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(/[^a-zA-Z0-9]+/)
        .map((bit) => bit.toLowerCase())
        .filter((bit) => Boolean(bit));

    if (bits.length === 0) {
        return '';
    }

    if (entityNameCase === 'pascalCase') {
        return bits.map(ucFirst).join('');
    }
    if (entityNameCase === 'camelCase') {
        return bits.shift() + bits.map(ucFirst).join('');
    }
    if (entityNameCase === 'kebabCase') {
        return bits.join('-');
    }
    if (entityNameCase === 'snakeCase') {
        return bits.join('_');
    }
    throw new Error(`Unknown entity name case: ${entityNameCase}`);
}

export function formatFilename(
    input: string,
    {filenameCase = 'kebabCase', extension = '', postfix = '', prefix = ''}: FilenameFormat | undefined = {}
) {
    return `${prefix}${applyEntityNameCase(input, filenameCase)}${postfix}${extension}`;
}

export function rTrim(input: string): string {
    return input.replace(/\s+$/, '');
}

function wordWrapLine(line: string, width: number): string {
    if (line.length <= width) {
        return line;
    }
    const resultBits: string[] = [];
    while (line.length > width) {
        const indentWidth = line.match(/^\s*/)![0].length;
        const lineFragment = line.substring(0, width);
        line = line.substring(width);
        const lastWordIndex = lineFragment.match(/[^\s]*$/)?.index ?? 0;
        if (lastWordIndex <= indentWidth) {
            const offset = line.match(/^[^\s]*/)![0].length;
            resultBits.push(lineFragment + line.substring(0, offset));
            line = line.substring(offset).trim();
        } else {
            resultBits.push(rTrim(lineFragment.substring(0, lastWordIndex)));
            line = lineFragment.substring(lastWordIndex) + line;
        }
    }
    if (line.trim().length > 0) {
        resultBits.push(line);
    }
    return resultBits.join('\n');
}

export function wordWrap(input: string, lineWidth: number) {
    return input
        .split(/\r?\n/)
        .map(rTrim)
        .map((l) => wordWrapLine(l, lineWidth))
        .join('\n');
}
