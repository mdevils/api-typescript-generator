[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / OpenApiClientExternalType

# Interface: OpenApiClientExternalType

[openapi-client](../modules/openapi_client.md).OpenApiClientExternalType

Custom type for the OpenAPI client generation customization.

## Hierarchy

- [`OpenApiClientExternalValue`](openapi_client.OpenApiClientExternalValue.md)

  ↳ **`OpenApiClientExternalType`**

## Table of contents

### Properties

- [name](openapi_client.OpenApiClientExternalType.md#name)
- [source](openapi_client.OpenApiClientExternalType.md#source)
- [typeParameters](openapi_client.OpenApiClientExternalType.md#typeparameters)

## Properties

### name

• **name**: `string` \| `string`[]

Fully qualified name of the import. Example: `MyType` or `[namespace, MyType]`.

#### Inherited from

[OpenApiClientExternalValue](openapi_client.OpenApiClientExternalValue.md).[name](openapi_client.OpenApiClientExternalValue.md#name)

___

### source

• `Optional` **source**: [`OpenApiClientExternalValueSource`](openapi_client.OpenApiClientExternalValueSource.md)

Source of the import.

#### Inherited from

[OpenApiClientExternalValue](openapi_client.OpenApiClientExternalValue.md).[source](openapi_client.OpenApiClientExternalValue.md#source)

___

### typeParameters

• `Optional` **typeParameters**: [`OpenApiClientExternalType`](openapi_client.OpenApiClientExternalType.md)[]

Type parameters of the type. I.e. `T` in `Promise<T>`.
