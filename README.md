# Open API Typescript Client Generator

Generates Open API client for TypeScript. Extremely configurable.

## Features

1. Generates TypeScript models for all the schemas in the Open API document in a form of interfaces and type aliases.
2. Generates TypeScript services for all the operations in the Open API document.
3. Generates a client class that combines all the services.
4. Uses `fetch` API for making HTTP requests by default, but can be configured to use any other HTTP client.
5. May generate validation for the API responses if configured.

## Setup

Install using npm

```shell
npm add --save-dev api-typescript-generator 
```

Or using yarn

```shell
yarn add --dev api-typescript-generator
```

## Configuring

Create a `api-typescript-generator.config.ts` file in the root of your project.

```ts
import path from 'path';
import {ApiTypescriptGeneratorConfig} from 'api-typescript-generator';

const configuration: ApiTypescriptGeneratorConfig = {
    generates: [
        {
            type: 'openapiClient',
            document: {
                // The source of the Open API document.
                // Can also be { type: 'file', path: 'path/to/file.yaml' }
                // Both YAML and JSON formats are supported.
                source: {
                    type: 'url',
                    url: 'https://raw.githubusercontent.com/readmeio/oas-examples/main/3.1/yaml/petstore.yaml'
                }
            },
            // The output directory for the generated client.
            outputDirPath: path.join(__dirname, 'petstore-api-client'),
            client: {
                // The name of the generated client class.
                name: 'PetStoreApiClient',
                // Overrides the default base URL for the API.
                baseUrl: 'https://petstore.swagger.io/v2'
            }
        }
    ]
};

export default configuration;
```

Add the following script to your `package.json`:

```js
{
  // ...
  "scripts": {
    // ...
    "openapi-codegen": "api-typescript-generator generate api-typescript-generator.config.ts"
  }
}
```

Run the script:

```shell
npm run openapi-codegen
```

Or using yarn:

```shell
yarn openapi-codegen
```

By default it generates:

1. Models for all the schemas in the Open API document. Stored at `models` directory by default.
2. Services for all the operations in the Open API document. Stored at `services` directory by default.
3. A client class that combines all the services. Stored at the root of the output directory by default.
4. Core classes for handling HTTP requests and responses. Stored at `core` directory by default.

## Usage

The generated client can be used as follows:

```ts
import {PetStoreApiClient} from './petstore-api-client';

async function testApiClient() {
    const apiClient = new PetStoreApiClient();
    console.log(await client.store.getInventory());
}

testApiClient().catch(console.error);
```

## What is configurable?

1. Validation of the API responses. See [validation](docs/interfaces/openapi_client.OpenApiClientGeneratorConfig.md#validation).
2. Default base URL for the API. See [client.baseUrl](docs/interfaces/openapi_client.OpenApiClientGeneratorConfigClient.md#baseUrl).
3. Leading and trailing comments for the files. See [comments](docs/interfaces/openapi_client.OpenApiClientGeneratorConfigComments.md).
4. File naming conventions. I.e. [models.filenameFormat](docs/interfaces/openapi_client.OpenApiClientGeneratorConfigModels.md#filenameFormat).
5. Output directory structure. I.e. [models.relativeDirPath](docs/interfaces/openapi_client.OpenApiClientGeneratorConfigModels.md#relativeDirPath).
6. JSDoc generation. I.e. [models.generateJsDoc](docs/interfaces/openapi_client.OpenApiClientGeneratorConfigModels.md#generateJsDoc).
7. Many more. See the documentation below.

## Documentation

The most important interface for now would be the [OpenApiClientGeneratorConfig](docs/interfaces/openapi_client.OpenApiClientGeneratorConfig.md) interface. It contains all the configuration options for the Open API Client Generator.

Types are exported as part of three modules, depending on the area of application:

1. [`api-typescript-generator`](docs/modules/index.md) - The main module that exports the common API Generator Configuration types.
2. [`api-typescript-generator/openapi-client`](docs/modules/openapi_client.md) - The module that exports the Open API Client Generator Configuration types.
3. [`api-typescript-generator/openapi`](docs/modules/openapi.md) - The module that exports the Open API Document types.

At the moment only types are exported to be used with CLI. Callable API is planned for the future.

## References

1. [Open API Specification](https://swagger.io/specification/)
2. [JSON Schema](https://json-schema.org/)
