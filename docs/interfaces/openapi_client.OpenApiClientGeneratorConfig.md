[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / OpenApiClientGeneratorConfig

# Interface: OpenApiClientGeneratorConfig

[openapi-client](../modules/openapi_client.md).OpenApiClientGeneratorConfig

Configuration for generating an OpenAPI client.

## Hierarchy

- [`CommonOpenApiClientGeneratorConfig`](index.CommonOpenApiClientGeneratorConfig.md)

  ↳ **`OpenApiClientGeneratorConfig`**

## Table of contents

### Properties

- [binaryTypes](openapi_client.OpenApiClientGeneratorConfig.md#binarytypes)
- [client](openapi_client.OpenApiClientGeneratorConfig.md#client)
- [comments](openapi_client.OpenApiClientGeneratorConfig.md#comments)
- [core](openapi_client.OpenApiClientGeneratorConfig.md#core)
- [document](openapi_client.OpenApiClientGeneratorConfig.md#document)
- [jsDoc](openapi_client.OpenApiClientGeneratorConfig.md#jsdoc)
- [models](openapi_client.OpenApiClientGeneratorConfig.md#models)
- [operations](openapi_client.OpenApiClientGeneratorConfig.md#operations)
- [outputDirPath](openapi_client.OpenApiClientGeneratorConfig.md#outputdirpath)
- [postprocess](openapi_client.OpenApiClientGeneratorConfig.md#postprocess)
- [services](openapi_client.OpenApiClientGeneratorConfig.md#services)
- [type](openapi_client.OpenApiClientGeneratorConfig.md#type)
- [validation](openapi_client.OpenApiClientGeneratorConfig.md#validation)

## Properties

### binaryTypes

• `Optional` **binaryTypes**: [`OpenApiClientCustomizableBinaryType`](../modules/openapi_client.md#openapiclientcustomizablebinarytype)[]

List of accepted binary types as input.

**`Default`**

```ts
['blob', 'readableStream']
```

___

### client

• **client**: ``false`` \| [`OpenApiClientGeneratorConfigClient`](openapi_client.OpenApiClientGeneratorConfigClient.md)

Configuration for generating the client. If set to `false`, the client will not be generated.

___

### comments

• `Optional` **comments**: [`OpenApiClientGeneratorConfigComments`](openapi_client.OpenApiClientGeneratorConfigComments.md)

Configuration for additional comments.

___

### core

• `Optional` **core**: [`OpenApiClientGeneratorConfigCore`](openapi_client.OpenApiClientGeneratorConfigCore.md)

Configuration for generating core classes. Core classes are classes that are used by the generated client and
services. e.g. HTTP client, HTTP service, Generic Validation schema storage (if validation is enabled).

___

### document

• **document**: [`CommonOpenApiClientGeneratorConfigDocument`](index.CommonOpenApiClientGeneratorConfigDocument.md)

Configuration for the OpenAPI document.

#### Inherited from

[CommonOpenApiClientGeneratorConfig](index.CommonOpenApiClientGeneratorConfig.md).[document](index.CommonOpenApiClientGeneratorConfig.md#document)

___

### jsDoc

• `Optional` **jsDoc**: [`OpenApiClientGeneratorConfigJsDoc`](openapi_client.OpenApiClientGeneratorConfigJsDoc.md)

Configuration for JSDoc generation.

___

### models

• `Optional` **models**: [`OpenApiClientGeneratorConfigModels`](openapi_client.OpenApiClientGeneratorConfigModels.md)

Configuration for generating models.

___

### operations

• `Optional` **operations**: [`OpenApiClientGeneratorConfigOperations`](openapi_client.OpenApiClientGeneratorConfigOperations.md)

Configuration for generating operation calls.

___

### outputDirPath

• **outputDirPath**: `string`

Output directory for the generated client files.

#### Inherited from

[CommonOpenApiClientGeneratorConfig](index.CommonOpenApiClientGeneratorConfig.md).[outputDirPath](index.CommonOpenApiClientGeneratorConfig.md#outputdirpath)

___

### postprocess

• `Optional` **postprocess**: [`CommonOpenApiClientGeneratorConfigPostprocess`](index.CommonOpenApiClientGeneratorConfigPostprocess.md)

Configuration for the generated client files.

#### Inherited from

[CommonOpenApiClientGeneratorConfig](index.CommonOpenApiClientGeneratorConfig.md).[postprocess](index.CommonOpenApiClientGeneratorConfig.md#postprocess)

___

### services

• `Optional` **services**: ``false`` \| [`OpenApiClientGeneratorConfigServices`](openapi_client.OpenApiClientGeneratorConfigServices.md)

Configuration for generating services. If set to `false`, services will not be generated. Services are generated
based on the tags of the operations.

___

### type

• **type**: ``"openapiClient"``

___

### validation

• `Optional` **validation**: [`OpenApiClientGeneratorConfigValidation`](openapi_client.OpenApiClientGeneratorConfigValidation.md)

Configuration for request/response validation.
