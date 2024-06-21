[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / OpenApiClientGeneratorConfigClient

# Interface: OpenApiClientGeneratorConfigClient

[openapi-client](../modules/openapi_client.md).OpenApiClientGeneratorConfigClient

Configuration for generating the client.

## Table of contents

### Properties

- [baseUrl](openapi_client.OpenApiClientGeneratorConfigClient.md#baseurl)
- [errorClassName](openapi_client.OpenApiClientGeneratorConfigClient.md#errorclassname)
- [exportErrorClass](openapi_client.OpenApiClientGeneratorConfigClient.md#exporterrorclass)
- [exportModels](openapi_client.OpenApiClientGeneratorConfigClient.md#exportmodels)
- [exportOptionsType](openapi_client.OpenApiClientGeneratorConfigClient.md#exportoptionstype)
- [exportServices](openapi_client.OpenApiClientGeneratorConfigClient.md#exportservices)
- [filename](openapi_client.OpenApiClientGeneratorConfigClient.md#filename)
- [filenameFormat](openapi_client.OpenApiClientGeneratorConfigClient.md#filenameformat)
- [generateErrorJsDoc](openapi_client.OpenApiClientGeneratorConfigClient.md#generateerrorjsdoc)
- [generateJsDoc](openapi_client.OpenApiClientGeneratorConfigClient.md#generatejsdoc)
- [includeServices](openapi_client.OpenApiClientGeneratorConfigClient.md#includeservices)
- [name](openapi_client.OpenApiClientGeneratorConfigClient.md#name)
- [relativeDirPath](openapi_client.OpenApiClientGeneratorConfigClient.md#relativedirpath)

## Properties

### baseUrl

• `Optional` **baseUrl**: `string`

URL of the API server. Used as the base URL for the client. Example: `https://api.example.com`. Taken from
OpenAPI document if not set.

___

### errorClassName

• `Optional` **errorClassName**: `string`

Name of the class for http and other errors. Example: `MyApiClientError`.

___

### exportErrorClass

• `Optional` **exportErrorClass**: `boolean`

Whether to export the error class from the client file.

**`Default`**

```ts
true
```

___

### exportModels

• `Optional` **exportModels**: ``"all"`` \| ``"none"`` \| \{ `models`: `string`[]  }

Whether to export models from the client file.

**`Default`**

```ts
'none'
```

___

### exportOptionsType

• `Optional` **exportOptionsType**: `boolean`

Whether to export the client constructor options type.

**`Default`**

```ts
true
```

___

### exportServices

• `Optional` **exportServices**: ``"all"`` \| ``"none"`` \| \{ `services`: `string`[]  }

Whether to export services from the client file.

**`Default`**

```ts
'none'
```

___

### filename

• `Optional` **filename**: `string`

Filename of the client class.

___

### filenameFormat

• `Optional` **filenameFormat**: [`FilenameFormat`](index.FilenameFormat.md)

Filename format for the client class. Ignored if `filename` is set.

**`Default`**

```ts
{filenameCase: 'kebabCase'}
```

___

### generateErrorJsDoc

• `Optional` **generateErrorJsDoc**: `GenerateClientErrorJsDoc`

Client error class JSDoc generation callback.

___

### generateJsDoc

• `Optional` **generateJsDoc**: [`GenerateClientJsDoc`](../modules/openapi_client.md#generateclientjsdoc)

Client JSDoc generation callback.

___

### includeServices

• `Optional` **includeServices**: ``"all"`` \| ``"none"`` \| \{ `tags`: `string`[]  }

Whether to include services in the client.

- `all`: Include all services.
- `none`: Do not include any services.
- `{tags: string[]}`: Include services with the specified tags.

**`Default`**

```ts
'all'
```

___

### name

• **name**: `string`

Name of the client class. Probably the only required field in the configuration. Example: `MyApiClient`.

___

### relativeDirPath

• `Optional` **relativeDirPath**: `string`

Relative directory path for the client class.

**`Default`**

```ts
'./'
```
