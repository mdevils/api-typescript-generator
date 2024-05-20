[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiOAuthFlow

# Interface: OpenApiOAuthFlow

[openapi](../modules/openapi.md).OpenApiOAuthFlow

OpenAPI OAuth Flow Object.

**`See`**

https://swagger.io/specification/#oauth-flow-object

## Table of contents

### Properties

- [authorizationUrl](openapi.OpenApiOAuthFlow.md#authorizationurl)
- [refreshUrl](openapi.OpenApiOAuthFlow.md#refreshurl)
- [scopes](openapi.OpenApiOAuthFlow.md#scopes)
- [tokenUrl](openapi.OpenApiOAuthFlow.md#tokenurl)

## Properties

### authorizationUrl

• **authorizationUrl**: `string`

The authorization URL to be used for this flow. This MUST be in the form of a URL.

___

### refreshUrl

• `Optional` **refreshUrl**: `string`

The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.

___

### scopes

• **scopes**: `Record`\<`string`, `string`\>

The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.

___

### tokenUrl

• **tokenUrl**: `string`

The token URL to be used for this flow. This MUST be in the form of a URL.
