[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiMediaType

# Interface: OpenApiMediaType

[openapi](../modules/openapi.md).OpenApiMediaType

Each Media Type Object provides schema and examples for the media type identified by its key.

**`See`**

https://swagger.io/specification/#media-type-object

## Table of contents

### Properties

- [encoding](openapi.OpenApiMediaType.md#encoding)
- [example](openapi.OpenApiMediaType.md#example)
- [examples](openapi.OpenApiMediaType.md#examples)
- [schema](openapi.OpenApiMediaType.md#schema)

## Properties

### encoding

• `Optional` **encoding**: `Record`\<`string`, [`OpenApiEncoding`](openapi.OpenApiEncoding.md)\>

A map between a property name and its encoding information. The key, being the property name, MUST exist in the
schema as a property. The encoding object SHALL only apply to requestBody objects when the media type is
multipart or application/x-www-form-urlencoded.

___

### example

• `Optional` **example**: `unknown`

Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The
example field is mutually exclusive of the examples field. Furthermore, if referencing a schema which contains an
example, the example value SHALL override the example provided by the schema.

___

### examples

• `Optional` **examples**: `Record`\<`string`, [`OpenApiExample`](openapi.OpenApiExample.md)\>

Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The
examples field is mutually exclusive of the example field. Furthermore, if referencing a schema which contains an
example, the examples value SHALL override the example provided by the schema.

___

### schema

• `Optional` **schema**: [`OpenApiSchema`](../modules/openapi.md#openapischema)

The schema defining the content of the request, response, or parameter.
