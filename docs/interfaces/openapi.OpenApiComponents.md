[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiComponents

# Interface: OpenApiComponents

[openapi](../modules/openapi.md).OpenApiComponents

Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object
will have no effect on the API unless they are explicitly referenced from properties outside the components object.

**`See`**

https://swagger.io/specification/#components-object

## Table of contents

### Properties

- [callbacks](openapi.OpenApiComponents.md#callbacks)
- [examples](openapi.OpenApiComponents.md#examples)
- [headers](openapi.OpenApiComponents.md#headers)
- [links](openapi.OpenApiComponents.md#links)
- [parameters](openapi.OpenApiComponents.md#parameters)
- [pathItems](openapi.OpenApiComponents.md#pathitems)
- [requestBodies](openapi.OpenApiComponents.md#requestbodies)
- [responses](openapi.OpenApiComponents.md#responses)
- [schemas](openapi.OpenApiComponents.md#schemas)
- [securitySchemes](openapi.OpenApiComponents.md#securityschemes)

## Properties

### callbacks

• `Optional` **callbacks**: `Record`\<`string`, `Record`\<`string`, [`OpenApiPathItem`](../modules/openapi.md#openapipathitem)\>\>

An object to hold reusable Callback Objects.

___

### examples

• `Optional` **examples**: `Record`\<`string`, [`OpenApiExample`](openapi.OpenApiExample.md)\>

An object to hold reusable Example Objects.

___

### headers

• `Optional` **headers**: `Record`\<`string`, [`OpenApiHeader`](../modules/openapi.md#openapiheader)\>

An object to hold reusable Header Objects.

___

### links

• `Optional` **links**: `Record`\<`string`, [`OpenApiLink`](openapi.OpenApiLink.md)\>

An object to hold reusable Link Objects.

___

### parameters

• `Optional` **parameters**: `Record`\<`string`, [`OpenApiParameter`](openapi.OpenApiParameter.md)\>

An object to hold reusable Parameter Objects.

___

### pathItems

• `Optional` **pathItems**: `Record`\<`string`, [`OpenApiPathItem`](../modules/openapi.md#openapipathitem)\>

An object to hold reusable Path Item Objects.

___

### requestBodies

• `Optional` **requestBodies**: `Record`\<`string`, [`OpenApiRequestBody`](openapi.OpenApiRequestBody.md)\>

An object to hold reusable Request Body Objects.

___

### responses

• `Optional` **responses**: `Record`\<`string`, [`OpenApiResponse`](openapi.OpenApiResponse.md)\>

An object to hold reusable Response Objects.

___

### schemas

• `Optional` **schemas**: `Record`\<`string`, [`OpenApiSchema`](../modules/openapi.md#openapischema)\>

An object to hold reusable Schema Objects.

___

### securitySchemes

• `Optional` **securitySchemes**: `Record`\<`string`, [`OpenApiSecurityScheme`](openapi.OpenApiSecurityScheme.md)\>

An object to hold reusable Security Scheme Objects.
