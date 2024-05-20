[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / OpenApiClientGeneratorConfigValidationSchemaStorage

# Interface: OpenApiClientGeneratorConfigValidationSchemaStorage

[openapi-client](../modules/openapi_client.md).OpenApiClientGeneratorConfigValidationSchemaStorage

Configuration for the validation schema storage.

## Table of contents

### Properties

- [exportName](openapi_client.OpenApiClientGeneratorConfigValidationSchemaStorage.md#exportname)
- [filename](openapi_client.OpenApiClientGeneratorConfigValidationSchemaStorage.md#filename)
- [filenameFormat](openapi_client.OpenApiClientGeneratorConfigValidationSchemaStorage.md#filenameformat)
- [relativeDirPath](openapi_client.OpenApiClientGeneratorConfigValidationSchemaStorage.md#relativedirpath)

## Properties

### exportName

• `Optional` **exportName**: `string`

Name of the export in the validation schema storage file.

**`Default`**

```ts
'validationSchemaStorage'
```

___

### filename

• `Optional` **filename**: `string`

Filename of the validation schema storage.

___

### filenameFormat

• `Optional` **filenameFormat**: [`FilenameFormat`](index.FilenameFormat.md)

Filename format for the validation schema storage. Ignored if `filename` is set.

**`Default`**

```ts
{filenameCase: 'kebabCase'}
```

___

### relativeDirPath

• `Optional` **relativeDirPath**: `string`

Relative directory path for the validation schema storage.

**`Default`**

```ts
'./'
```
