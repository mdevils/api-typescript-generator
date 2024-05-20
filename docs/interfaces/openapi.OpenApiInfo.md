[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiInfo

# Interface: OpenApiInfo

[openapi](../modules/openapi.md).OpenApiInfo

The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented
in editing or documentation generation tools for convenience.

**`See`**

https://swagger.io/specification/#info-object

## Table of contents

### Properties

- [contact](openapi.OpenApiInfo.md#contact)
- [description](openapi.OpenApiInfo.md#description)
- [license](openapi.OpenApiInfo.md#license)
- [summary](openapi.OpenApiInfo.md#summary)
- [termsOfService](openapi.OpenApiInfo.md#termsofservice)
- [title](openapi.OpenApiInfo.md#title)
- [version](openapi.OpenApiInfo.md#version)

## Properties

### contact

• `Optional` **contact**: [`OpenApiContact`](openapi.OpenApiContact.md)

The contact information for the exposed API.

___

### description

• `Optional` **description**: `string`

A description of the API. CommonMark syntax MAY be used for rich text representation.

___

### license

• `Optional` **license**: [`OpenApiLicense`](openapi.OpenApiLicense.md)

The license information for the exposed API.

___

### summary

• `Optional` **summary**: `string`

A short summary of the API.

___

### termsOfService

• `Optional` **termsOfService**: `string`

A URL to the Terms of Service for the API. MUST be in the format of a URL.

___

### title

• **title**: `string`

The title of the API.

___

### version

• **version**: `string`

The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API
implementation version).
