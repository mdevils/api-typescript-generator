[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / OpenApiClientGeneratorConfigOperations

# Interface: OpenApiClientGeneratorConfigOperations

[openapi-client](../modules/openapi_client.md).OpenApiClientGeneratorConfigOperations

Configuration for generating operation calls.

## Table of contents

### Properties

- [generateOperationJsDoc](openapi_client.OpenApiClientGeneratorConfigOperations.md#generateoperationjsdoc)
- [generateOperationName](openapi_client.OpenApiClientGeneratorConfigOperations.md#generateoperationname)
- [generateOperationParameterArgumentName](openapi_client.OpenApiClientGeneratorConfigOperations.md#generateoperationparameterargumentname)
- [generateOperationParameterJsDoc](openapi_client.OpenApiClientGeneratorConfigOperations.md#generateoperationparameterjsdoc)
- [generateOperationRequestBodyArgumentName](openapi_client.OpenApiClientGeneratorConfigOperations.md#generateoperationrequestbodyargumentname)
- [generateOperationRequestBodyJsDoc](openapi_client.OpenApiClientGeneratorConfigOperations.md#generateoperationrequestbodyjsdoc)
- [generateOperationResultDescription](openapi_client.OpenApiClientGeneratorConfigOperations.md#generateoperationresultdescription)
- [makeResponseValidationSchemasExtensible](openapi_client.OpenApiClientGeneratorConfigOperations.md#makeresponsevalidationschemasextensible)
- [mediaTypeArgumentName](openapi_client.OpenApiClientGeneratorConfigOperations.md#mediatypeargumentname)
- [responseBinaryType](openapi_client.OpenApiClientGeneratorConfigOperations.md#responsebinarytype)
- [validateResponse](openapi_client.OpenApiClientGeneratorConfigOperations.md#validateresponse)

## Properties

### generateOperationJsDoc

• `Optional` **generateOperationJsDoc**: [`GenerateOperationJsDoc`](../modules/openapi_client.md#generateoperationjsdoc)

Operation JSDoc generation callback.

___

### generateOperationName

• `Optional` **generateOperationName**: [`GenerateOperationName`](../modules/openapi_client.md#generateoperationname)

Operation name generation callback.

___

### generateOperationParameterArgumentName

• `Optional` **generateOperationParameterArgumentName**: [`GenerateOperationParameterArgumentName`](../modules/openapi_client.md#generateoperationparameterargumentname)

Operation parameter argument name generation callback.

___

### generateOperationParameterJsDoc

• `Optional` **generateOperationParameterJsDoc**: [`GenerateOperationParameterJsDoc`](../modules/openapi_client.md#generateoperationparameterjsdoc)

Operation parameter JSDoc generation callback.

___

### generateOperationRequestBodyArgumentName

• `Optional` **generateOperationRequestBodyArgumentName**: [`GenerateOperationRequestBodyArgumentName`](../modules/openapi_client.md#generateoperationrequestbodyargumentname)

Operation request body argument name generation callback.

___

### generateOperationRequestBodyJsDoc

• `Optional` **generateOperationRequestBodyJsDoc**: [`GenerateOperationRequestBodyJsDoc`](../modules/openapi_client.md#generateoperationrequestbodyjsdoc)

Operation request body JSDoc generation callback.

___

### generateOperationResultDescription

• `Optional` **generateOperationResultDescription**: [`GenerateOperationResultDescription`](../modules/openapi_client.md#generateoperationresultdescription)

Operation result description generation callback.

___

### makeResponseValidationSchemasExtensible

• `Optional` **makeResponseValidationSchemasExtensible**: `boolean`

Whether to make the response validation schemas extensible. If set to `true`, the response validation schemas
will accept previously unknown fields. This is useful when the API is expected to change over time.

**`Default`**

```ts
false
```

___

### mediaTypeArgumentName

• `Optional` **mediaTypeArgumentName**: `string`

Argument name for the media type.

**`Default`**

```ts
'mediaType'
```

___

### responseBinaryType

• `Optional` **responseBinaryType**: [`OpenApiClientBuiltinBinaryType`](../modules/openapi_client.md#openapiclientbuiltinbinarytype)

Binary response/request type. Used when the response is not a JSON value.

**`Default`**

```ts
'blob'
```

___

### validateResponse

• `Optional` **validateResponse**: `boolean`

Whether to validate the response. In order to use this feature, the validation configuration must be set.

**`Default`**

```ts
false
```
