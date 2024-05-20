[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiRequestBody

# Interface: OpenApiRequestBody

[openapi](../modules/openapi.md).OpenApiRequestBody

Describes a single request body.

**`See`**

https://swagger.io/specification/#request-body-object

## Table of contents

### Properties

- [content](openapi.OpenApiRequestBody.md#content)
- [description](openapi.OpenApiRequestBody.md#description)
- [required](openapi.OpenApiRequestBody.md#required)

## Properties

### content

• **content**: `Record`\<`string`, [`OpenApiMediaType`](openapi.OpenApiMediaType.md)\>

The content of the request body. The key is a media type or media type range and the value describes it. For
requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*

___

### description

• `Optional` **description**: `string`

A brief description of the request body. This could contain examples of use. CommonMark syntax MAY be used for

___

### required

• `Optional` **required**: `boolean`

Determines if the request body is required in the request. Defaults to false.
