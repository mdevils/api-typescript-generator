[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiResponse

# Interface: OpenApiResponse

[openapi](../modules/openapi.md).OpenApiResponse

Describes a single response from an API Operation, including design-time, static links to operations based on the
response.

**`See`**

https://swagger.io/specification/#response-object

## Table of contents

### Properties

- [content](openapi.OpenApiResponse.md#content)
- [description](openapi.OpenApiResponse.md#description)
- [headers](openapi.OpenApiResponse.md#headers)
- [links](openapi.OpenApiResponse.md#links)

## Properties

### content

• `Optional` **content**: `Record`\<`string`, [`OpenApiMediaType`](openapi.OpenApiMediaType.md)\>

A map containing descriptions of potential response payloads. The key is a media type or media type range and the
value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g.
text/plain overrides text/*

___

### description

• `Optional` **description**: `string`

A short description of the response. CommonMark syntax MAY be used for rich text representation.

___

### headers

• `Optional` **headers**: `Record`\<`string`, [`OpenApiHeader`](../modules/openapi.md#openapiheader)\>

Maps a header name to its definition. RFC7230 states header names are case-insensitive. If a response header is
defined with the name "Content-Type", it SHALL be ignored.

___

### links

• `Optional` **links**: `Record`\<`string`, [`OpenApiLink`](openapi.OpenApiLink.md)\>

A map of operations links that can be followed from the response. The key of the map is a short name for the link
following the naming constraints of the names for Component Objects.
