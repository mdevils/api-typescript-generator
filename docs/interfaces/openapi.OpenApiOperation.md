[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiOperation

# Interface: OpenApiOperation

[openapi](../modules/openapi.md).OpenApiOperation

Describes a single API operation on a path.

**`See`**

https://swagger.io/specification/#operation-object

## Table of contents

### Properties

- [callbacks](openapi.OpenApiOperation.md#callbacks)
- [deprecated](openapi.OpenApiOperation.md#deprecated)
- [description](openapi.OpenApiOperation.md#description)
- [externalDocs](openapi.OpenApiOperation.md#externaldocs)
- [operationId](openapi.OpenApiOperation.md#operationid)
- [parameters](openapi.OpenApiOperation.md#parameters)
- [requestBody](openapi.OpenApiOperation.md#requestbody)
- [responses](openapi.OpenApiOperation.md#responses)
- [security](openapi.OpenApiOperation.md#security)
- [servers](openapi.OpenApiOperation.md#servers)
- [summary](openapi.OpenApiOperation.md#summary)
- [tags](openapi.OpenApiOperation.md#tags)

## Properties

### callbacks

• `Optional` **callbacks**: `Record`\<`string`, [`OpenApiPathItem`](../modules/openapi.md#openapipathitem)\>

A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the
Callback Object. Each value in the map is a Callback Object that describes a request that may be initiated.

___

### deprecated

• `Optional` **deprecated**: `boolean`

Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default
value is false.

___

### description

• `Optional` **description**: `string`

A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation.

___

### externalDocs

• `Optional` **externalDocs**: [`OpenApiExternalDocumentation`](openapi.OpenApiExternalDocumentation.md)

Additional external documentation for this operation.

___

### operationId

• `Optional` **operationId**: `string`

Unique string used to identify the operation. The id MUST be unique among all operations described in the API.
The operationId value is case-sensitive. Tools and libraries MAY use the operationId to uniquely identify an
operation, therefore, it is RECOMMENDED to follow common programming naming conventions.

___

### parameters

• `Optional` **parameters**: [`OpenApiParameter`](openapi.OpenApiParameter.md)[]

A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item,
the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A
unique parameter is defined by a combination of a name and location. The list can use the Reference Object to
link to parameters that are defined at the OpenAPI Object's components/parameters.

___

### requestBody

• `Optional` **requestBody**: [`OpenApiRequestBody`](openapi.OpenApiRequestBody.md)

The request body applicable for this operation. The requestBody is only supported in HTTP methods where the HTTP
1.1 specification RFC7231 has explicitly defined semantics for request bodies. In other cases where the HTTP spec
is vague, requestBody SHALL be ignored by consumers.

___

### responses

• `Optional` **responses**: `Record`\<`string`, [`OpenApiResponse`](openapi.OpenApiResponse.md)\>

The list of possible responses as they are returned from executing this operation.

___

### security

• `Optional` **security**: `Record`\<`string`, `string`[]\>

A declaration of which security mechanisms can be used for this operation. The list of values includes
alternative security requirement objects that can be used. Only one of the security requirement objects need to
be satisfied to authorize a request. This definition overrides any declared top-level security. To remove a
top-level security declaration, an empty array can be used.

___

### servers

• `Optional` **servers**: [`OpenApiServer`](openapi.OpenApiServer.md)[]

An alternative server array to service this operation. If an alternative server object is specified at the Path
Item Object or Root level, it will be overridden by this value.

___

### summary

• `Optional` **summary**: `string`

A short summary of what the operation does.

___

### tags

• `Optional` **tags**: `string`[]

A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or
any other qualifier.
