[api-typescript-generator](../../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### Interfaces

- [ApiTypescriptGeneratorConfig](../interfaces/index.ApiTypescriptGeneratorConfig.md)
- [CommonOpenApiClientGeneratorConfig](../interfaces/index.CommonOpenApiClientGeneratorConfig.md)
- [CommonOpenApiClientGeneratorConfigDocument](../interfaces/index.CommonOpenApiClientGeneratorConfigDocument.md)
- [CommonOpenApiClientGeneratorConfigDocumentPatch](../interfaces/index.CommonOpenApiClientGeneratorConfigDocumentPatch.md)
- [CommonOpenApiClientGeneratorConfigPostprocess](../interfaces/index.CommonOpenApiClientGeneratorConfigPostprocess.md)
- [FilenameFormat](../interfaces/index.FilenameFormat.md)
- [JsDocBlock](../interfaces/index.JsDocBlock.md)
- [JsDocBlockTag](../interfaces/index.JsDocBlockTag.md)

### Type Aliases

- [CommonApiToTypescriptGeneratorSource](index.md#commonapitotypescriptgeneratorsource)
- [EntityNameCase](index.md#entitynamecase)
- [OpenApiDocumentPatchAllSchemas](index.md#openapidocumentpatchallschemas)
- [OpenApiDocumentPatchDocument](index.md#openapidocumentpatchdocument)
- [OpenApiDocumentPatchOperation](index.md#openapidocumentpatchoperation)
- [OpenApiDocumentPatchPathItem](index.md#openapidocumentpatchpathitem)
- [OpenApiDocumentPatchSchema](index.md#openapidocumentpatchschema)
- [OpenApiDocumentPatchTags](index.md#openapidocumentpatchtags)

## Type Aliases

### CommonApiToTypescriptGeneratorSource

Ƭ **CommonApiToTypescriptGeneratorSource**: \{ `path`: `string` ; `type`: ``"file"``  } \| \{ `type`: ``"url"`` ; `url`: `string`  }

Source of the API to generate TypeScript types from. Can be a file or a URL. Supports both YAML and JSON.

___

### EntityNameCase

Ƭ **EntityNameCase**: ``"kebabCase"`` \| ``"camelCase"`` \| ``"snakeCase"`` \| ``"pascalCase"``

___

### OpenApiDocumentPatchAllSchemas

Ƭ **OpenApiDocumentPatchAllSchemas**: (`schemas`: \{ `[schemaName: string]`: [`OpenApiSchema`](openapi.md#openapischema);  }) => \{ `[schemaName: string]`: [`OpenApiSchema`](openapi.md#openapischema);  }

#### Type declaration

▸ (`schemas`): `Object`

Callback to patch all schemas.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schemas` | `Object` | The schemas to patch. |

##### Returns

`Object`

___

### OpenApiDocumentPatchDocument

Ƭ **OpenApiDocumentPatchDocument**: (`document`: [`OpenApiDocument`](../interfaces/openapi.OpenApiDocument.md)) => [`OpenApiDocument`](../interfaces/openapi.OpenApiDocument.md)

#### Type declaration

▸ (`document`): [`OpenApiDocument`](../interfaces/openapi.OpenApiDocument.md)

Callback to patch the whole OpenAPI document. Applies after all other patches.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | [`OpenApiDocument`](../interfaces/openapi.OpenApiDocument.md) | The OpenAPI document to patch. |

##### Returns

[`OpenApiDocument`](../interfaces/openapi.OpenApiDocument.md)

___

### OpenApiDocumentPatchOperation

Ƭ **OpenApiDocumentPatchOperation**: (`operation`: [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md), `path`: `string`, `httpMethod`: [`OpenApiHttpMethod`](openapi.md#openapihttpmethod)) => [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md)

#### Type declaration

▸ (`operation`, `path`, `httpMethod`): [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md)

Callback to patch an operation.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `operation` | [`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md) | The operation to patch. |
| `path` | `string` | The path of the operation. |
| `httpMethod` | [`OpenApiHttpMethod`](openapi.md#openapihttpmethod) | - |

##### Returns

[`OpenApiOperation`](../interfaces/openapi.OpenApiOperation.md)

___

### OpenApiDocumentPatchPathItem

Ƭ **OpenApiDocumentPatchPathItem**: (`pathItem`: [`OpenApiPathItem`](openapi.md#openapipathitem), `path`: `string`) => [`OpenApiPathItem`](openapi.md#openapipathitem)

#### Type declaration

▸ (`pathItem`, `path`): [`OpenApiPathItem`](openapi.md#openapipathitem)

Callback to patch a path item.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pathItem` | [`OpenApiPathItem`](openapi.md#openapipathitem) | The path item to patch. |
| `path` | `string` | The path of the path item. |

##### Returns

[`OpenApiPathItem`](openapi.md#openapipathitem)

___

### OpenApiDocumentPatchSchema

Ƭ **OpenApiDocumentPatchSchema**: (`schema`: [`OpenApiSchema`](openapi.md#openapischema), `schemaName`: `string`) => [`OpenApiSchema`](openapi.md#openapischema)

#### Type declaration

▸ (`schema`, `schemaName`): [`OpenApiSchema`](openapi.md#openapischema)

Callback to patch a schema.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [`OpenApiSchema`](openapi.md#openapischema) | The schema to patch. |
| `schemaName` | `string` | The name of the schema. |

##### Returns

[`OpenApiSchema`](openapi.md#openapischema)

___

### OpenApiDocumentPatchTags

Ƭ **OpenApiDocumentPatchTags**: (`tags`: [`OpenApiTag`](../interfaces/openapi.OpenApiTag.md)[]) => [`OpenApiTag`](../interfaces/openapi.OpenApiTag.md)[]

#### Type declaration

▸ (`tags`): [`OpenApiTag`](../interfaces/openapi.OpenApiTag.md)[]

Callback to patch tags.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tags` | [`OpenApiTag`](../interfaces/openapi.OpenApiTag.md)[] | The tags to patch. |

##### Returns

[`OpenApiTag`](../interfaces/openapi.OpenApiTag.md)[]
