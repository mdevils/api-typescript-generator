[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiDocument

# Interface: OpenApiDocument

[openapi](../modules/openapi.md).OpenApiDocument

OpenAPI 3.1.0 document

**`See`**

https://swagger.io/specification/#openapi-object

## Table of contents

### Properties

- [components](openapi.OpenApiDocument.md#components)
- [externalDocs](openapi.OpenApiDocument.md#externaldocs)
- [info](openapi.OpenApiDocument.md#info)
- [jsonSchemaDialect](openapi.OpenApiDocument.md#jsonschemadialect)
- [openapi](openapi.OpenApiDocument.md#openapi)
- [paths](openapi.OpenApiDocument.md#paths)
- [security](openapi.OpenApiDocument.md#security)
- [servers](openapi.OpenApiDocument.md#servers)
- [tags](openapi.OpenApiDocument.md#tags)
- [webhooks](openapi.OpenApiDocument.md#webhooks)

## Properties

### components

• `Optional` **components**: [`OpenApiComponents`](openapi.OpenApiComponents.md)

An element to hold various schemas for the specification.

___

### externalDocs

• `Optional` **externalDocs**: [`OpenApiExternalDocumentation`](openapi.OpenApiExternalDocumentation.md)

Additional external documentation.

___

### info

• **info**: [`OpenApiInfo`](openapi.OpenApiInfo.md)

Provides metadata about the API. The metadata MAY be used by the clients if needed.

___

### jsonSchemaDialect

• `Optional` **jsonSchemaDialect**: `string`

The default value for the $schema keyword within Schema Objects contained within this OAS document. This MUST be
in the form of a URI.

___

### openapi

• **openapi**: `string`

This string MUST be the semantic version number of the OpenAPI Specification version that the OpenAPI document
uses.

___

### paths

• `Optional` **paths**: [`OpenApiPaths`](../modules/openapi.md#openapipaths)

The available paths and operations for the API.

___

### security

• `Optional` **security**: `Record`\<`string`, `string`[]\>

A declaration of which security mechanisms can be used across the API. The list of values includes alternative
security requirement objects that can be used. Only one of the security requirement objects need to be satisfied
to authorize a request. Individual operations can override this definition. To make security optional, an empty
security requirement ({}) can be included in the array.

___

### servers

• `Optional` **servers**: [`OpenApiServer`](openapi.OpenApiServer.md)[]

An array of Server Objects, which provide connectivity information to a target server. If the servers property is
not provided, or is an empty array, the default value would be a Server Object with an url value of /.

___

### tags

• `Optional` **tags**: [`OpenApiTag`](openapi.OpenApiTag.md)[]

A list of tags used by the document with additional metadata. The order of the tags can be used to reflect on
their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags
that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be
unique.

___

### webhooks

• `Optional` **webhooks**: `Record`\<`string`, [`OpenApiPathItem`](../modules/openapi.md#openapipathitem)\>

He incoming webhooks that MAY be received as part of this API and that the API consumer MAY choose to implement.
Closely related to the callbacks feature, this section describes requests initiated other than by an API call,
for example by an out-of-band registration. The key name is a unique string to refer to each webhook, while the
(optionally referenced) Path Item Object describes a request that may be initiated by the API provider and the
expected responses.
