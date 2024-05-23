[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / OpenApiClientGeneratorConfigModels

# Interface: OpenApiClientGeneratorConfigModels

[openapi-client](../modules/openapi_client.md).OpenApiClientGeneratorConfigModels

Configuration for generating models.

## Table of contents

### Properties

- [cleanupFiles](openapi_client.OpenApiClientGeneratorConfigModels.md#cleanupfiles)
- [defaultScope](openapi_client.OpenApiClientGeneratorConfigModels.md#defaultscope)
- [filenameFormat](openapi_client.OpenApiClientGeneratorConfigModels.md#filenameformat)
- [generateJsDoc](openapi_client.OpenApiClientGeneratorConfigModels.md#generatejsdoc)
- [generateName](openapi_client.OpenApiClientGeneratorConfigModels.md#generatename)
- [relativeDirPath](openapi_client.OpenApiClientGeneratorConfigModels.md#relativedirpath)

## Properties

### cleanupFiles

• `Optional` **cleanupFiles**: `boolean`

Whether to remove non-generated model files from the models directory. If set to `true`, generator will remove
all files in the models directory that are not generated by the generator.

**`Default`**

```ts
false
```

___

### defaultScope

• `Optional` **defaultScope**: `string`

Models are divided into files based on the application scope. The scope is determined by tags of the operations
which use the model. If a model is used by operations with different tags, it will be placed in a file with the
default scope.

**`Default`**

```ts
'common'
```

___

### filenameFormat

• `Optional` **filenameFormat**: [`FilenameFormat`](index.FilenameFormat.md)

Filename format for the models.

**`Default`**

```ts
{filenameCase: 'kebabCase'}
```

___

### generateJsDoc

• `Optional` **generateJsDoc**: [`GenerateModelJsDoc`](../modules/openapi_client.md#generatemodeljsdoc)

Model JSDoc generation callback. Generates JSDoc both for the model and its fields.

___

### generateName

• `Optional` **generateName**: [`GenerateModelNameCallback`](../modules/openapi_client.md#generatemodelnamecallback)

Model name generation callback.

___

### relativeDirPath

• `Optional` **relativeDirPath**: `string`

Relative directory path for the models.

**`Default`**

```ts
'models'
```