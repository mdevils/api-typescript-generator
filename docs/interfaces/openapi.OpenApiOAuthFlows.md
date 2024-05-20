[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiOAuthFlows

# Interface: OpenApiOAuthFlows

[openapi](../modules/openapi.md).OpenApiOAuthFlows

OpenAPI OAuth Flow Object.

**`See`**

https://swagger.io/specification/#oauth-flows-object

## Table of contents

### Properties

- [authorizationCode](openapi.OpenApiOAuthFlows.md#authorizationcode)
- [clientCredentials](openapi.OpenApiOAuthFlows.md#clientcredentials)
- [implicit](openapi.OpenApiOAuthFlows.md#implicit)
- [password](openapi.OpenApiOAuthFlows.md#password)

## Properties

### authorizationCode

• `Optional` **authorizationCode**: [`OpenApiOAuthFlow`](openapi.OpenApiOAuthFlow.md)

Configuration for the OAuth Authorization Code flow. Previously called accessCode in OpenAPI 2.0.

___

### clientCredentials

• `Optional` **clientCredentials**: [`OpenApiOAuthFlow`](openapi.OpenApiOAuthFlow.md)

Configuration for the OAuth Client Credentials flow. Previously called application in OpenAPI 2.0.

___

### implicit

• `Optional` **implicit**: [`OpenApiOAuthFlow`](openapi.OpenApiOAuthFlow.md)

Configuration for the OAuth Implicit flow.

___

### password

• `Optional` **password**: [`OpenApiOAuthFlow`](openapi.OpenApiOAuthFlow.md)

Configuration for the OAuth Resource Owner Password flow.
