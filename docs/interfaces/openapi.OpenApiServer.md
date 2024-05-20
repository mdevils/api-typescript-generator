[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiServer

# Interface: OpenApiServer

[openapi](../modules/openapi.md).OpenApiServer

The OpenAPI server object.

**`See`**

https://swagger.io/specification/#server-object

## Table of contents

### Properties

- [description](openapi.OpenApiServer.md#description)
- [url](openapi.OpenApiServer.md#url)
- [variables](openapi.OpenApiServer.md#variables)

## Properties

### description

• `Optional` **description**: `string`

An optional string describing the host designated by the URL. CommonMark syntax MAY be used for rich text
representation.

___

### url

• **url**: `string`

A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host
location is relative to the location where the OpenAPI document is being served. Variable substitutions will be
made when a variable is named in {brackets}.

___

### variables

• `Optional` **variables**: `Record`\<`string`, [`OpenApiServerVariable`](openapi.OpenApiServerVariable.md)\>

A map between a variable name and its value. The value is used for substitution in the server's URL template.
