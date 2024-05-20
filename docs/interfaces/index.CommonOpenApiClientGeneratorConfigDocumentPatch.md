[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / CommonOpenApiClientGeneratorConfigDocumentPatch

# Interface: CommonOpenApiClientGeneratorConfigDocumentPatch

[index](../modules/index.md).CommonOpenApiClientGeneratorConfigDocumentPatch

Configuration to patch an OpenAPI document.

## Table of contents

### Properties

- [patchDocument](index.CommonOpenApiClientGeneratorConfigDocumentPatch.md#patchdocument)
- [patchPaths](index.CommonOpenApiClientGeneratorConfigDocumentPatch.md#patchpaths)
- [patchSchemas](index.CommonOpenApiClientGeneratorConfigDocumentPatch.md#patchschemas)
- [patchTags](index.CommonOpenApiClientGeneratorConfigDocumentPatch.md#patchtags)

## Properties

### patchDocument

• `Optional` **patchDocument**: [`OpenApiDocumentPatchDocument`](../modules/index.md#openapidocumentpatchdocument)

Patch for the whole document.

___

### patchPaths

• `Optional` **patchPaths**: \{ `[path: string]`: \{ [method in OpenApiHttpMethod]?: OpenApiDocumentPatchOperation } \| [`OpenApiDocumentPatchPathItem`](../modules/index.md#openapidocumentpatchpathitem);  } \| (`paths`: [`OpenApiPaths`](../modules/openapi.md#openapipaths)) => [`OpenApiPaths`](../modules/openapi.md#openapipaths)

Patches for paths.

___

### patchSchemas

• `Optional` **patchSchemas**: \{ `[schemaName: string]`: [`OpenApiDocumentPatchSchema`](../modules/index.md#openapidocumentpatchschema);  } \| [`OpenApiDocumentPatchAllSchemas`](../modules/index.md#openapidocumentpatchallschemas)

Patches for schemas.

___

### patchTags

• `Optional` **patchTags**: [`OpenApiDocumentPatchTags`](../modules/index.md#openapidocumentpatchtags)

Patches for tags.
