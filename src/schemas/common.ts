/**
 * JSON Schema primitive types.
 */
export type OpenApiPrimitiveTypes = 'null' | 'number' | 'integer' | 'string' | 'boolean';

/**
 * Available JSON Schema formats.
 */
export type OpenApiFormats =
    | 'int32'
    | 'int64'
    | 'float'
    | 'double'
    | 'byte'
    | 'binary'
    | 'date'
    | 'date-time'
    | 'password'
    | 'email';

/**
 * Describes a single operation parameter. A unique parameter is defined by a combination of a name and location.
 *
 * @see https://swagger.io/specification/#parameter-object
 */
export interface OpenApiParameter {
    /**
     * The name of the parameter. Parameter names are case sensitive.
     *
     * - If in is "path", the name field MUST correspond to a template expression occurring within the path field in the
     *   Paths Object. See Path Templating for further information.
     * - If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition
     *   SHALL be ignored.
     * - For all other cases, the name corresponds to the parameter name used by the in property.
     */
    name: string;
    /**
     * The location of the parameter. Possible values are "query", "header", "path" or "cookie".
     */
    in: 'query' | 'header' | 'path' | 'cookie';
    /**
     * A brief description of the parameter. This could contain examples of use. CommonMark syntax MAY be used for rich
     * text representation.
     */
    description?: string;
    /**
     * Determines whether this parameter is mandatory. If the parameter location is "path", this property is REQUIRED
     * and its value MUST be true. Otherwise, the property MAY be included and its default value is false.
     */
    required?: boolean;
    /**
     * Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.
     */
    deprecated?: boolean;
    /**
     * Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a
     * parameter with an empty value.
     */
    allowEmptyValue?: boolean;
    /**
     * Describes how the parameter value will be serialized depending on the type of the parameter value. Default values
     * (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form.
     */
    style?: 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
    /**
     * When this is true, parameter values of type array or object generate separate parameters for each value of the
     * array or key-value pair of the map. For other types of parameters this property has no effect. When style is
     * form, the default value is true. For all other styles, the default value is false.
     */
    explode?: boolean;
    /**
     * Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986.
     */
    allowReserved?: boolean;
    /**
     * The schema defining the type used for the parameter.
     */
    schema?: OpenApiSchema;
    /**
     * Example of the parameter's potential value. The example SHOULD match the specified schema and encoding properties
     * if present. The example field is mutually exclusive of the examples field. Furthermore, if referencing a schema
     * which contains an example, the example value SHALL override the example provided by the schema.
     */
    example?: unknown;
    /**
     * Examples of the parameter's potential value. Each example SHOULD contain a value in the correct format as
     * specified in the parameter encoding. The examples field is mutually exclusive of the example field. Furthermore,
     * if referencing a schema which contains an example, the examples value SHALL override the example provided by the
     * schema.
     */
    examples?: Record<string, OpenApiExample>;
}

/**
 * The license information for the exposed API.
 *
 * @see https://swagger.io/specification/#contact-object
 */
export interface OpenApiContact {
    /**
     * The identifying name of the contact person/organization.
     */
    name?: string;
    /**
     * The URL pointing to the contact information. MUST be in the format of a URL.
     */
    url?: string;
    /**
     * The email address of the contact person/organization. MUST be in the format of an email address.
     */
    email?: string;
}

/**
 * The license information for the exposed API.
 *
 * @see https://swagger.io/specification/#license-object
 */
export interface OpenApiLicense {
    /**
     * The license name used for the API.
     */
    name: string;
    /**
     * An SPDX license expression for the API. The identifier field is mutually exclusive of the url field.
     */
    identifier?: string;
    /**
     * A URL to the license used for the API. MUST be in the format of a URL.
     */
    url?: string;
}

/**
 * The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented
 * in editing or documentation generation tools for convenience.
 *
 * @see https://swagger.io/specification/#info-object
 */
export interface OpenApiInfo {
    /**
     * The title of the API.
     */
    title: string;
    /**
     * A short summary of the API.
     */
    summary?: string;
    /**
     * A description of the API. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
    /**
     * A URL to the Terms of Service for the API. MUST be in the format of a URL.
     */
    termsOfService?: string;
    /**
     * The contact information for the exposed API.
     */
    contact?: OpenApiContact;
    /**
     * The license information for the exposed API.
     */
    license?: OpenApiLicense;
    /**
     * The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API
     * implementation version).
     */
    version: string;
}

/**
 * The OpenAPI server variable.
 *
 * @see https://swagger.io/specification/#server-variable-object
 */
export interface OpenApiServerVariable {
    /**
     * An enumeration of string values to be used if the substitution options are from a limited set.
     */
    enum?: string[];
    /**
     * The default value to use for substitution, which SHALL be sent if an alternate value is not supplied.
     */
    default: string;
    /**
     * An optional description for the server variable. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
}

/**
 * The OpenAPI server object.
 *
 * @see https://swagger.io/specification/#server-object
 */
export interface OpenApiServer {
    /**
     * A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host
     * location is relative to the location where the OpenAPI document is being served. Variable substitutions will be
     * made when a variable is named in {brackets}.
     */
    url: string;
    /**
     * An optional string describing the host designated by the URL. CommonMark syntax MAY be used for rich text
     * representation.
     */
    description?: string;
    /**
     * A map between a variable name and its value. The value is used for substitution in the server's URL template.
     */
    variables?: Record<string, OpenApiServerVariable>;
}

/**
 * Allows referencing an external resource for extended documentation.
 *
 * @see https://swagger.io/specification/#external-documentation-object
 */
export interface OpenApiExternalDocumentation {
    /**
     * A short description of the target documentation. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
    /**
     * The URL for the target documentation. Value MUST be in the format of a URL.
     */
    url: string;
}

/**
 * An example for a particular OpenAPI entity (i.e. parameter, schema, etc.).
 *
 * @see https://swagger.io/specification/#example-object
 */
export interface OpenApiExample {
    /**
     * Embedded literal example. The value field and externalValue field are mutually exclusive. To represent examples
     * of media types that cannot naturally be represented in JSON or YAML, use a string value to contain the example,
     * escaping where necessary.
     */
    value: unknown;
    /**
     * Short description for the example.
     */
    summary?: string;
    /**
     * Long description for the example. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
    /**
     * A URL that points to the literal example. This provides the capability to reference examples that cannot easily
     * be included in JSON or YAML documents. The value field and externalValue field are mutually exclusive.
     */
    externalValue?: string;
}

export type OpenApiSchemaPrimitiveValue = string | number | boolean | null;

/**
 * The OpenAPI schema.
 */
export type OpenApiSchema = true | false | OpenApiExpandedSchema;

/**
 * The OpenAPI schema with all properties expanded (without "true" and "false" shortcuts).
 */
export interface OpenApiExpandedSchema {
    nullable?: boolean;
    type?: OpenApiPrimitiveTypes | OpenApiPrimitiveTypes[] | 'object' | 'array';
    format?: OpenApiFormats;

    // --- string ---
    /**
     * The minimum length of the string.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/string#length
     */
    minLength?: number;
    /**
     * The maximum length of the string.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/string#length
     */
    maxLength?: number;
    /**
     * The RegEx pattern the string must match.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/string#regexp
     */
    pattern?: string;

    // --- number, integer ---
    /**
     * The minimum value of the number.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/numeric#range
     */
    minimum?: number;
    /**
     * The maximum value of the number.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/numeric#range
     */
    maximum?: number;
    /**
     * The number must have a higher value than the given value.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/numeric#range
     */
    exclusiveMinimum?: number;
    /**
     * The number must have a lower value than the given value.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/numeric#range
     */
    exclusiveMaximum?: number;
    /**
     * The number must be a multiple of the given value.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/numeric#multiples
     */
    multipleOf?: number;

    // --- object ---
    /**
     * The schema of the properties of the object.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/object#properties
     */
    properties?: Record<string, OpenApiSchema>;
    /**
     * The required properties of the object.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/object#required
     */
    required?: string[];
    /**
     * The schema of the additional properties of the object.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/object#additionalproperties
     */
    additionalProperties?: OpenApiSchema;
    /**
     * The schema of the properties of the object that match the pattern.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/object#patternProperties
     */
    patternProperties?: Record<string, OpenApiSchema>;
    /**
     * Minimum number of properties in the object.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/object#size
     */
    minProperties?: number;
    /**
     * Maximum number of properties in the object.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/object#size
     */
    maxProperties?: number;

    // --- array ---
    /**
     * The schema of the items in the array.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/array#items
     */
    items?: OpenApiSchema;
    /**
     * The minimum number of items in the array.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/array#length
     */
    minItems?: number;
    /**
     * The maximum number of items in the array.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/array#length
     */
    maxItems?: number;
    /**
     * Whether the items in the array must be unique.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/array#uniqueItems
     */
    uniqueItems?: boolean;
    /**
     * The schema to check if array has specific items.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/array#contains
     */
    contains?: OpenApiSchema;
    /**
     * The minimum number of items in the array that must be valid against the `contains` schema.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/array#mincontains-maxcontains
     */
    minContains?: number;
    /**
     * The maximum number of items in the array that must be valid against the `contains` schema.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/array#mincontains-maxcontains
     */
    maxContains?: number;
    /**
     * The schema to check if array has specific items at the beginning.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/array#tupleValidation
     */
    prefixItems?: OpenApiSchema[];

    // --- constant values ---
    /**
     * The value must be exactly the given value.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/const
     */
    const?: OpenApiSchemaPrimitiveValue;
    /**
     * The value must be one of the given values.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/enum
     */
    enum?: OpenApiSchemaPrimitiveValue[];

    // --- composition ---
    /**
     * (XOR) Must be valid against exactly one of the subschemas.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/combining#oneOf
     */
    oneOf?: OpenApiSchema[];
    /**
     * (OR) Must be valid against any of the subschemas.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/combining#anyOf
     */
    anyOf?: OpenApiSchema[];
    /**
     * (AND) Must be valid against all of the subschemas.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/combining#allOf
     */
    allOf?: OpenApiSchema[];
    /**
     * (NOT) Must not be valid against the given schema.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/combining#not
     */
    not?: OpenApiSchema;
    /**
     * A discriminator for polymorphism.
     *
     * @see https://swagger.io/specification/#composition-and-inheritance-polymorphism
     */
    discriminator?: {
        propertyName: string;
        mapping?: Record<string, string>;
    };

    // --- annotations ---
    /**
     * A comment to describe the schema.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/comments#comments
     */
    $comment?: string;

    /**
     * A title to describe the schema.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/annotations
     */
    title?: string;
    /**
     * A description to describe the schema.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/annotations
     */
    description?: string;
    /**
     * A default value for the schema.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/annotations
     */
    default?: unknown;
    /**
     * An example for the schema.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/annotations
     */
    example?: unknown;
    /**
     * Examples for the schema.
     *
     * @see https://swagger.io/specification/#example-object
     */
    examples?: Record<string, OpenApiExample>;
    /**
     * Whether the schema is deprecated.
     *
     * @see https://json-schema.org/understanding-json-schema/reference/annotations
     */
    deprecated?: boolean;
    /**
     * A reference to an external documentation.
     *
     * @see https://swagger.io/specification/#external-documentation-object
     */
    externalDocumentation?: OpenApiExternalDocumentation;

    // --- specific to api-typescript-generator ---
    /**
     * The name of the schema. Used for TypeScript generation.
     */
    name?: string;
}

export function extendSchema(base: OpenApiSchema, extension: OpenApiSchema): OpenApiSchema {
    if (extension === true || base === true) {
        return true;
    }
    if (extension === false || base === false) {
        return false;
    }
    const result = Object.assign({}, base, extension);
    if (base.properties && extension.properties) {
        result.properties = {...base.properties, ...extension.properties};
    }
    if (base.required && extension.required) {
        result.required = base.required.concat(extension.required);
    }
    if (base.additionalProperties && extension.additionalProperties) {
        result.additionalProperties = extendSchema(base.additionalProperties, extension.additionalProperties);
    }
    if (base.examples && extension.examples) {
        result.examples = {...base.examples, ...extension.examples};
    }
    if (base.externalDocumentation && extension.externalDocumentation) {
        result.externalDocumentation = {...base.externalDocumentation, ...extension.externalDocumentation};
    }
    return result;
}

interface Ref {
    $ref: string;
}

export function resolveDocumentReferences<T>(document: T): T {
    const alreadyResolved = new Set<unknown>();

    function queryDocument(path: string): unknown {
        let current = document as unknown;
        for (const pathBit of path.split('/')) {
            current = (current as Record<string, unknown>)[pathBit];
            if (current === undefined) {
                throw new Error(`Could not find schema object by path "${path}".`);
            }
        }
        return current;
    }

    function resolveReferences(obj: unknown): unknown {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        const ref = (obj as Ref).$ref;
        if (ref) {
            if (!ref.startsWith('#/')) {
                throw new Error(`Could not resolve reference ${JSON.stringify(ref)}. Only local refs are supported.`);
            }
            return queryDocument(ref.slice(2));
        }
        if (alreadyResolved.has(obj)) {
            return obj;
        }
        alreadyResolved.add(obj);
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                obj[i] = resolveReferences(obj[i]);
            }
        }
        for (const [key, value] of Object.entries(obj)) {
            (obj as Record<string, unknown>)[key] = resolveReferences(value);
        }
        return obj;
    }

    return resolveReferences(document) as T;
}
