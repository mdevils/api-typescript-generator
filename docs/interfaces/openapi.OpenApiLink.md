[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiLink

# Interface: OpenApiLink

[openapi](../modules/openapi.md).OpenApiLink

OpenAPI Link Object.

## Table of contents

### Properties

- [description](openapi.OpenApiLink.md#description)
- [operationId](openapi.OpenApiLink.md#operationid)
- [operationRef](openapi.OpenApiLink.md#operationref)
- [parameters](openapi.OpenApiLink.md#parameters)
- [requestBody](openapi.OpenApiLink.md#requestbody)
- [server](openapi.OpenApiLink.md#server)

## Properties

### description

• `Optional` **description**: `string`

A description of the link. CommonMark syntax MAY be used for rich text representation.

___

### operationId

• `Optional` **operationId**: `string`

The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually
exclusive of the operationRef field.

___

### operationRef

• `Optional` **operationRef**: `string`

A relative or absolute URI reference to an OAS operation. This field is mutually exclusive of the operationId
field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing
Operation Object in the OpenAPI definition.

___

### parameters

• `Optional` **parameters**: `Record`\<`string`, `unknown`\>

A map representing parameters to pass to an operation as specified with operationId or identified via
operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to
be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location
[{in}.]{name} for operations that use the same parameter name in different locations (e.g. path.id).

___

### requestBody

• `Optional` **requestBody**: `unknown`

A literal value or {expression} to use as a request body when calling the target operation.

___

### server

• `Optional` **server**: [`OpenApiServer`](openapi.OpenApiServer.md)

A server object to be used by the target operation.
