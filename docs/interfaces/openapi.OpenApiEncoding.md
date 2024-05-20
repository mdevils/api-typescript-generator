[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiEncoding

# Interface: OpenApiEncoding

[openapi](../modules/openapi.md).OpenApiEncoding

A single encoding definition applied to a single schema property.

**`See`**

https://swagger.io/specification/#encoding-object

## Table of contents

### Properties

- [allowReserved](openapi.OpenApiEncoding.md#allowreserved)
- [contentType](openapi.OpenApiEncoding.md#contenttype)
- [explode](openapi.OpenApiEncoding.md#explode)
- [headers](openapi.OpenApiEncoding.md#headers)
- [style](openapi.OpenApiEncoding.md#style)

## Properties

### allowReserved

• `Optional` **allowReserved**: `boolean`

Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986.

___

### contentType

• `Optional` **contentType**: `string`

The Content-Type for encoding a specific property.

___

### explode

• `Optional` **explode**: `boolean`

When this is true, property values of type array or object generate separate parameters for each value of the
array, or key-value pair of the map. For other types of properties this property has no effect. When style is
form, the default value is true. For all other styles, the default value is false.

___

### headers

• `Optional` **headers**: `Record`\<`string`, [`OpenApiHeader`](../modules/openapi.md#openapiheader)\>

A map allowing additional information to be provided as headers, for example Content-Disposition. Content-Type is
described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body
media type is not a multipart.

___

### style

• `Optional` **style**: ``"matrix"`` \| ``"label"`` \| ``"form"`` \| ``"simple"`` \| ``"spaceDelimited"`` \| ``"pipeDelimited"`` \| ``"deepObject"``

Describes how a specific property value will be serialized depending on its type.
