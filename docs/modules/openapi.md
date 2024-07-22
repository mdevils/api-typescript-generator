[api-typescript-generator](../../README.md) / [Modules](../modules.md) / openapi

# Module: openapi

## Table of contents

### Interfaces

- [OpenApiComponents](../interfaces/openapi.OpenApiComponents.md)
- [OpenApiContact](../interfaces/openapi.OpenApiContact.md)
- [OpenApiDocument](../interfaces/openapi.OpenApiDocument.md)
- [OpenApiEncoding](../interfaces/openapi.OpenApiEncoding.md)
- [OpenApiExample](../interfaces/openapi.OpenApiExample.md)
- [OpenApiExpandedSchema](../interfaces/openapi.OpenApiExpandedSchema.md)
- [OpenApiExternalDocumentation](../interfaces/openapi.OpenApiExternalDocumentation.md)
- [OpenApiInfo](../interfaces/openapi.OpenApiInfo.md)
- [OpenApiLicense](../interfaces/openapi.OpenApiLicense.md)
- [OpenApiLink](../interfaces/openapi.OpenApiLink.md)
- [OpenApiMediaType](../interfaces/openapi.OpenApiMediaType.md)
- [OpenApiOAuthFlow](../interfaces/openapi.OpenApiOAuthFlow.md)
- [OpenApiOAuthFlows](../interfaces/openapi.OpenApiOAuthFlows.md)
- [OpenApiOperation](../interfaces/openapi.OpenApiOperation.md)
- [OpenApiParameter](../interfaces/openapi.OpenApiParameter.md)
- [OpenApiRequestBody](../interfaces/openapi.OpenApiRequestBody.md)
- [OpenApiResponse](../interfaces/openapi.OpenApiResponse.md)
- [OpenApiSecurityScheme](../interfaces/openapi.OpenApiSecurityScheme.md)
- [OpenApiServer](../interfaces/openapi.OpenApiServer.md)
- [OpenApiServerVariable](../interfaces/openapi.OpenApiServerVariable.md)
- [OpenApiTag](../interfaces/openapi.OpenApiTag.md)

### Type Aliases

- [OpenApiFormats](openapi.md#openapiformats)
- [OpenApiHeader](openapi.md#openapiheader)
- [OpenApiHttpMethod](openapi.md#openapihttpmethod)
- [OpenApiParameterIn](openapi.md#openapiparameterin)
- [OpenApiParameterStyle](openapi.md#openapiparameterstyle)
- [OpenApiPathItem](openapi.md#openapipathitem)
- [OpenApiPaths](openapi.md#openapipaths)
- [OpenApiPrimitiveTypes](openapi.md#openapiprimitivetypes)
- [OpenApiSchema](openapi.md#openapischema)
- [OpenApiSchemaPrimitiveValue](openapi.md#openapischemaprimitivevalue)

### Variables

- [openApiHttpMethods](openapi.md#openapihttpmethods)

## Type Aliases

### OpenApiFormats

Ƭ **OpenApiFormats**: ``"int32"`` \| ``"int64"`` \| ``"float"`` \| ``"double"`` \| ``"byte"`` \| ``"binary"`` \| ``"date"`` \| ``"date-time"`` \| ``"password"`` \| ``"email"``

Available JSON Schema formats.

___

### OpenApiHeader

Ƭ **OpenApiHeader**: `Omit`\<[`OpenApiParameter`](../interfaces/openapi.OpenApiParameter.md), ``"name"`` \| ``"in"``\>

OpenAPI Header Object.

___

### OpenApiHttpMethod

Ƭ **OpenApiHttpMethod**: typeof [`openApiHttpMethods`](openapi.md#openapihttpmethods)[`number`]

OpenAPI HTTP method.

___

### OpenApiParameterIn

Ƭ **OpenApiParameterIn**: ``"query"`` \| ``"header"`` \| ``"path"`` \| ``"cookie"``

Parameter locations.

___

### OpenApiParameterStyle

Ƭ **OpenApiParameterStyle**: ``"matrix"`` \| ``"label"`` \| ``"form"`` \| ``"simple"`` \| ``"spaceDelimited"`` \| ``"pipeDelimited"`` \| ``"deepObject"``

The type of serialization to use for the parameter.

___

### OpenApiPathItem

Ƭ **OpenApiPathItem**: \{ `description?`: `string` ; `parameters?`: [`OpenApiParameter`](../interfaces/openapi.OpenApiParameter.md)[] ; `servers?`: [`OpenApiServer`](../interfaces/openapi.OpenApiServer.md)[] ; `summary?`: `string`  } & \{ [K in OpenApiHttpMethod]?: OpenApiOperation }

Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path
itself is still exposed to the documentation viewer but they will not know which operations and parameters are
available.

**`See`**

https://swagger.io/specification/#path-item-object

___

### OpenApiPaths

Ƭ **OpenApiPaths**: `Record`\<`string`, [`OpenApiPathItem`](openapi.md#openapipathitem)\>

Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the
Server Object in order to construct the full URL. The Paths MAY be empty, due to Access Control List (ACL)
constraints.

**`See`**

https://swagger.io/specification/#paths-object

___

### OpenApiPrimitiveTypes

Ƭ **OpenApiPrimitiveTypes**: ``"null"`` \| ``"number"`` \| ``"integer"`` \| ``"string"`` \| ``"boolean"``

JSON Schema primitive types.

___

### OpenApiSchema

Ƭ **OpenApiSchema**: `boolean` \| [`OpenApiExpandedSchema`](../interfaces/openapi.OpenApiExpandedSchema.md)

The OpenAPI schema.

___

### OpenApiSchemaPrimitiveValue

Ƭ **OpenApiSchemaPrimitiveValue**: `string` \| `number` \| `boolean` \| ``null``

## Variables

### openApiHttpMethods

• `Const` **openApiHttpMethods**: readonly [``"get"``, ``"put"``, ``"post"``, ``"delete"``, ``"options"``, ``"head"``, ``"patch"``, ``"trace"``]

List of HTTP methods defined by OpenAPI.
