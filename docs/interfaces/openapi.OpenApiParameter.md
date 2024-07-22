[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi](../modules/openapi.md) / OpenApiParameter

# Interface: OpenApiParameter

[openapi](../modules/openapi.md).OpenApiParameter

Describes a single operation parameter. A unique parameter is defined by a combination of a name and location.

**`See`**

https://swagger.io/specification/#parameter-object

## Table of contents

### Properties

- [allowEmptyValue](openapi.OpenApiParameter.md#allowemptyvalue)
- [allowReserved](openapi.OpenApiParameter.md#allowreserved)
- [deprecated](openapi.OpenApiParameter.md#deprecated)
- [description](openapi.OpenApiParameter.md#description)
- [example](openapi.OpenApiParameter.md#example)
- [examples](openapi.OpenApiParameter.md#examples)
- [explode](openapi.OpenApiParameter.md#explode)
- [in](openapi.OpenApiParameter.md#in)
- [name](openapi.OpenApiParameter.md#name)
- [required](openapi.OpenApiParameter.md#required)
- [schema](openapi.OpenApiParameter.md#schema)
- [style](openapi.OpenApiParameter.md#style)

## Properties

### allowEmptyValue

• `Optional` **allowEmptyValue**: `boolean`

Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a
parameter with an empty value.

___

### allowReserved

• `Optional` **allowReserved**: `boolean`

Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986.

___

### deprecated

• `Optional` **deprecated**: `boolean`

Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.

___

### description

• `Optional` **description**: `string`

A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich
text representation.

___

### example

• `Optional` **example**: `unknown`

Example of the parameter's potential value. The example SHOULD match the specified schema and encoding properties
if present. The example field is mutually exclusive of the examples field. Furthermore, if referencing a schema
which contains an example, the example value SHALL override the example provided by the schema.

___

### examples

• `Optional` **examples**: `Record`\<`string`, [`OpenApiExample`](openapi.OpenApiExample.md)\>

Examples of the parameter's potential value. Each example SHOULD contain a value in the correct format as
specified in the parameter encoding. The examples field is mutually exclusive of the example field. Furthermore,
if referencing a schema which contains an example, the examples value SHALL override the example provided by the
schema.

___

### explode

• `Optional` **explode**: `boolean`

When this is true, parameter values of type array or object generate separate parameters for each value of the
array or key-value pair of the map. For other types of parameters this property has no effect. When style is
form, the default value is true. For all other styles, the default value is false.

___

### in

• **in**: [`OpenApiParameterIn`](../modules/openapi.md#openapiparameterin)

The location of the parameter. Possible values are "query", "header", "path" or "cookie".

___

### name

• **name**: `string`

The name of the parameter. Parameter names are case sensitive.

- If in is "path", the name field MUST correspond to a template expression occurring within the path field in the
  Paths Object. See Path Templating for further information.
- If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition
  SHALL be ignored.
- For all other cases, the name corresponds to the parameter name used by the in property.

___

### required

• `Optional` **required**: `boolean`

Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED
and its value MUST be true. Otherwise, the property MAY be included and its default value is false.

___

### schema

• `Optional` **schema**: [`OpenApiSchema`](../modules/openapi.md#openapischema)

The schema defining the type used for the parameter.

___

### style

• `Optional` **style**: [`OpenApiParameterStyle`](../modules/openapi.md#openapiparameterstyle)

Describes how the parameter value will be serialized depending on the type of the parameter value. Default values
(based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.
