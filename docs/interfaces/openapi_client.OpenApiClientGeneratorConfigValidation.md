[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / OpenApiClientGeneratorConfigValidation

# Interface: OpenApiClientGeneratorConfigValidation

[openapi-client](../modules/openapi_client.md).OpenApiClientGeneratorConfigValidation

Configuration for the validation.

## Table of contents

### Properties

- [library](openapi_client.OpenApiClientGeneratorConfigValidation.md#library)
- [validationSchemaStorage](openapi_client.OpenApiClientGeneratorConfigValidation.md#validationschemastorage)

## Properties

### library

• **library**: ``"zod"``

Validation library to use. Currently only Zod is supported.

**`See`**

https://github.com/colinhacks/zod

___

### validationSchemaStorage

• `Optional` **validationSchemaStorage**: [`OpenApiClientGeneratorConfigValidationSchemaStorage`](openapi_client.OpenApiClientGeneratorConfigValidationSchemaStorage.md)

Configuration for the validation schema storage.
