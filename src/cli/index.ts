#!/usr/bin/env node
import * as fs from 'node:fs';
import path from 'node:path';
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {compareGenerationResult} from './compare-generation-result';
import {saveGenerationResult} from './save-generation-result';
import {defaultCoreRelativeDirPath} from '../schema-to-typescript/common/client-core';
import {defaultModelsRelativeDirPath} from '../schema-to-typescript/common/models';
import {defaultServicesRelativeDirPath} from '../schema-to-typescript/common/services';
import {ApiTypescriptGeneratorConfig, CommonOpenApiClientGeneratorConfig} from '../schema-to-typescript/config';
import {
    OpenApiClientGeneratorConfig,
    openapiToTypescriptClient
} from '../schema-to-typescript/openapi-to-typescript-client';
import {loadOpenApiDocument} from '../schemas/load-open-api-document';
import {makeDir} from '../utils/make-dir';
import {postprocessFiles} from '../utils/postprocess-files';

async function loadConfig(filename: string): Promise<ApiTypescriptGeneratorConfig> {
    const fullFilename = path.resolve(process.cwd(), filename);
    if (!fs.existsSync(fullFilename)) {
        throw new Error(`Could not find configuration file: ${fullFilename}`);
    }
    try {
        // noinspection JSDeprecatedSymbols
        if (fullFilename.endsWith('.ts') && !require.extensions['.ts']) {
            const {register} = await import('ts-node');
            register();
        }
        const configImport = await import(fullFilename);
        let config = 'default' in configImport ? configImport.default : configImport;
        if (typeof config === 'function') {
            config = await config();
        }
        return config;
    } catch (e) {
        throw new Error(`Could not load configuration file: ${e instanceof Error ? e.message : e}`);
    }
}

const configurationFileArgument = yargs.positional('config', {
    describe: 'configuration file, can be either js or ts file.',
    default: 'api-typescript-generator.config.js',
    type: 'string',
    demandOption: true
});

function getCleanupDirectories(generateConfig: OpenApiClientGeneratorConfig & CommonOpenApiClientGeneratorConfig) {
    return [
        ...(generateConfig.models?.cleanupFiles
            ? [generateConfig.models?.relativeDirPath ?? defaultModelsRelativeDirPath]
            : []),
        ...(generateConfig.services && generateConfig.services?.cleanupFiles
            ? [generateConfig.services?.relativeDirPath ?? defaultServicesRelativeDirPath]
            : []),
        ...(generateConfig.core?.cleanupFiles
            ? [generateConfig.core?.relativeDirPath ?? defaultCoreRelativeDirPath]
            : [])
    ];
}

yargs(hideBin(process.argv))
    .command(
        'generate <config>',
        'generates API files according to the specified configuration file.',
        () => configurationFileArgument,
        async (argv) => {
            const config: ApiTypescriptGeneratorConfig = await loadConfig(argv.config);
            await Promise.all(
                config.generates.map(async (generateConfig) => {
                    switch (generateConfig.type) {
                        case 'openapiClient':
                            const document = await loadOpenApiDocument(generateConfig.document);
                            const files = await postprocessFiles({
                                files: (
                                    await openapiToTypescriptClient({
                                        document,
                                        generateConfig
                                    })
                                ).files,
                                config: generateConfig.postprocess,
                                outputDirPath: generateConfig.outputDirPath
                            });
                            const allDirectories = new Set<string>();
                            for (const {filename} of files) {
                                allDirectories.add(path.dirname(path.resolve(generateConfig.outputDirPath, filename)));
                            }
                            for (const directoryPath of allDirectories) {
                                try {
                                    await makeDir(directoryPath);
                                } catch (e) {
                                    throw new Error(
                                        `Could not create directory "${directoryPath}": ${e instanceof Error ? e.message : e}.`
                                    );
                                }
                            }
                            await saveGenerationResult({
                                files,
                                outputDirPath: generateConfig.outputDirPath,
                                cleanupDirectories: getCleanupDirectories(generateConfig)
                            });
                            break;
                    }
                })
            );
        }
    )
    .command(
        'check <config>',
        'compares previously generated API files with schema according to the specified configuration file.',
        () => configurationFileArgument,
        async (argv) => {
            const config: ApiTypescriptGeneratorConfig = await loadConfig(argv.config);
            await Promise.all(
                config.generates.map(async (generateConfig) => {
                    switch (generateConfig.type) {
                        case 'openapiClient':
                            if (
                                !(await compareGenerationResult({
                                    files: await postprocessFiles({
                                        files: (
                                            await openapiToTypescriptClient({
                                                document: await loadOpenApiDocument(generateConfig.document),
                                                generateConfig
                                            })
                                        ).files,
                                        config: generateConfig.postprocess,
                                        outputDirPath: generateConfig.outputDirPath
                                    }),
                                    outputDirPath: generateConfig.outputDirPath,
                                    cleanupDirectories: getCleanupDirectories(generateConfig)
                                }))
                            ) {
                                console.error(
                                    'Generated files are not up to date. Please run "api-typescript-generator generate" to update them.'
                                );
                                process.exit(1);
                            }
                    }
                })
            );
        }
    )
    .demandCommand(1)
    .strictCommands()
    .parse();
