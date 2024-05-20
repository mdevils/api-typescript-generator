[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiExample

# Interface: OpenApiExample

[openapi](../modules/openapi.md).OpenApiExample

An example for a particular OpenAPI entity (i.e. parameter, schema, etc.).

**`See`**

https://swagger.io/specification/#example-object

## Table of contents

### Properties

- [description](openapi.OpenApiExample.md#description)
- [externalValue](openapi.OpenApiExample.md#externalvalue)
- [summary](openapi.OpenApiExample.md#summary)
- [value](openapi.OpenApiExample.md#value)

## Properties

### description

• `Optional` **description**: `string`

Long description for the example. CommonMark syntax MAY be used for rich text representation.

___

### externalValue

• `Optional` **externalValue**: `string`

A URL that points to the literal example. This provides the capability to reference examples that cannot easily
be included in JSON or YAML documents. The value field and externalValue field are mutually exclusive.

___

### summary

• `Optional` **summary**: `string`

Short description for the example.

___

### value

• **value**: `unknown`

Embedded literal example. The value field and externalValue field are mutually exclusive. To represent examples
of media types that cannot naturally be represented in JSON or YAML, use a string value to contain the example,
escaping where necessary.
