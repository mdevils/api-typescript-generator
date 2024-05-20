import path from 'path';
import {FilenameFormat, formatFilename} from './string-utils';

export function getRelativeImportPath(from: string, to: string): string {
    const result = path.relative(path.dirname(from), to);
    return result.match(/^[./]/) ? result : `./${result}`;
}

export function getFilenameAndImportPath(
    entityName: string,
    config: {
        filename?: string;
        filenameFormat?: FilenameFormat;
        relativeDirPath?: string;
    }
): {filename: string; importPath: string} {
    let partialResult: {filename: string; importPath: string};
    if (config.filename) {
        partialResult = {
            filename: config.filename,
            importPath: config.filename.replace(/\.[jt]sx?$/, config.filenameFormat?.extension ?? '')
        };
    } else {
        partialResult = {
            filename: formatFilename(entityName, {...config.filenameFormat, extension: '.ts'}),
            importPath: formatFilename(entityName, config.filenameFormat)
        };
    }
    return config.relativeDirPath
        ? {
              filename: path.join(config.relativeDirPath, partialResult.filename),
              importPath: path.join(config.relativeDirPath, partialResult.importPath)
          }
        : partialResult;
}

export function isRelativeImportPath(importPath: string): boolean {
    return importPath.startsWith('./') || importPath.startsWith('../');
}
