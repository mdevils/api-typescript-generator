import fs from 'fs';
import path from 'path';
import {parse} from '@babel/parser';
import {FilenameFormat, formatFilename} from '../../utils/string-utils';
import {CommentsRenderConfig, renderTypeScript} from '../common';
import {ClientGenerationResultFile} from '../config';
import {OpenApiClientGeneratorConfig} from '../openapi-to-typescript-client';

function processCoreFile(
    code: string,
    filenameFormat: FilenameFormat | undefined,
    commentsConfig: CommentsRenderConfig
): string {
    return renderTypeScript(
        parse(
            code.replace(
                /import(.*?)from '.\/([^']+)';/,
                (_, [imports, path]) =>
                    `import${imports}from ${JSON.stringify(`./${formatFilename(path, filenameFormat)}`)};`
            ),
            {
                sourceType: 'module',
                plugins: ['typescript']
            }
        ).program,
        commentsConfig
    );
}

export const defaultCoreRelativeDirPath = 'core';

export async function generateCommonHttpClient(
    {filenameFormat, relativeDirPath = defaultCoreRelativeDirPath}: OpenApiClientGeneratorConfig['core'] = {},
    commentsConfig: CommentsRenderConfig
): Promise<{
    importPath: string;
    className: string;
    classOptionsName: string;
    errorClassName: string;
    file: ClientGenerationResultFile;
}> {
    return {
        className: 'CommonHttpClient',
        classOptionsName: 'CommonHttpClientOptions',
        errorClassName: 'CommonHttpClientError',
        importPath: path.join(relativeDirPath, formatFilename('common-http-client', filenameFormat)),
        file: {
            filename: path.join(
                relativeDirPath,
                formatFilename('common-http-client', {...filenameFormat, extension: '.ts'})
            ),
            data: processCoreFile(
                await fs.promises.readFile(path.join(__dirname, 'core', 'common-http-client.ts'), 'utf8'),
                filenameFormat,
                commentsConfig
            )
        }
    };
}

export async function generateCommonHttpService(
    {filenameFormat, relativeDirPath = defaultCoreRelativeDirPath}: OpenApiClientGeneratorConfig['core'] = {},
    commentsConfig: CommentsRenderConfig
): Promise<{
    importPath: string;
    className: string;
    file: ClientGenerationResultFile;
}> {
    return {
        importPath: path.join(relativeDirPath, formatFilename('common-http-service', filenameFormat)),
        className: 'CommonHttpService',
        file: {
            filename: path.join(
                relativeDirPath,
                `${formatFilename('common-http-service', {...filenameFormat, extension: '.ts'})}`
            ),
            data: processCoreFile(
                await fs.promises.readFile(path.join(__dirname, 'core', 'common-http-service.ts'), 'utf8'),
                filenameFormat,
                commentsConfig
            )
        }
    };
}

export async function generateCommonValidationSchemaStorage(
    {filenameFormat, relativeDirPath = defaultCoreRelativeDirPath}: OpenApiClientGeneratorConfig['core'] = {},
    commentsConfig: CommentsRenderConfig
): Promise<{
    importPath: string;
    className: string;
    file: ClientGenerationResultFile;
}> {
    return {
        importPath: path.join(relativeDirPath, formatFilename('common-validation-schema-storage', filenameFormat)),
        className: 'CommonValidationSchemaStorage',
        file: {
            filename: path.join(
                relativeDirPath,
                `${formatFilename('common-validation-schema-storage', {...filenameFormat, extension: '.ts'})}`
            ),
            data: processCoreFile(
                await fs.promises.readFile(path.join(__dirname, 'core', 'common-validation-schema-storage.ts'), 'utf8'),
                filenameFormat,
                commentsConfig
            )
        }
    };
}
