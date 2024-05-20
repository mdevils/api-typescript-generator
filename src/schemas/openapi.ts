import * as R from 'ramda';
import {
    OpenApiInfo,
    OpenApiExample,
    OpenApiExternalDocumentation,
    OpenApiParameter,
    OpenApiSchema,
    OpenApiServer
} from './common';

/**
 * Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object
 * will have no effect on the API unless they are explicitly referenced from properties outside the components object.
 *
 * @see https://swagger.io/specification/#components-object
 */
export interface OpenApiComponents {
    /**
     * An object to hold reusable Schema Objects.
     */
    schemas?: Record<string, OpenApiSchema>;
    /**
     * An object to hold reusable Response Objects.
     */
    responses?: Record<string, OpenApiResponse>;
    /**
     * An object to hold reusable Parameter Objects.
     */
    parameters?: Record<string, OpenApiParameter>;
    /**
     * An object to hold reusable Example Objects.
     */
    examples?: Record<string, OpenApiExample>;
    /**
     * An object to hold reusable Request Body Objects.
     */
    requestBodies?: Record<string, OpenApiRequestBody>;
    /**
     * An object to hold reusable Header Objects.
     */
    headers?: Record<string, OpenApiHeader>;
    /**
     * An object to hold reusable Security Scheme Objects.
     */
    securitySchemes?: Record<string, OpenApiSecurityScheme>;
    /**
     * An object to hold reusable Link Objects.
     */
    links?: Record<string, OpenApiLink>;
    /**
     * An object to hold reusable Callback Objects.
     */
    callbacks?: Record<string, Record<string, OpenApiPathItem>>;
    /**
     * An object to hold reusable Path Item Objects.
     */
    pathItems?: Record<string, OpenApiPathItem>;
}

/**
 * OpenAPI 3.1.0 document
 *
 * @see https://swagger.io/specification/#openapi-object
 */
export interface OpenApiDocument {
    /**
     * This string MUST be the semantic version number of the OpenAPI Specification version that the OpenAPI document
     * uses.
     */
    openapi: string;
    /**
     * Provides metadata about the API. The metadata MAY be used by the clients if needed.
     */
    info: OpenApiInfo;
    /**
     * The default value for the $schema keyword within Schema Objects contained within this OAS document. This MUST be
     * in the form of a URI.
     */
    jsonSchemaDialect?: string;
    /**
     * An array of Server Objects, which provide connectivity information to a target server. If the servers property is
     * not provided, or is an empty array, the default value would be a Server Object with an url value of /.
     */
    servers?: OpenApiServer[];
    /**
     * The available paths and operations for the API.
     */
    paths?: OpenApiPaths;
    /**
     * He incoming webhooks that MAY be received as part of this API and that the API consumer MAY choose to implement.
     * Closely related to the callbacks feature, this section describes requests initiated other than by an API call,
     * for example by an out-of-band registration. The key name is a unique string to refer to each webhook, while the
     * (optionally referenced) Path Item Object describes a request that may be initiated by the API provider and the
     * expected responses.
     */
    webhooks?: Record<string, OpenApiPathItem>;
    /**
     * An element to hold various schemas for the specification.
     */
    components?: OpenApiComponents;
    /**
     * A declaration of which security mechanisms can be used across the API. The list of values includes alternative
     * security requirement objects that can be used. Only one of the security requirement objects need to be satisfied
     * to authorize a request. Individual operations can override this definition. To make security optional, an empty
     * security requirement ({}) can be included in the array.
     */
    security?: Record<string, string[]>;
    /**
     * A list of tags used by the document with additional metadata. The order of the tags can be used to reflect on
     * their order by the parsing tools. Not all tags that are used by the Operation Object must be declared. The tags
     * that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be
     * unique.
     */
    tags?: OpenApiTag[];
    /**
     * Additional external documentation.
     */
    externalDocs?: OpenApiExternalDocumentation;
}
/**
 * OpenAPI Header Object.
 */
export type OpenApiHeader = Omit<OpenApiParameter, 'name' | 'in'>;

/**
 * OpenAPI Link Object.
 */
export interface OpenApiLink {
    /**
     * A relative or absolute URI reference to an OAS operation. This field is mutually exclusive of the operationId
     * field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing
     * Operation Object in the OpenAPI definition.
     */
    operationRef?: string;
    /**
     * The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually
     * exclusive of the operationRef field.
     */
    operationId?: string;
    /**
     * A map representing parameters to pass to an operation as specified with operationId or identified via
     * operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to
     * be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location
     * [{in}.]{name} for operations that use the same parameter name in different locations (e.g. path.id).
     */
    parameters?: Record<string, unknown>;
    /**
     * A literal value or {expression} to use as a request body when calling the target operation.
     */
    requestBody?: unknown;
    /**
     * A description of the link. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
    /**
     * A server object to be used by the target operation.
     */
    server?: OpenApiServer;
}

/**
 * OpenAPI Security Scheme Object.
 *
 * @see https://swagger.io/specification/#security-scheme-object
 */
export interface OpenApiSecurityScheme {
    /**
     * The type of the security scheme. Valid values are "apiKey", "http", "oauth2", "openIdConnect".
     */
    type: 'apiKey' | 'http' | 'mutualTLS' | 'oauth2' | 'openIdConnect';
    /**
     * A short description for security scheme.
     */
    description?: string;
    /**
     * The name of the header, query or cookie parameter to be used.
     */
    name?: string;
    /**
     * The location of the API key. Valid values are "query", "header" or "cookie".
     */
    in?: 'query' | 'header' | 'cookie';
    /**
     * The name of the HTTP Authorization scheme to be used in the Authorization header as defined in RFC7235.
     */
    scheme?: string;
    /**
     * A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an
     * authorization server, so this information is primarily for documentation purposes.
     */
    bearerFormat?: string;
    /**
     * An object containing configuration information for the flow types supported.
     */
    flows?: OpenApiOAuthFlows;
    /**
     * OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL.
     */
    openIdConnectUrl?: string;
}

/**
 * OpenAPI OAuth Flow Object.
 *
 * @see https://swagger.io/specification/#oauth-flows-object
 */
export interface OpenApiOAuthFlows {
    /**
     * Configuration for the OAuth Implicit flow.
     */
    implicit?: OpenApiOAuthFlow;
    /**
     * Configuration for the OAuth Resource Owner Password flow.
     */
    password?: OpenApiOAuthFlow;
    /**
     * Configuration for the OAuth Client Credentials flow. Previously called application in OpenAPI 2.0.
     */
    clientCredentials?: OpenApiOAuthFlow;
    /**
     * Configuration for the OAuth Authorization Code flow. Previously called accessCode in OpenAPI 2.0.
     */
    authorizationCode?: OpenApiOAuthFlow;
}

/**
 * OpenAPI OAuth Flow Object.
 *
 * @see https://swagger.io/specification/#oauth-flow-object
 */
export interface OpenApiOAuthFlow {
    /**
     * The authorization URL to be used for this flow. This MUST be in the form of a URL.
     */
    authorizationUrl: string;
    /**
     * The token URL to be used for this flow. This MUST be in the form of a URL.
     */
    tokenUrl: string;
    /**
     * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.
     */
    refreshUrl?: string;
    /**
     * The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it.
     */
    scopes: Record<string, string>;
}

export function isOpenApiDocument(document: unknown): document is OpenApiDocument {
    return typeof document === 'object' && document !== null && 'openapi' in document;
}

/**
 * List of HTTP methods defined by OpenAPI.
 */
export const openApiHttpMethods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const;

/**
 * OpenAPI HTTP method.
 */
export type OpenApiHttpMethod = (typeof openApiHttpMethods)[number];

/**
 * Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the
 * Server Object in order to construct the full URL. The Paths MAY be empty, due to Access Control List (ACL)
 * constraints.
 *
 * @see https://swagger.io/specification/#paths-object
 */
export type OpenApiPaths = Record<string, OpenApiPathItem>;

/**
 * Describes the operations available on a single path. A Path Item MAY be empty, due to ACL constraints. The path
 * itself is still exposed to the documentation viewer but they will not know which operations and parameters are
 * available.
 *
 * @see https://swagger.io/specification/#path-item-object
 */
export type OpenApiPathItem = {
    /**
     * An optional, string summary, intended to apply to all operations in this path.
     */
    summary?: string;
    /**
     * An optional, string description, intended to apply to all operations in this path. CommonMark syntax MAY be used
     * for rich text representation.
     */
    description?: string;
    /**
     * A list of parameters that are applicable for all the operations described under this path. These parameters can
     * be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated
     * parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference
     * Object to link to parameters that are defined at the OpenAPI Object's components/parameters.
     */
    parameters?: OpenApiParameter[];
    /**
     * An alternative server array to service all operations in this path.
     */
    servers?: OpenApiServer[];
} & {[K in OpenApiHttpMethod]?: OpenApiOperation};

/**
 * Each Media Type Object provides schema and examples for the media type identified by its key.
 *
 * @see https://swagger.io/specification/#media-type-object
 */
export interface OpenApiMediaType {
    /**
     * The schema defining the content of the request, response, or parameter.
     */
    schema?: OpenApiSchema;
    /**
     * Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The
     * example field is mutually exclusive of the examples field. Furthermore, if referencing a schema which contains an
     * example, the example value SHALL override the example provided by the schema.
     */
    example?: unknown;
    /**
     * Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The
     * examples field is mutually exclusive of the example field. Furthermore, if referencing a schema which contains an
     * example, the examples value SHALL override the example provided by the schema.
     */
    examples?: Record<string, OpenApiExample>;
    /**
     * A map between a property name and its encoding information. The key, being the property name, MUST exist in the
     * schema as a property. The encoding object SHALL only apply to requestBody objects when the media type is
     * multipart or application/x-www-form-urlencoded.
     */
    encoding?: Record<string, OpenApiEncoding>;
}

/**
 * A single encoding definition applied to a single schema property.
 *
 * @see https://swagger.io/specification/#encoding-object
 */
export interface OpenApiEncoding {
    /**
     * The Content-Type for encoding a specific property.
     */
    contentType?: string;
    /**
     * A map allowing additional information to be provided as headers, for example Content-Disposition. Content-Type is
     * described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body
     * media type is not a multipart.
     */
    headers?: Record<string, OpenApiHeader>;
    /**
     * Describes how a specific property value will be serialized depending on its type.
     */
    style?: 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
    /**
     * When this is true, property values of type array or object generate separate parameters for each value of the
     * array, or key-value pair of the map. For other types of properties this property has no effect. When style is
     * form, the default value is true. For all other styles, the default value is false.
     */
    explode?: boolean;
    /**
     * Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986.
     */
    allowReserved?: boolean;
}

/**
 * Describes a single request body.
 *
 * @see https://swagger.io/specification/#request-body-object
 */
export interface OpenApiRequestBody {
    /**
     * A brief description of the request body. This could contain examples of use. CommonMark syntax MAY be used for
     */
    description?: string;
    /**
     * The content of the request body. The key is a media type or media type range and the value describes it. For
     * requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
     */
    content: Record<string, OpenApiMediaType>;
    /**
     * Determines if the request body is required in the request. Defaults to false.
     */
    required?: boolean;
}

/**
 * Describes a single response from an API Operation, including design-time, static links to operations based on the
 * response.
 *
 * @see https://swagger.io/specification/#response-object
 */
export interface OpenApiResponse {
    /**
     * A short description of the response. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
    /**
     * Maps a header name to its definition. RFC7230 states header names are case-insensitive. If a response header is
     * defined with the name "Content-Type", it SHALL be ignored.
     */
    headers?: Record<string, OpenApiHeader>;
    /**
     * A map containing descriptions of potential response payloads. The key is a media type or media type range and the
     * value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g.
     * text/plain overrides text/*
     */
    content?: Record<string, OpenApiMediaType>;
    /**
     * A map of operations links that can be followed from the response. The key of the map is a short name for the link
     * following the naming constraints of the names for Component Objects.
     */
    links?: Record<string, OpenApiLink>;
}

/**
 * Describes a single API operation on a path.
 *
 * @see https://swagger.io/specification/#operation-object
 */
export interface OpenApiOperation {
    /**
     * A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or
     * any other qualifier.
     */
    tags?: string[];
    /**
     * A short summary of what the operation does.
     */
    summary?: string;
    /**
     * A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
    /**
     * Additional external documentation for this operation.
     */
    externalDocs?: OpenApiExternalDocumentation;
    /**
     * Unique string used to identify the operation. The id MUST be unique among all operations described in the API.
     * The operationId value is case-sensitive. Tools and libraries MAY use the operationId to uniquely identify an
     * operation, therefore, it is RECOMMENDED to follow common programming naming conventions.
     */
    operationId?: string;
    /**
     * A list of parameters that are applicable for this operation. If a parameter is already defined at the Path Item,
     * the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A
     * unique parameter is defined by a combination of a name and location. The list can use the Reference Object to
     * link to parameters that are defined at the OpenAPI Object's components/parameters.
     */
    parameters?: OpenApiParameter[];
    /**
     * The request body applicable for this operation. The requestBody is only supported in HTTP methods where the HTTP
     * 1.1 specification RFC7231 has explicitly defined semantics for request bodies. In other cases where the HTTP spec
     * is vague, requestBody SHALL be ignored by consumers.
     */
    requestBody?: OpenApiRequestBody;
    /**
     * The list of possible responses as they are returned from executing this operation.
     */
    responses?: Record<string, OpenApiResponse>;
    /**
     * A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the
     * Callback Object. Each value in the map is a Callback Object that describes a request that may be initiated.
     */
    callbacks?: Record<string, OpenApiPathItem>;
    /**
     * Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default
     * value is false.
     */
    deprecated?: boolean;
    /**
     * A declaration of which security mechanisms can be used for this operation. The list of values includes
     * alternative security requirement objects that can be used. Only one of the security requirement objects need to
     * be satisfied to authorize a request. This definition overrides any declared top-level security. To remove a
     * top-level security declaration, an empty array can be used.
     */
    security?: Record<string, string[]>;
    /**
     * An alternative server array to service this operation. If an alternative server object is specified at the Path
     * Item Object or Root level, it will be overridden by this value.
     */
    servers?: OpenApiServer[];
}

/**
 * Adds metadata to a single tag that is used by the Operation Object. It is not mandatory to have a Tag Object per tag
 * defined in the Operation Object instances.
 *
 * @see https://swagger.io/specification/#tag-object
 */
export interface OpenApiTag {
    /**
     * The name of the tag.
     */
    name: string;
    /**
     * A short description for the tag. CommonMark syntax MAY be used for rich text representation.
     */
    description?: string;
    /**
     * Additional external documentation for this tag.
     */
    externalDocs?: OpenApiExternalDocumentation;
}

export function processOpenApiDocument(document: unknown): OpenApiDocument {
    const openApiDocument = R.clone(document) as OpenApiDocument;
    if (openApiDocument.components && openApiDocument.components.schemas) {
        for (const [name, schema] of Object.entries(openApiDocument.components.schemas)) {
            if (typeof schema !== 'boolean') {
                schema.name = name;
            }
        }
    }
    if (openApiDocument.paths) {
        for (const path of Object.values(openApiDocument.paths)) {
            if (path.parameters) {
                for (const method of openApiHttpMethods) {
                    const operation = path[method];
                    if (operation) {
                        operation.parameters = (operation.parameters ?? []).concat(path.parameters);
                    }
                }
            }
        }
    }

    return openApiDocument;
}
