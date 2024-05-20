[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiExpandedSchema

# Interface: OpenApiExpandedSchema

[openapi](../modules/openapi.md).OpenApiExpandedSchema

The OpenAPI schema with all properties expanded (without "true" and "false" shortcuts).

## Table of contents

### Properties

- [$comment](openapi.OpenApiExpandedSchema.md#$comment)
- [additionalProperties](openapi.OpenApiExpandedSchema.md#additionalproperties)
- [allOf](openapi.OpenApiExpandedSchema.md#allof)
- [anyOf](openapi.OpenApiExpandedSchema.md#anyof)
- [const](openapi.OpenApiExpandedSchema.md#const)
- [contains](openapi.OpenApiExpandedSchema.md#contains)
- [default](openapi.OpenApiExpandedSchema.md#default)
- [deprecated](openapi.OpenApiExpandedSchema.md#deprecated)
- [description](openapi.OpenApiExpandedSchema.md#description)
- [discriminator](openapi.OpenApiExpandedSchema.md#discriminator)
- [enum](openapi.OpenApiExpandedSchema.md#enum)
- [example](openapi.OpenApiExpandedSchema.md#example)
- [examples](openapi.OpenApiExpandedSchema.md#examples)
- [exclusiveMaximum](openapi.OpenApiExpandedSchema.md#exclusivemaximum)
- [exclusiveMinimum](openapi.OpenApiExpandedSchema.md#exclusiveminimum)
- [externalDocumentation](openapi.OpenApiExpandedSchema.md#externaldocumentation)
- [format](openapi.OpenApiExpandedSchema.md#format)
- [items](openapi.OpenApiExpandedSchema.md#items)
- [maxContains](openapi.OpenApiExpandedSchema.md#maxcontains)
- [maxItems](openapi.OpenApiExpandedSchema.md#maxitems)
- [maxLength](openapi.OpenApiExpandedSchema.md#maxlength)
- [maxProperties](openapi.OpenApiExpandedSchema.md#maxproperties)
- [maximum](openapi.OpenApiExpandedSchema.md#maximum)
- [minContains](openapi.OpenApiExpandedSchema.md#mincontains)
- [minItems](openapi.OpenApiExpandedSchema.md#minitems)
- [minLength](openapi.OpenApiExpandedSchema.md#minlength)
- [minProperties](openapi.OpenApiExpandedSchema.md#minproperties)
- [minimum](openapi.OpenApiExpandedSchema.md#minimum)
- [multipleOf](openapi.OpenApiExpandedSchema.md#multipleof)
- [name](openapi.OpenApiExpandedSchema.md#name)
- [not](openapi.OpenApiExpandedSchema.md#not)
- [nullable](openapi.OpenApiExpandedSchema.md#nullable)
- [oneOf](openapi.OpenApiExpandedSchema.md#oneof)
- [pattern](openapi.OpenApiExpandedSchema.md#pattern)
- [patternProperties](openapi.OpenApiExpandedSchema.md#patternproperties)
- [prefixItems](openapi.OpenApiExpandedSchema.md#prefixitems)
- [properties](openapi.OpenApiExpandedSchema.md#properties)
- [required](openapi.OpenApiExpandedSchema.md#required)
- [title](openapi.OpenApiExpandedSchema.md#title)
- [type](openapi.OpenApiExpandedSchema.md#type)
- [uniqueItems](openapi.OpenApiExpandedSchema.md#uniqueitems)

## Properties

### $comment

• `Optional` **$comment**: `string`

A comment to describe the schema.

**`See`**

https://json-schema.org/understanding-json-schema/reference/comments#comments

___

### additionalProperties

• `Optional` **additionalProperties**: [`OpenApiSchema`](../modules/openapi.md#openapischema)

The schema of the additional properties of the object.

**`See`**

https://json-schema.org/understanding-json-schema/reference/object#additionalproperties

___

### allOf

• `Optional` **allOf**: [`OpenApiSchema`](../modules/openapi.md#openapischema)[]

(AND) Must be valid against all of the subschemas.

**`See`**

https://json-schema.org/understanding-json-schema/reference/combining#allOf

___

### anyOf

• `Optional` **anyOf**: [`OpenApiSchema`](../modules/openapi.md#openapischema)[]

(OR) Must be valid against any of the subschemas.

**`See`**

https://json-schema.org/understanding-json-schema/reference/combining#anyOf

___

### const

• `Optional` **const**: [`OpenApiSchemaPrimitiveValue`](../modules/openapi.md#openapischemaprimitivevalue)

The value must be exactly the given value.

**`See`**

https://json-schema.org/understanding-json-schema/reference/const

___

### contains

• `Optional` **contains**: [`OpenApiSchema`](../modules/openapi.md#openapischema)

The schema to check if array has specific items.

**`See`**

https://json-schema.org/understanding-json-schema/reference/array#contains

___

### default

• `Optional` **default**: `unknown`

A default value for the schema.

**`See`**

https://json-schema.org/understanding-json-schema/reference/annotations

___

### deprecated

• `Optional` **deprecated**: `boolean`

Whether the schema is deprecated.

**`See`**

https://json-schema.org/understanding-json-schema/reference/annotations

___

### description

• `Optional` **description**: `string`

A description to describe the schema.

**`See`**

https://json-schema.org/understanding-json-schema/reference/annotations

___

### discriminator

• `Optional` **discriminator**: `Object`

A discriminator for polymorphism.

**`See`**

https://swagger.io/specification/#composition-and-inheritance-polymorphism

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mapping?` | `Record`\<`string`, `string`\> |
| `propertyName` | `string` |

___

### enum

• `Optional` **enum**: [`OpenApiSchemaPrimitiveValue`](../modules/openapi.md#openapischemaprimitivevalue)[]

The value must be one of the given values.

**`See`**

https://json-schema.org/understanding-json-schema/reference/enum

___

### example

• `Optional` **example**: `unknown`

An example for the schema.

**`See`**

https://json-schema.org/understanding-json-schema/reference/annotations

___

### examples

• `Optional` **examples**: `Record`\<`string`, [`OpenApiExample`](openapi.OpenApiExample.md)\>

Examples for the schema.

**`See`**

https://swagger.io/specification/#example-object

___

### exclusiveMaximum

• `Optional` **exclusiveMaximum**: `number`

The number must have a lower value than the given value.

**`See`**

https://json-schema.org/understanding-json-schema/reference/numeric#range

___

### exclusiveMinimum

• `Optional` **exclusiveMinimum**: `number`

The number must have a higher value than the given value.

**`See`**

https://json-schema.org/understanding-json-schema/reference/numeric#range

___

### externalDocumentation

• `Optional` **externalDocumentation**: [`OpenApiExternalDocumentation`](openapi.OpenApiExternalDocumentation.md)

A reference to an external documentation.

**`See`**

https://swagger.io/specification/#external-documentation-object

___

### format

• `Optional` **format**: [`OpenApiFormats`](../modules/openapi.md#openapiformats)

___

### items

• `Optional` **items**: [`OpenApiSchema`](../modules/openapi.md#openapischema)

The schema of the items in the array.

**`See`**

https://json-schema.org/understanding-json-schema/reference/array#items

___

### maxContains

• `Optional` **maxContains**: `number`

The maximum number of items in the array that must be valid against the `contains` schema.

**`See`**

https://json-schema.org/understanding-json-schema/reference/array#mincontains-maxcontains

___

### maxItems

• `Optional` **maxItems**: `number`

The maximum number of items in the array.

**`See`**

https://json-schema.org/understanding-json-schema/reference/array#length

___

### maxLength

• `Optional` **maxLength**: `number`

The maximum length of the string.

**`See`**

https://json-schema.org/understanding-json-schema/reference/string#length

___

### maxProperties

• `Optional` **maxProperties**: `number`

Maximum number of properties in the object.

**`See`**

https://json-schema.org/understanding-json-schema/reference/object#size

___

### maximum

• `Optional` **maximum**: `number`

The maximum value of the number.

**`See`**

https://json-schema.org/understanding-json-schema/reference/numeric#range

___

### minContains

• `Optional` **minContains**: `number`

The minimum number of items in the array that must be valid against the `contains` schema.

**`See`**

https://json-schema.org/understanding-json-schema/reference/array#mincontains-maxcontains

___

### minItems

• `Optional` **minItems**: `number`

The minimum number of items in the array.

**`See`**

https://json-schema.org/understanding-json-schema/reference/array#length

___

### minLength

• `Optional` **minLength**: `number`

The minimum length of the string.

**`See`**

https://json-schema.org/understanding-json-schema/reference/string#length

___

### minProperties

• `Optional` **minProperties**: `number`

Minimum number of properties in the object.

**`See`**

https://json-schema.org/understanding-json-schema/reference/object#size

___

### minimum

• `Optional` **minimum**: `number`

The minimum value of the number.

**`See`**

https://json-schema.org/understanding-json-schema/reference/numeric#range

___

### multipleOf

• `Optional` **multipleOf**: `number`

The number must be a multiple of the given value.

**`See`**

https://json-schema.org/understanding-json-schema/reference/numeric#multiples

___

### name

• `Optional` **name**: `string`

The name of the schema. Used for TypeScript generation.

___

### not

• `Optional` **not**: [`OpenApiSchema`](../modules/openapi.md#openapischema)

(NOT) Must not be valid against the given schema.

**`See`**

https://json-schema.org/understanding-json-schema/reference/combining#not

___

### nullable

• `Optional` **nullable**: `boolean`

___

### oneOf

• `Optional` **oneOf**: [`OpenApiSchema`](../modules/openapi.md#openapischema)[]

(XOR) Must be valid against exactly one of the subschemas.

**`See`**

https://json-schema.org/understanding-json-schema/reference/combining#oneOf

___

### pattern

• `Optional` **pattern**: `string`

The RegEx pattern the string must match.

**`See`**

https://json-schema.org/understanding-json-schema/reference/string#regexp

___

### patternProperties

• `Optional` **patternProperties**: `Record`\<`string`, [`OpenApiSchema`](../modules/openapi.md#openapischema)\>

The schema of the properties of the object that match the pattern.

**`See`**

https://json-schema.org/understanding-json-schema/reference/object#patternProperties

___

### prefixItems

• `Optional` **prefixItems**: [`OpenApiSchema`](../modules/openapi.md#openapischema)[]

The schema to check if array has specific items at the beginning.

**`See`**

https://json-schema.org/understanding-json-schema/reference/array#tupleValidation

___

### properties

• `Optional` **properties**: `Record`\<`string`, [`OpenApiSchema`](../modules/openapi.md#openapischema)\>

The schema of the properties of the object.

**`See`**

https://json-schema.org/understanding-json-schema/reference/object#properties

___

### required

• `Optional` **required**: `string`[]

The required properties of the object.

**`See`**

https://json-schema.org/understanding-json-schema/reference/object#required

___

### title

• `Optional` **title**: `string`

A title to describe the schema.

**`See`**

https://json-schema.org/understanding-json-schema/reference/annotations

___

### type

• `Optional` **type**: ``"object"`` \| [`OpenApiPrimitiveTypes`](../modules/openapi.md#openapiprimitivetypes) \| [`OpenApiPrimitiveTypes`](../modules/openapi.md#openapiprimitivetypes)[] \| ``"array"``

___

### uniqueItems

• `Optional` **uniqueItems**: `boolean`

Whether the items in the array must be unique.

**`See`**

https://json-schema.org/understanding-json-schema/reference/array#uniqueItems
