import path from 'path';
import {ApiTypescriptGeneratorConfig} from './../../src';

export default async function (): Promise<ApiTypescriptGeneratorConfig> {
    return {
        generates: [
            {
                type: 'openapiClient',
                document: {
                    source: {
                        type: 'url',
                        url: 'https://raw.githubusercontent.com/readmeio/oas-examples/main/3.1/yaml/petstore.yaml'
                    }
                },
                outputDirPath: path.join(__dirname, 'petstore-api-client'),
                client: {
                    name: 'PetStoreApiClient'
                },
                operations: {
                    validateResponse: true,
                    makeResponseValidationSchemasExtensible: true,
                    showDeprecatedWarnings: true
                },
                validation: {
                    library: 'zod'
                },
                core: {
                    cleanupFiles: true,
                    generateJsDoc: ({suggestedJsDoc}) => ({
                        ...suggestedJsDoc,
                        tags: [...suggestedJsDoc.tags, {name: 'internal'}]
                    })
                },
                models: {
                    cleanupFiles: true
                },
                services: {
                    cleanupFiles: true
                }
            }
        ]
    };
}
