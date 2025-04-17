# OpenAPI Typescript Client Generator

A powerful, highly customizable TypeScript client generator for OpenAPI specifications. Build type-safe API clients for any environment with unprecedented control over generated code.

## Features

- **Fully-typed**: Generates TypeScript models for all schemas and operations
- **Environment-agnostic**: Generated clients work everywhere - browsers, Node.js, Sandbox environments, and more
- **Validation support**: Optional runtime validation for requests and responses
- **Highly customizable**: Control everything from naming conventions to file structure
- **Production-ready**: Used to build enterprise-grade API clients for Atlassian products
- **Flexible schema loading**: Load schemas from YAML or JSON, locally or remotely
- **Modern specification support**: Full support for OpenAPI 3.0 and 3.1

## Real-world Examples

Built by the team behind production API clients:
- `@resolution/jira-api-client` - Fully-typed Jira API client
- `@resolution/confluence-api-client` - Fully-typed Confluence API client

These clients support multiple environments (Atlassian Connect Server/Client, Atlassian Forge Backend/Frontend) from a single codebase - showcasing the flexibility of this generator.

## Comparison with Alternatives

| Feature                     | api-typescript-generator | openapi-typescript | openapi-ts + openapi-fetch                 |
|-----------------------------|--------------------------|--------------------|--------------------------------------------|
| Type Generation             | ✅                        | ✅                  | ✅                                          |
| Client Generation           | ✅                        | ✅                  | ❌ (`openapi-fetch` can use generated types) |
| Customizable File Structure | ✅                        | ❌                  | N/A                                        |
| Custom Naming Conventions   | ✅                        | ❌                  | ❌                                          |
| JSDoc Generation            | ✅                        | ✅                  | ✅                                          |
| JSDoc Customization         | ✅                        | ❌                  | ❌                                          |
| Validation                  | ✅ (configurable)         | ❌                  | ❌                                          |
| Environment-agnostic        | ✅                        | ✅                  | ✅                                          |
| No runtime dependencies     | ✅                        | ❌                  | ❌                                           |

## Setup

Install using npm:

```shell
npm add --save-dev api-typescript-generator 
```

Or using yarn:

```shell
yarn add --dev api-typescript-generator
```

## Configuration

Create a `api-typescript-generator.config.ts` file in your project root:

```ts
import path from 'path';
import {ApiTypescriptGeneratorConfig} from 'api-typescript-generator';

const configuration: ApiTypescriptGeneratorConfig = {
    generates: [
        {
            type: 'openapiClient',
            document: {
                // The source of the OpenAPI document.
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

Add a script to your `package.json`:

```json
{
  "scripts": {
    "openapi-codegen": "api-typescript-generator generate api-typescript-generator.config.ts"
  }
}
```

Run the script:

```shell
npm run openapi-codegen
```

## Basic Usage

```ts
import {PetStoreApiClient, PetStoreApiClientError} from './petstore-api-client';

const client = new PetStoreApiClient();

// Type-safe API calls
async function getPets() {
    const pets = await client.pet.findByStatus({status: 'available'});
    console.log(pets); // Fully typed response
}

// Error handling with typed errors
try {
    await client.pet.addPet({/* pet data */});
} catch (error) {
    if (error instanceof PetStoreApiClientError) {
        console.error('API Error:', error.response.status, error.message);
    }
}
```

## Advanced Usage

### Validation with Zod

Why you might want to enable validation:

- OpenAPI specifications can be incomplete or incorrect.
- Runtime validation can catch issues that static type checking cannot.
- Validation can help ensure that your API client behaves as expected.

```ts
// In config:
validation: {
    library: 'zod'
}

// Option 1. Throw validation errors
const client = new PetStoreApiClient();
const result = await client.pet.getPetById({petId: '123'});
// In case of validation error, an exception will be thrown.

// Option 2. Handle validation errors separately (i.e. send to Sentry)
const client = new PetStoreApiClient({
    handleValidationError(error) {
        Sentry.captureException(error);
    }
});
const result = await client.pet.getPetById({petId: '123'});
// In case of validation error, the error will be sent to Sentry, and the execution will continue.
```

### Custom HTTP Client

```ts
const client = new PetStoreApiClient({
    fetch: customFetchImplementation,
    baseUrl: 'https://custom-petstore.example.com',
    middlewares: [
        request => {
            request.headers['X-Custom-Header'] = 'value';
            return request;
        }
    ]
});
```

### Retry Logic

You can implement custom retry logic for your API client. This is useful for handling transient errors or rate limiting.

```ts
const client = new PetStoreApiClient({
    shouldRetryOnError: (error, attempt) => {
        if (error.status >= 500 && attempt < 3) {
            return new Promise((resolve) => {
                setTimeout(() => resolve(true), 100 * attempt);
            });
        }
        return false;
    }
});
```

### Deprecated API Operations

In case if an operation is marked as deprecated in OpenAPI spec, the generator will add a `@deprecated` tag to the generated method.
When calling a deprecated method, a warning will be logged to the console.
You can customize the logging behavior by providing a custom `logDeprecationWarning` function in the client configuration.

```ts
const client = new PetStoreApiClient({
    logDeprecationWarning: ({
       operationName,
       path,
       method
    }) => {
        Sentry.captureMessage(`Deprecated API call: ${operationName} (${method.toUpperCase()} ${path})`);
    }
});
```

## Customization Options

The generator offers unmatched customization:

1. **File Structure Control**
    - Custom directory structure
    - Configurable file naming patterns
    - Grouped or flat output

2. **Naming Conventions**
    - Model/interface naming patterns
    - Property naming transformation
    - Service method naming

3. **Documentation**
    - JSDoc generation with wordwrap control
    - Custom section ordering
    - Description formatting
    - Custom tags and annotations

4. **Client Features**
    - Response validation
    - Error handling strategies
    - Binary data processing
    - Custom fetch implementation
    - Custom request/response interceptors
    - Custom retry logic

## Documentation

For full configuration options, see:

- [OpenApiClientGeneratorConfig](docs/interfaces/openapi_client.OpenApiClientGeneratorConfig.md) - Main configuration interface
- [Models Configuration](docs/interfaces/openapi_client.OpenApiClientGeneratorConfigModels.md) - Model generation options
- [Services Configuration](docs/interfaces/openapi_client.OpenApiClientGeneratorConfigServices.md) - Service generation options
- [Validation Configuration](docs/interfaces/openapi_client.OpenApiClientGeneratorConfigValidation.md) - Validation options

## Modules

Types are exported from three modules:

1. [`api-typescript-generator`](docs/modules/index.md) - Common API Generator types
2. [`api-typescript-generator/openapi-client`](docs/modules/openapi_client.md) - OpenAPI Client types
3. [`api-typescript-generator/openapi`](docs/modules/openapi.md) - OpenAPI Document types

## Contributors

* [Marat Dulin](https://github.com/mdevils)
* [Mikhail Davydov](https://github.com/azproduction)

## References

1. [OpenAPI Specification](https://swagger.io/specification/)
2. [JSON Schema](https://json-schema.org/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
