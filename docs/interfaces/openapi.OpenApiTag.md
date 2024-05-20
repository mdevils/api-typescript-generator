[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiTag

# Interface: OpenApiTag

[openapi](../modules/openapi.md).OpenApiTag

Adds metadata to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag
defined in the Operation Object instances.

**`See`**

https://swagger.io/specification/#tag-object

## Table of contents

### Properties

- [description](openapi.OpenApiTag.md#description)
- [externalDocs](openapi.OpenApiTag.md#externaldocs)
- [name](openapi.OpenApiTag.md#name)

## Properties

### description

• `Optional` **description**: `string`

A short description for the tag. CommonMark syntax MAY be used for rich text representation.

___

### externalDocs

• `Optional` **externalDocs**: [`OpenApiExternalDocumentation`](openapi.OpenApiExternalDocumentation.md)

Additional external documentation for this tag.

___

### name

• **name**: `string`

The name of the tag.
