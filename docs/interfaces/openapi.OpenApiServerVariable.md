[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiServerVariable

# Interface: OpenApiServerVariable

[openapi](../modules/openapi.md).OpenApiServerVariable

The OpenAPI server variable.

**`See`**

https://swagger.io/specification/#server-variable-object

## Table of contents

### Properties

- [default](openapi.OpenApiServerVariable.md#default)
- [description](openapi.OpenApiServerVariable.md#description)
- [enum](openapi.OpenApiServerVariable.md#enum)

## Properties

### default

• **default**: `string`

The default value to use for substitution, which SHALL be sent if an alternate value is not supplied.

___

### description

• `Optional` **description**: `string`

An optional description for the server variable. CommonMark syntax MAY be used for rich text representation.

___

### enum

• `Optional` **enum**: `string`[]

An enumeration of string values to be used if the substitution options are from a limited set.
