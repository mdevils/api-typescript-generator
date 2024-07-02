[api-typescript-generator](../../README.md) / [Modules](../modules.md) / openapi-client

# Module: openapi-client

## Table of contents

### Classes

- [CommonHttpClientError](../classes/openapi_client.CommonHttpClientError.md)

### Interfaces

- [CommonHttpClientFetchRequest](../interfaces/openapi_client.CommonHttpClientFetchRequest.md)
- [CommonHttpClientFetchRequestHeaders](../interfaces/openapi_client.CommonHttpClientFetchRequestHeaders.md)
- [CommonHttpClientFetchResponse](../interfaces/openapi_client.CommonHttpClientFetchResponse.md)
- [CommonHttpClientOptions](../interfaces/openapi_client.CommonHttpClientOptions.md)
- [CommonHttpClientRequestHeaders](../interfaces/openapi_client.CommonHttpClientRequestHeaders.md)
- [CommonHttpClientResponse](../interfaces/openapi_client.CommonHttpClientResponse.md)
- [OpenApiClientExternalType](../interfaces/openapi_client.OpenApiClientExternalType.md)
- [OpenApiClientExternalValue](../interfaces/openapi_client.OpenApiClientExternalValue.md)
- [OpenApiClientExternalValueSource](../interfaces/openapi_client.OpenApiClientExternalValueSource.md)
- [OpenApiClientGeneratorConfig](../interfaces/openapi_client.OpenApiClientGeneratorConfig.md)
- [OpenApiClientGeneratorConfigClient](../interfaces/openapi_client.OpenApiClientGeneratorConfigClient.md)
- [OpenApiClientGeneratorConfigComments](../interfaces/openapi_client.OpenApiClientGeneratorConfigComments.md)
- [OpenApiClientGeneratorConfigCore](../interfaces/openapi_client.OpenApiClientGeneratorConfigCore.md)
- [OpenApiClientGeneratorConfigJsDoc](../interfaces/openapi_client.OpenApiClientGeneratorConfigJsDoc.md)
- [OpenApiClientGeneratorConfigJsDocWordWrap](../interfaces/openapi_client.OpenApiClientGeneratorConfigJsDocWordWrap.md)
- [OpenApiClientGeneratorConfigModels](../interfaces/openapi_client.OpenApiClientGeneratorConfigModels.md)
- [OpenApiClientGeneratorConfigOperations](../interfaces/openapi_client.OpenApiClientGeneratorConfigOperations.md)
- [OpenApiClientGeneratorConfigServices](../interfaces/openapi_client.OpenApiClientGeneratorConfigServices.md)
- [OpenApiClientGeneratorConfigValidation](../interfaces/openapi_client.OpenApiClientGeneratorConfigValidation.md)
- [OpenApiClientGeneratorConfigValidationSchemaStorage](../interfaces/openapi_client.OpenApiClientGeneratorConfigValidationSchemaStorage.md)

### Type Aliases

- [CommonHttpClientFetchResponseBody](openapi_client.md#commonhttpclientfetchresponsebody)
- [CommonHttpClientRequest](openapi_client.md#commonhttpclientrequest)
- [CommonHttpClientResponseHeaders](openapi_client.md#commonhttpclientresponseheaders)
- [GenerateClientErrorJsDoc](openapi_client.md#generateclienterrorjsdoc)
- [GenerateClientJsDoc](openapi_client.md#generateclientjsdoc)
- [GenerateCoreJsDoc](openapi_client.md#generatecorejsdoc)
- [GenerateModelJsDoc](openapi_client.md#generatemodeljsdoc)
- [GenerateModelNameCallback](openapi_client.md#generatemodelnamecallback)
- [GenerateOperationJsDoc](openapi_client.md#generateoperationjsdoc)
- [GenerateOperationName](openapi_client.md#generateoperationname)
- [GenerateOperationParameterArgumentName](openapi_client.md#generateoperationparameterargumentname)
- [GenerateOperationParameterJsDoc](openapi_client.md#generateoperationparameterjsdoc)
- [GenerateOperationRequestBodyArgumentName](openapi_client.md#generateoperationrequestbodyargumentname)
- [GenerateOperationRequestBodyJsDoc](openapi_client.md#generateoperationrequestbodyjsdoc)
- [GenerateOperationResultDescription](openapi_client.md#generateoperationresultdescription)
- [GenerateServiceJsDoc](openapi_client.md#generateservicejsdoc)
- [GenerateServiceName](openapi_client.md#generateservicename)
- [OpenApiClientBuiltinBinaryType](openapi_client.md#openapiclientbuiltinbinarytype)
- [OpenApiClientCustomizableBinaryType](openapi_client.md#openapiclientcustomizablebinarytype)
- [OpenApiClientExternalValueSourceImportEntity](openapi_client.md#openapiclientexternalvaluesourceimportentity)

## Type Aliases

### CommonHttpClientFetchResponseBody

Ƭ **CommonHttpClientFetchResponseBody**: \{ `data`: `unknown` ; `type`: ``"json"``  } \| \{ `data`: `Blob` ; `type`: ``"blob"``  } \| \{ `data`: `ReadableStream`\<`Uint8Array`\> ; `type`: ``"readableStream"``  }

___

### CommonHttpClientRequest

Ƭ **CommonHttpClientRequest**: `Omit`\<[`CommonHttpClientFetchRequest`](../interfaces/openapi_client.CommonHttpClientFetchRequest.md), ``"body"`` \| ``"headers"`` \| ``"cache"`` \| ``"credentials"`` \| ``"redirect"``\> & \{ `body?`: `unknown` ; `headers?`: [`CommonHttpClientRequestHeaders`](../interfaces/openapi_client.CommonHttpClientRequestHeaders.md) ; `path`: `string` ; `pathParams?`: `Record`\<`string`, `unknown`\> ; `query?`: `Record`\<`string`, `unknown`\>  } & `Partial`\<`Pick`\<[`CommonHttpClientFetchRequest`](../interfaces/openapi_client.CommonHttpClientFetchRequest.md), ``"cache"`` \| ``"credentials"`` \| ``"redirect"``\>\>

Request in terms of OpenAPI.

___

### CommonHttpClientResponseHeaders

Ƭ **CommonHttpClientResponseHeaders**: `Record`\<`string`, `string`\> & \{ `set-cookie?`: `string`[]  }

___

### GenerateClientErrorJsDoc

Ƭ **GenerateClientErrorJsDoc**: (`params`: \{ `info`: [`OpenApiInfo`](../interfaces/openapi.OpenApiInfo.md) ; `suggestedJsDoc`: [`JsDocBlock`](../interfaces/index.JsDocBlock.md)  }) => [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

#### Type declaration

▸ (`params`): [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

Callback for generating the JSDoc of a client.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.info` | [`OpenApiInfo`](../interfaces/openapi.OpenApiInfo.md) | OpenAPI Info Object. |
| `params.suggestedJsDoc` | [`JsDocBlock`](../interfaces/index.JsDocBlock.md) | Suggested JSDoc block. Used by default if the callback is not specified. |

##### Returns

[`JsDocBlock`](../interfaces/index.JsDocBlock.md)

**`Example`**

```ts
function generateClientErrorJsDoc({suggestedJsDoc, info}) {
        return {
            ...suggestedJsDoc,
            title: 'Error Class for ' + info.summary
        };
    }
```

___

### GenerateClientJsDoc

Ƭ **GenerateClientJsDoc**: (`params`: \{ `info`: [`OpenApiInfo`](../interfaces/openapi.OpenApiInfo.md) ; `suggestedJsDoc`: [`JsDocBlock`](../interfaces/index.JsDocBlock.md)  }) => [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

#### Type declaration

▸ (`params`): [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

Callback for generating the JSDoc of a client.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.info` | [`OpenApiInfo`](../interfaces/openapi.OpenApiInfo.md) | OpenAPI Info Object. |
| `params.suggestedJsDoc` | [`JsDocBlock`](../interfaces/index.JsDocBlock.md) | Suggested JSDoc block. Used by default if the callback is not specified. |

##### Returns

[`JsDocBlock`](../interfaces/index.JsDocBlock.md)

**`Example`**

```ts
function generateClientJsDoc({suggestedJsDoc, info}) {
        return {
            title: info.summary,
            description: info.description,
            tags: [{name: 'version', value: info.version}]
        };
    }
```

___

### GenerateCoreJsDoc

Ƭ **GenerateCoreJsDoc**: (`params`: \{ `memberName?`: `string` ; `suggestedJsDoc`: [`JsDocBlock`](../interfaces/index.JsDocBlock.md) ; `typeName`: `string`  }) => [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

#### Type declaration

▸ (`params`): [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

Callback for generating the JSDoc for core classes.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.memberName?` | `string` | Name of the member of the core class. Empty if the JSDoc is for the class itself. |
| `params.suggestedJsDoc` | [`JsDocBlock`](../interfaces/index.JsDocBlock.md) | Suggested JSDoc block. Used by default if the callback is not specified. |
| `params.typeName` | `string` | Name of the core class. |

##### Returns

[`JsDocBlock`](../interfaces/index.JsDocBlock.md)

**`Example`**

```ts
function GenerateCoreJsDoc({suggestedJsDoc}) {
        return {
            ...suggestedJsDoc,
            tags: [...suggestedJsDoc.tags, {name: 'internal'}]
        };
    }
```

___

### GenerateModelJsDoc

Ƭ **GenerateModelJsDoc**: (`params`: \{ `fieldPath`: `string`[] ; `schema`: [`OpenApiSchema`](openapi.md#openapischema) ; `schemaName`: `string` ; `suggestedJsDoc`: [`JsDocBlock`](../interfaces/index.JsDocBlock.md)  }) => [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

#### Type declaration

▸ (`params`): [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

Callback for generating the JSDoc of a model.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.fieldPath` | `string`[] | Path to the field in the schema. Empty if the schema is a model schema. |
| `params.schema` | [`OpenApiSchema`](openapi.md#openapischema) | OpenAPISchema of the model schema (if fieldPath is empty) or the field schema. |
| `params.schemaName` | `string` | Name of the schema. |
| `params.suggestedJsDoc` | [`JsDocBlock`](../interfaces/index.JsDocBlock.md) | Suggested JSDoc block. Used by default if the callback is not specified. |

##### Returns

[`JsDocBlock`](../interfaces/index.JsDocBlock.md)

**`Example`**

```ts
function generateModelJsDoc({suggestedJsDoc, schemaName, fieldPath}) {
        if (fieldPath.length === 0) {
            return {
                title: schemaName,
                ...suggestedJsDoc
            };
        } else {
            return suggestedJsDoc;
        }
    }
```

___

### GenerateModelNameCallback

Ƭ **GenerateModelNameCallback**: (`context`: \{ `schemaName`: `string` ; `suggestedName`: `string`  }) => `string`

#### Type declaration

▸ (`context`): `string`

Callback for generating the name of a model.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Object` | - |
| `context.schemaName` | `string` | OpenAPI Schema name. |
| `context.suggestedName` | `string` | Suggested name of the model. Used by default if the callback is not specified. |

##### Returns

`string`

**`Example`**

```ts
function generateModelName({suggestedName, schemaName, fieldPath}) {
        if (fieldPath.length === 0) {
            return schemaName + 'Model';
        } else {
            return suggestedName;
        }
    }
```

___

### GenerateOperationJsDoc

Ƭ **GenerateOperationJsDoc**: (`params`: \{ `httpMethod`: `string` ; `operation`: [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) ; `path`: `string` ; `pathItem`: [`OpenApiPathItem`](openapi.md#openapipathitem) ; `serviceName?`: `string` ; `suggestedJsDoc`: [`JsDocBlock`](../interfaces/index.JsDocBlock.md)  }) => [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

#### Type declaration

▸ (`params`): [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

Callback for generating the JSDoc of an operation.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.httpMethod` | `string` | HTTP method of the operation. I.e. `get`. |
| `params.operation` | [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) | OpenAPI Operation Object. **`See`** https://swagger.io/specification/#operation-object |
| `params.path` | `string` | Path of the operation. I.e. `/orders/{orderId}`. |
| `params.pathItem` | [`OpenApiPathItem`](openapi.md#openapipathitem) | OpenAPI Path Item Object. **`See`** https://swagger.io/specification/#path-item-object |
| `params.serviceName?` | `string` | Name of the service. |
| `params.suggestedJsDoc` | [`JsDocBlock`](../interfaces/index.JsDocBlock.md) | Suggested JSDoc block. Used by default if the callback is not specified. |

##### Returns

[`JsDocBlock`](../interfaces/index.JsDocBlock.md)

**`Example`**

```ts
function generateOperationJsDoc({suggestedJsDoc, path, httpMethod}) {
        return {
            ...suggestedJsDoc,
            tags: [...suggestedJsDoc.tags, {name: 'path', value: `{${httpMethod}} ${path}`}]
        };
    }
```

___

### GenerateOperationName

Ƭ **GenerateOperationName**: (`params`: \{ `httpMethod`: `string` ; `operation`: [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) ; `path`: `string` ; `pathItem`: [`OpenApiPathItem`](openapi.md#openapipathitem) ; `serviceName?`: `string` ; `suggestedName`: `string`  }) => `string`

#### Type declaration

▸ (`params`): `string`

Callback for generating the name of an operation.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.httpMethod` | `string` | HTTP method of the operation. I.e. `get`. |
| `params.operation` | [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) | OpenAPI Operation Object. **`See`** https://swagger.io/specification/#operation-object |
| `params.path` | `string` | Path of the operation. I.e. `/orders/{orderId}`. |
| `params.pathItem` | [`OpenApiPathItem`](openapi.md#openapipathitem) | OpenAPI Path Item Object. **`See`** https://swagger.io/specification/#path-item-object |
| `params.serviceName?` | `string` | Name of the service. |
| `params.suggestedName` | `string` | Suggested name of the operation. Used by default if the callback is not specified. |

##### Returns

`string`

**`Example`**

```ts
function generateOperationName({operation, httpMethod}) {
        return `${httpMethod}_${operation.operationId}`;
    }
```

___

### GenerateOperationParameterArgumentName

Ƭ **GenerateOperationParameterArgumentName**: (`params`: \{ `httpMethod`: `string` ; `operation`: [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) ; `operationName`: `string` ; `parameter`: [`OpenApiParameter`](../interfaces/openapi.OpenApiParameter.md) ; `path`: `string` ; `pathItem`: [`OpenApiPathItem`](openapi.md#openapipathitem) ; `serviceName?`: `string` ; `suggestedName`: `string`  }) => `string`

#### Type declaration

▸ (`params`): `string`

Callback for generating the name of an operation parameter argument.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.httpMethod` | `string` | HTTP method of the operation. I.e. `get`. |
| `params.operation` | [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) | OpenAPI Operation Object. **`See`** https://swagger.io/specification/#operation-object |
| `params.operationName` | `string` | Generated class method name for the operation. |
| `params.parameter` | [`OpenApiParameter`](../interfaces/openapi.OpenApiParameter.md) | OpenAPI Parameter Object. **`See`** https://swagger.io/specification/#parameter-object |
| `params.path` | `string` | Path of the operation. I.e. `/orders/{orderId}`. |
| `params.pathItem` | [`OpenApiPathItem`](openapi.md#openapipathitem) | OpenAPI Path Item Object. **`See`** https://swagger.io/specification/#path-item-object |
| `params.serviceName?` | `string` | Name of the service. |
| `params.suggestedName` | `string` | Suggested name of the argument. Used by default if the callback is not specified. |

##### Returns

`string`

**`Example`**

```ts
function generateOperationParameterArgumentName({parameter}) {
        return parameter.in + '_' + parameter.name;
    }
```

___

### GenerateOperationParameterJsDoc

Ƭ **GenerateOperationParameterJsDoc**: (`params`: \{ `httpMethod`: `string` ; `operation`: [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) ; `operationName`: `string` ; `parameter`: [`OpenApiParameter`](../interfaces/openapi.OpenApiParameter.md) ; `path`: `string` ; `pathItem`: [`OpenApiPathItem`](openapi.md#openapipathitem) ; `serviceName?`: `string` ; `suggestedJsDoc`: [`JsDocBlock`](../interfaces/index.JsDocBlock.md)  }) => [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

#### Type declaration

▸ (`params`): [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

Callback for generating the JSDoc of an operation parameter argument.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.httpMethod` | `string` | HTTP method of the operation. I.e. `get`. |
| `params.operation` | [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) | OpenAPI Operation Object. **`See`** https://swagger.io/specification/#operation-object |
| `params.operationName` | `string` | Generated class method name for the operation. |
| `params.parameter` | [`OpenApiParameter`](../interfaces/openapi.OpenApiParameter.md) | OpenAPI Parameter Object. **`See`** https://swagger.io/specification/#parameter-object |
| `params.path` | `string` | Path of the operation. I.e. `/orders/{orderId}`. |
| `params.pathItem` | [`OpenApiPathItem`](openapi.md#openapipathitem) | OpenAPI Path Item Object. **`See`** https://swagger.io/specification/#path-item-object |
| `params.serviceName?` | `string` | Name of the service. |
| `params.suggestedJsDoc` | [`JsDocBlock`](../interfaces/index.JsDocBlock.md) | Suggested JSDoc block. Used by default if the callback is not specified. |

##### Returns

[`JsDocBlock`](../interfaces/index.JsDocBlock.md)

**`Example`**

```ts
function generateOperationParameterJsDoc({suggestedJsDoc, parameter}) {
        return {
            ...suggestedJsDoc,
            tags: [
                ...suggestedJsDoc.tags,
                {name: 'name', value: parameter.name},
                {name: 'location', value: parameter.in}
            ]
        };
    }
```

___

### GenerateOperationRequestBodyArgumentName

Ƭ **GenerateOperationRequestBodyArgumentName**: (`params`: \{ `content`: [`OpenApiMediaType`](../interfaces/openapi.OpenApiMediaType.md) ; `httpMethod`: `string` ; `mediaType`: `string` ; `operation`: [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) ; `operationName`: `string` ; `path`: `string` ; `pathItem`: [`OpenApiPathItem`](openapi.md#openapipathitem) ; `requestBody`: [`OpenApiRequestBody`](../interfaces/openapi.OpenApiRequestBody.md) ; `serviceName?`: `string` ; `suggestedName`: `string`  }) => `string`

#### Type declaration

▸ (`params`): `string`

Callback for generating the name of an operation request body argument.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.content` | [`OpenApiMediaType`](../interfaces/openapi.OpenApiMediaType.md) | OpenAPI Media Type Object. **`See`** https://swagger.io/specification/#media-type-object |
| `params.httpMethod` | `string` | HTTP method of the operation. I.e. `get`. |
| `params.mediaType` | `string` | Media type of the request body. I.e. `application/json`. |
| `params.operation` | [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) | OpenAPI Operation Object. **`See`** https://swagger.io/specification/#operation-object |
| `params.operationName` | `string` | Generated class method name for the operation. |
| `params.path` | `string` | Path of the operation. I.e. `/orders/{orderId}`. |
| `params.pathItem` | [`OpenApiPathItem`](openapi.md#openapipathitem) | OpenAPI Path Item Object. **`See`** https://swagger.io/specification/#path-item-object |
| `params.requestBody` | [`OpenApiRequestBody`](../interfaces/openapi.OpenApiRequestBody.md) | OpenAPI Request Body Object. **`See`** https://swagger.io/specification/#request-body-object |
| `params.serviceName?` | `string` | Name of the service. |
| `params.suggestedName` | `string` | Suggested name of the argument. Used by default if the callback is not specified. |

##### Returns

`string`

**`Example`**

```ts
function generateOperationRequestBodyArgumentName({suggestedName}) {
        return suggestedName + 'RequestBody';
    }
```

___

### GenerateOperationRequestBodyJsDoc

Ƭ **GenerateOperationRequestBodyJsDoc**: (`params`: \{ `content`: [`OpenApiMediaType`](../interfaces/openapi.OpenApiMediaType.md) ; `httpMethod`: `string` ; `mediaType`: `string` ; `operation`: [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) ; `operationName`: `string` ; `path`: `string` ; `pathItem`: [`OpenApiPathItem`](openapi.md#openapipathitem) ; `requestBody`: [`OpenApiRequestBody`](../interfaces/openapi.OpenApiRequestBody.md) ; `serviceName?`: `string` ; `suggestedJsDoc`: [`JsDocBlock`](../interfaces/index.JsDocBlock.md)  }) => [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

#### Type declaration

▸ (`params`): [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

Callback for generating the JSDoc of an operation request body argument.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.content` | [`OpenApiMediaType`](../interfaces/openapi.OpenApiMediaType.md) | OpenAPI Media Type Object. **`See`** https://swagger.io/specification/#media-type-object |
| `params.httpMethod` | `string` | HTTP method of the operation. I.e. `get`. |
| `params.mediaType` | `string` | Media type of the request body. I.e. `application/json`. |
| `params.operation` | [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) | OpenAPI Operation Object. **`See`** https://swagger.io/specification/#operation-object |
| `params.operationName` | `string` | Generated class method name for the operation. |
| `params.path` | `string` | Path of the operation. I.e. `/orders/{orderId}`. |
| `params.pathItem` | [`OpenApiPathItem`](openapi.md#openapipathitem) | OpenAPI Path Item Object. **`See`** https://swagger.io/specification/#path-item-object |
| `params.requestBody` | [`OpenApiRequestBody`](../interfaces/openapi.OpenApiRequestBody.md) | OpenAPI Request Body Object. **`See`** https://swagger.io/specification/#request-body-object |
| `params.serviceName?` | `string` | Name of the service. |
| `params.suggestedJsDoc` | [`JsDocBlock`](../interfaces/index.JsDocBlock.md) | Suggested JSDoc block. Used by default if the callback is not specified. |

##### Returns

[`JsDocBlock`](../interfaces/index.JsDocBlock.md)

**`Example`**

```ts
function generateOperationRequestBodyJsDoc({suggestedJsDoc, mediaType}) {
        return {
            ...suggestedJsDoc,
            tags: [...suggestedJsDoc.tags, {name: 'mediaType', value: mediaType}]
        };
    }
```

___

### GenerateOperationResultDescription

Ƭ **GenerateOperationResultDescription**: (`params`: \{ `httpMethod`: `string` ; `operation`: [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) ; `path`: `string` ; `pathItem`: [`OpenApiPathItem`](openapi.md#openapipathitem) ; `serviceName?`: `string` ; `suggestedDescription`: `string`  }) => `string`

#### Type declaration

▸ (`params`): `string`

Callback for generating the description of an operation result.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.httpMethod` | `string` | HTTP method of the operation. I.e. `get`. |
| `params.operation` | [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) | OpenAPI Operation Object. **`See`** https://swagger.io/specification/#operation-object |
| `params.path` | `string` | Path of the operation. I.e. `/orders/{orderId}`. |
| `params.pathItem` | [`OpenApiPathItem`](openapi.md#openapipathitem) | OpenAPI Path Item Object. **`See`** https://swagger.io/specification/#path-item-object |
| `params.serviceName?` | `string` | Name of the service. |
| `params.suggestedDescription` | `string` | Suggested description. Used by default if the callback is not specified. |

##### Returns

`string`

**`Example`**

```ts
function generateOperationResultDescription({suggestedDescription, serviceName}) {
        return suggestedDescription + ' for ' + serviceName + ' service.';
    }
```

___

### GenerateServiceJsDoc

Ƭ **GenerateServiceJsDoc**: (`params`: \{ `paths`: [`OpenApiPaths`](openapi.md#openapipaths) ; `serviceName`: `string` ; `suggestedJsDoc`: [`JsDocBlock`](../interfaces/index.JsDocBlock.md) ; `tag`: [`OpenApiTag`](../interfaces/openapi.OpenApiTag.md)  }) => [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

#### Type declaration

▸ (`params`): [`JsDocBlock`](../interfaces/index.JsDocBlock.md)

Callback for generating the JSDoc of a service.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.paths` | [`OpenApiPaths`](openapi.md#openapipaths) | OpenAPI Paths Object. **`See`** https://swagger.io/specification/#paths-object |
| `params.serviceName` | `string` | Name of the service. |
| `params.suggestedJsDoc` | [`JsDocBlock`](../interfaces/index.JsDocBlock.md) | Suggested JSDoc block. Used by default if the callback is not specified. |
| `params.tag` | [`OpenApiTag`](../interfaces/openapi.OpenApiTag.md) | Tag of the service. The service contains all operations with the same tag. **`See`** https://swagger.io/specification/#tag-object |

##### Returns

[`JsDocBlock`](../interfaces/index.JsDocBlock.md)

**`Example`**

```ts
function generateServiceJsDoc({suggestedJsDoc, tag}) {
        return {
            ...suggestedJsDoc,
            tags: [...suggestedJsDoc.tags, {name: 'tag', value: tag.name}]
        };
    }
```

___

### GenerateServiceName

Ƭ **GenerateServiceName**: (`params`: \{ `paths`: [`OpenApiPaths`](openapi.md#openapipaths) ; `suggestedName`: `string` ; `tag`: [`OpenApiTag`](../interfaces/openapi.OpenApiTag.md)  }) => `string`

#### Type declaration

▸ (`params`): `string`

Callback for generating the name of a service.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.paths` | [`OpenApiPaths`](openapi.md#openapipaths) | OpenAPI Paths Object. **`See`** https://swagger.io/specification/#paths-object |
| `params.suggestedName` | `string` | Suggested name of the service. Used by default if the callback is not specified. |
| `params.tag` | [`OpenApiTag`](../interfaces/openapi.OpenApiTag.md) | Tag of the service. The service contains all operations with the same tag. **`See`** https://swagger.io/specification/#tag-object |

##### Returns

`string`

**`Example`**

```ts
function generateServiceName({tag}) {
        return tag.name.replace(/[^a-zA-Z0-9]/g, '') + 'Service';
    }
```

___

### OpenApiClientBuiltinBinaryType

Ƭ **OpenApiClientBuiltinBinaryType**: ``"blob"`` \| ``"readableStream"``

Built-in binary types for the OpenAPI client generation.

___

### OpenApiClientCustomizableBinaryType

Ƭ **OpenApiClientCustomizableBinaryType**: [`OpenApiClientBuiltinBinaryType`](openapi_client.md#openapiclientbuiltinbinarytype) \| [`OpenApiClientExternalType`](../interfaces/openapi_client.OpenApiClientExternalType.md)

Customizable binary type for the OpenAPI client generation.

___

### OpenApiClientExternalValueSourceImportEntity

Ƭ **OpenApiClientExternalValueSourceImportEntity**: \{ `name`: `string`  } \| ``"default"``

What needs to be imported from the external source.
