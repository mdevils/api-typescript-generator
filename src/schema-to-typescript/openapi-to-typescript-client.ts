import {generateClient} from './common/client';
import {
    generateCommonHttpClient,
    generateCommonHttpService,
    generateCommonValidationSchemaStorage
} from './common/client-core';
import {generateModels} from './common/models';
import {GeneratedServices, generateServices} from './common/services';
import {ValidationProvider} from './common/validation-providers/validation-provider';
import {ZodValidationProvider} from './common/validation-providers/zod-validation-provider';
import {generateValidationSchemaStorage} from './common/validation-schema-storage';
import {ClientGenerationResult, ClientGenerationResultFile, CommonOpenApiClientGeneratorConfig} from './config';
import {OpenApiInfo, OpenApiParameter, OpenApiSchema} from '../schemas/common';
import {
    OpenApiDocument,
    OpenApiMediaType,
    OpenApiOperation,
    OpenApiPathItem,
    OpenApiPaths,
    OpenApiRequestBody,
    OpenApiTag
} from '../schemas/openapi';
import {JsDocBlock} from '../utils/jsdoc';
import {FilenameFormat} from '../utils/string-utils';
import {extractTags} from '../utils/tags';

/**
 * Callback for generating the JSDoc of a service.
 *
 * @example
 *     function generateServiceJsDoc({suggestedJsDoc, tag}) {
 *         return {
 *             ...suggestedJsDoc,
 *             tags: [...suggestedJsDoc.tags, {name: 'tag', value: tag.name}]
 *         };
 *     }
 */
export type GenerateServiceJsDoc = (params: {
    /**
     * Suggested JSDoc block. Used by default if the callback is not specified.
     */
    suggestedJsDoc: JsDocBlock;
    /**
     * Tag of the service. The service contains all operations with the same tag.
     *
     * @see https://swagger.io/specification/#tag-object
     */
    tag: OpenApiTag;
    /**
     * Name of the service.
     */
    serviceName: string;
    /**
     * OpenAPI Paths Object.
     *
     * @see https://swagger.io/specification/#paths-object
     */
    paths: OpenApiPaths;
}) => JsDocBlock;

/**
 * Callback for generating the name of a service.
 *
 * @example
 *     function generateServiceName({tag}) {
 *         return tag.name.replace(/[^a-zA-Z0-9]/g, '') + 'Service';
 *     }
 */
export type GenerateServiceName = (params: {
    /**
     * Suggested name of the service. Used by default if the callback is not specified.
     */
    suggestedName: string;
    /**
     * Tag of the service. The service contains all operations with the same tag.
     *
     * @see https://swagger.io/specification/#tag-object
     */
    tag: OpenApiTag;
    /**
     * OpenAPI Paths Object.
     *
     * @see https://swagger.io/specification/#paths-object
     */
    paths: OpenApiPaths;
}) => string;

/**
 * Callback for generating the name of an operation.
 *
 * @example
 *     function generateOperationName({operation, httpMethod}) {
 *         return `${httpMethod}_${operation.operationId}`;
 *     }
 */
export type GenerateOperationName = (params: {
    /**
     * Suggested name of the operation. Used by default if the callback is not specified.
     */
    suggestedName: string;
    /**
     * OpenAPI Operation Object.
     *
     * @see https://swagger.io/specification/#operation-object
     */
    operation: OpenApiOperation;
    /**
     * HTTP method of the operation. I.e. `get`.
     */
    httpMethod: string;
    /**
     * OpenAPI Path Item Object.
     *
     * @see https://swagger.io/specification/#path-item-object
     */
    pathItem: OpenApiPathItem;
    /**
     * Path of the operation. I.e. `/orders/{orderId}`.
     */
    path: string;
    /**
     * Name of the service.
     */
    serviceName?: string;
}) => string;

/**
 * Callback for generating the JSDoc of an operation.
 *
 * @example
 *     function generateOperationJsDoc({suggestedJsDoc, path, httpMethod}) {
 *         return {
 *             ...suggestedJsDoc,
 *             tags: [...suggestedJsDoc.tags, {name: 'path', value: `{${httpMethod}} ${path}`}]
 *         };
 *     }
 */
export type GenerateOperationJsDoc = (params: {
    /**
     * Suggested JSDoc block. Used by default if the callback is not specified.
     */
    suggestedJsDoc: JsDocBlock;
    /**
     * OpenAPI Operation Object.
     *
     * @see https://swagger.io/specification/#operation-object
     */
    operation: OpenApiOperation;
    /**
     * HTTP method of the operation. I.e. `get`.
     */
    httpMethod: string;
    /**
     * OpenAPI Path Item Object.
     *
     * @see https://swagger.io/specification/#path-item-object
     */
    pathItem: OpenApiPathItem;
    /**
     * Path of the operation. I.e. `/orders/{orderId}`.
     */
    path: string;
    /**
     * Name of the service.
     */
    serviceName?: string;
}) => JsDocBlock;

/**
 * Callback for generating the name of an operation parameter argument.
 *
 * @example
 *     function generateOperationParameterArgumentName({parameter}) {
 *         return parameter.in + '_' + parameter.name;
 *     }
 */
export type GenerateOperationParameterArgumentName = (params: {
    /**
     * Suggested name of the argument. Used by default if the callback is not specified.
     */
    suggestedName: string;
    /**
     * OpenAPI Parameter Object.
     *
     * @see https://swagger.io/specification/#parameter-object
     */
    parameter: OpenApiParameter;
    /**
     * OpenAPI Operation Object.
     *
     * @see https://swagger.io/specification/#operation-object
     */
    operation: OpenApiOperation;
    /**
     * HTTP method of the operation. I.e. `get`.
     */
    httpMethod: string;
    /**
     * OpenAPI Path Item Object.
     *
     * @see https://swagger.io/specification/#path-item-object
     */
    pathItem: OpenApiPathItem;
    /**
     * Path of the operation. I.e. `/orders/{orderId}`.
     */
    path: string;
    /**
     * Generated class method name for the operation.
     */
    operationName: string;
    /**
     * Name of the service.
     */
    serviceName?: string;
}) => string;

/**
 * Callback for generating the JSDoc of an operation parameter argument.
 *
 * @example
 *     function generateOperationParameterJsDoc({suggestedJsDoc, parameter}) {
 *         return {
 *             ...suggestedJsDoc,
 *             tags: [
 *                 ...suggestedJsDoc.tags,
 *                 {name: 'name', value: parameter.name},
 *                 {name: 'location', value: parameter.in}
 *             ]
 *         };
 *     }
 */
export type GenerateOperationParameterJsDoc = (params: {
    /**
     * Suggested JSDoc block. Used by default if the callback is not specified.
     */
    suggestedJsDoc: JsDocBlock;
    /**
     * OpenAPI Parameter Object.
     *
     * @see https://swagger.io/specification/#parameter-object
     */
    parameter: OpenApiParameter;
    /**
     * OpenAPI Operation Object.
     *
     * @see https://swagger.io/specification/#operation-object
     */
    operation: OpenApiOperation;
    /**
     * HTTP method of the operation. I.e. `get`.
     */
    httpMethod: string;
    /**
     * OpenAPI Path Item Object.
     *
     * @see https://swagger.io/specification/#path-item-object
     */
    pathItem: OpenApiPathItem;
    /**
     * Path of the operation. I.e. `/orders/{orderId}`.
     */
    path: string;
    /**
     * Generated class method name for the operation.
     */
    operationName: string;
    /**
     * Name of the service.
     */
    serviceName?: string;
}) => JsDocBlock;

/**
 * Callback for generating the name of an operation request body argument.
 *
 * @example
 *     function generateOperationRequestBodyArgumentName({suggestedName}) {
 *         return suggestedName + 'RequestBody';
 *     }
 */
export type GenerateOperationRequestBodyArgumentName = (params: {
    /**
     * Suggested name of the argument. Used by default if the callback is not specified.
     */
    suggestedName: string;
    /**
     * OpenAPI Request Body Object.
     *
     * @see https://swagger.io/specification/#request-body-object
     */
    requestBody: OpenApiRequestBody;
    /**
     * OpenAPI Media Type Object.
     *
     * @see https://swagger.io/specification/#media-type-object
     */
    content: OpenApiMediaType;
    /**
     * Media type of the request body. I.e. `application/json`.
     */
    mediaType: string;
    /**
     * OpenAPI Operation Object.
     *
     * @see https://swagger.io/specification/#operation-object
     */
    operation: OpenApiOperation;
    /**
     * HTTP method of the operation. I.e. `get`.
     */
    httpMethod: string;
    /**
     * OpenAPI Path Item Object.
     *
     * @see https://swagger.io/specification/#path-item-object
     */
    pathItem: OpenApiPathItem;
    /**
     * Path of the operation. I.e. `/orders/{orderId}`.
     */
    path: string;
    /**
     * Generated class method name for the operation.
     */
    operationName: string;
    /**
     * Name of the service.
     */
    serviceName?: string;
}) => string;

/**
 * Callback for generating the JSDoc of an operation request body argument.
 *
 * @example
 *     function generateOperationRequestBodyJsDoc({suggestedJsDoc, mediaType}) {
 *         return {
 *             ...suggestedJsDoc,
 *             tags: [...suggestedJsDoc.tags, {name: 'mediaType', value: mediaType}]
 *         };
 *     }
 */
export type GenerateOperationRequestBodyJsDoc = (params: {
    /**
     * Suggested JSDoc block. Used by default if the callback is not specified.
     */
    suggestedJsDoc: JsDocBlock;
    /**
     * OpenAPI Request Body Object.
     *
     * @see https://swagger.io/specification/#request-body-object
     */
    requestBody: OpenApiRequestBody;
    /**
     * OpenAPI Media Type Object.
     *
     * @see https://swagger.io/specification/#media-type-object
     */
    content: OpenApiMediaType;
    /**
     * Media type of the request body. I.e. `application/json`.
     */
    mediaType: string;
    /**
     * OpenAPI Operation Object.
     *
     * @see https://swagger.io/specification/#operation-object
     */
    operation: OpenApiOperation;
    /**
     * HTTP method of the operation. I.e. `get`.
     */
    httpMethod: string;
    /**
     * OpenAPI Path Item Object.
     *
     * @see https://swagger.io/specification/#path-item-object
     */
    pathItem: OpenApiPathItem;
    /**
     * Path of the operation. I.e. `/orders/{orderId}`.
     */
    path: string;
    /**
     * Generated class method name for the operation.
     */
    operationName: string;
    /**
     * Name of the service.
     */
    serviceName?: string;
}) => JsDocBlock;

/**
 * Callback for generating the description of an operation result.
 *
 * @example
 *     function generateOperationResultDescription({suggestedDescription, serviceName}) {
 *         return suggestedDescription + ' for ' + serviceName + ' service.';
 *     }
 */
export type GenerateOperationResultDescription = (params: {
    /**
     * Suggested description. Used by default if the callback is not specified.
     */
    suggestedDescription: string;
    /**
     * OpenAPI Operation Object.
     *
     * @see https://swagger.io/specification/#operation-object
     */
    operation: OpenApiOperation;
    /**
     * HTTP method of the operation. I.e. `get`.
     */
    httpMethod: string;
    /**
     * OpenAPI Path Item Object.
     *
     * @see https://swagger.io/specification/#path-item-object
     */
    pathItem: OpenApiPathItem;
    /**
     * Path of the operation. I.e. `/orders/{orderId}`.
     */
    path: string;
    /**
     * Name of the service.
     */
    serviceName?: string;
}) => string;

/**
 * Callback for generating the JSDoc of a model.
 *
 * @example
 *     function generateModelJsDoc({suggestedJsDoc, schemaName, fieldPath}) {
 *         if (fieldPath.length === 0) {
 *             return {
 *                 title: schemaName,
 *                 ...suggestedJsDoc
 *             };
 *         } else {
 *             return suggestedJsDoc;
 *         }
 *     }
 */
export type GenerateModelJsDoc = (params: {
    /**
     * Suggested JSDoc block. Used by default if the callback is not specified.
     */
    suggestedJsDoc: JsDocBlock;
    /**
     * OpenAPISchema of the model schema (if fieldPath is empty) or the field schema.
     */
    schema: OpenApiSchema;
    /**
     * Name of the schema.
     */
    schemaName: string;
    /**
     * Path to the field in the schema. Empty if the schema is a model schema.
     */
    fieldPath: string[];
}) => JsDocBlock;

/**
 * Callback for generating the name of a model.
 *
 * @example
 *     function generateModelName({suggestedName, schemaName, fieldPath}) {
 *         if (fieldPath.length === 0) {
 *             return schemaName + 'Model';
 *         } else {
 *             return suggestedName;
 *         }
 *     }
 */
export type GenerateModelNameCallback = (context: {
    /**
     * Suggested name of the model. Used by default if the callback is not specified.
     */
    suggestedName: string;
    /**
     * OpenAPI Schema name.
     */
    schemaName: string;
}) => string;

/**
 * Callback for generating the JSDoc of a client.
 *
 * @example
 *     function generateClientJsDoc({suggestedJsDoc, info}) {
 *         return {
 *             title: info.summary,
 *             description: info.description,
 *             tags: [{name: 'version', value: info.version}]
 *         };
 *     }
 */
export type GenerateClientJsDoc = (params: {
    /**
     * Suggested JSDoc block. Used by default if the callback is not specified.
     */
    suggestedJsDoc: JsDocBlock;
    /**
     * OpenAPI Info Object.
     */
    info: OpenApiInfo;
}) => JsDocBlock;

/**
 * What needs to be imported from the external source.
 */
export type OpenApiClientExternalValueSourceImportEntity = {name: string} | 'default';

/**
 * Custom value source for the OpenAPI client generation customization.
 */
export interface OpenApiClientExternalValueSource {
    /**
     * Import path of the source.
     */
    importPath: string;
    /**
     * Import name of the source.
     */
    import: OpenApiClientExternalValueSourceImportEntity;
}

/**
 * Custom value/type for the OpenAPI client generation customization.
 */
export interface OpenApiClientExternalValue {
    /**
     * Fully qualified name of the import. Example: `MyType` or `[namespace, MyType]`.
     */
    name: string | string[];
    /**
     * Source of the import.
     */
    source?: OpenApiClientExternalValueSource;
}

/**
 * Custom type for the OpenAPI client generation customization.
 */
export interface OpenApiClientExternalType extends OpenApiClientExternalValue {
    /**
     * Type parameters of the type. I.e. `T` in `Promise<T>`.
     */
    typeParameters?: OpenApiClientExternalType[];
}

/**
 * Built-in binary types for the OpenAPI client generation.
 */
export type OpenApiClientBuiltinBinaryType =
    /**
     * Standard Blob.
     *
     * Supported in modern browsers and node.js starting from v15.7.0.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Blob
     */
    | 'blob'
    /**
     * Standard readable stream of binary data.
     *
     * Supported in modern browsers and node.js starting from v16.5.0.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
     */
    | 'readableStream';

/**
 * Customizable binary type for the OpenAPI client generation.
 */
export type OpenApiClientCustomizableBinaryType = OpenApiClientBuiltinBinaryType | OpenApiClientExternalType;

/**
 * Configuration for generating operation calls.
 */
export interface OpenApiClientGeneratorConfigOperations {
    /**
     * Operation name generation callback.
     */
    generateOperationName?: GenerateOperationName;
    /**
     * Operation JSDoc generation callback.
     */
    generateOperationJsDoc?: GenerateOperationJsDoc;
    /**
     * Operation result description generation callback.
     */
    generateOperationResultDescription?: GenerateOperationResultDescription;
    /**
     * Operation parameter argument name generation callback.
     */
    generateOperationParameterArgumentName?: GenerateOperationParameterArgumentName;
    /**
     * Operation parameter JSDoc generation callback.
     */
    generateOperationParameterJsDoc?: GenerateOperationParameterJsDoc;
    /**
     * Operation request body argument name generation callback.
     */
    generateOperationRequestBodyArgumentName?: GenerateOperationRequestBodyArgumentName;
    /**
     * Operation request body JSDoc generation callback.
     */
    generateOperationRequestBodyJsDoc?: GenerateOperationRequestBodyJsDoc;
    /**
     * Argument name for the media type.
     *
     * @default 'mediaType'
     */
    mediaTypeArgumentName?: string;
    /**
     * Whether to validate the response. In order to use this feature, the validation configuration must be set.
     *
     * @default false
     */
    validateResponse?: boolean;
    /**
     * Whether to make the response validation schemas extensible. If set to `true`, the response validation schemas
     * will accept previously unknown fields. This is useful when the API is expected to change over time.
     *
     * @default false
     */
    makeResponseValidationSchemasExtensible?: boolean;
    /**
     * Binary response/request type. Used when the response is not a JSON value.
     *
     * @default 'blob'
     */
    responseBinaryType?: OpenApiClientBuiltinBinaryType;
}

/**
 * Configuration for generating the client.
 */
export interface OpenApiClientGeneratorConfigClient {
    /**
     * Name of the client class. Probably the only required field in the configuration. Example: `MyApiClient`.
     */
    name: string;
    /**
     * URL of the API server. Used as the base URL for the client. Example: `https://api.example.com`. Taken from
     * OpenAPI document if not set.
     */
    baseUrl?: string;
    /**
     * Name of the class for http and other errors. Example: `MyApiClientError`.
     */
    errorClassName?: string;
    /**
     * Filename of the client class.
     */
    filename?: string;
    /**
     * Filename format for the client class. Ignored if `filename` is set.
     *
     * @default {filenameCase: 'kebabCase'}
     */
    filenameFormat?: FilenameFormat;
    /**
     * Relative directory path for the client class.
     *
     * @default './'
     */
    relativeDirPath?: string;
    /**
     * Whether to include services in the client.
     *
     * - `all`: Include all services.
     * - `none`: Do not include any services.
     * - `{tags: string[]}`: Include services with the specified tags.
     *
     * @default 'all'
     */
    includeServices?:
        | 'all'
        | 'none'
        | {
              tags: string[];
          };
    /**
     * Whether to export services from the client file.
     *
     * @default false
     */
    exportServices?: boolean;
    /**
     * Whether to export models from the client file.
     *
     * @default false
     */
    exportModels?: boolean;
    /**
     * Client JSDoc generation callback.
     */
    generateJsDoc?: GenerateClientJsDoc;
}

/**
 * Configuration for generating services.
 */
export interface OpenApiClientGeneratorConfigServices {
    /**
     * Filename format for the services. Ignored if `filename` is set.
     *
     * @default {
     *     postfix: '-service',
     *     filenameCase: 'kebabCase'
     * }
     */
    filenameFormat?: FilenameFormat;
    /**
     * Relative directory path for the services.
     *
     * @default 'services'
     */
    relativeDirPath?: string;
    /**
     * Service name generation callback.
     */
    generateName?: GenerateServiceName;
    /**
     * Service JSDoc generation callback.
     */
    generateJsDoc?: GenerateServiceJsDoc;
    /**
     * Whether to remove non-generated service files from the services directory. If set to `true`, generator will
     * remove all files in the services directory that are not generated by the generator.
     *
     * @default false
     */
    cleanupFiles?: boolean;
}

/**
 * Configuration for generating models.
 */
export interface OpenApiClientGeneratorConfigModels {
    /**
     * Filename format for the models.
     *
     * @default {filenameCase: 'kebabCase'}
     */
    filenameFormat?: FilenameFormat;
    /**
     * Relative directory path for the models.
     *
     * @default 'models'
     */
    relativeDirPath?: string;
    /**
     * Models are divided into files based on the application scope. The scope is determined by tags of the operations
     * which use the model. If a model is used by operations with different tags, it will be placed in a file with the
     * default scope.
     *
     * @default 'common'
     */
    defaultScope?: string;
    /**
     * Model JSDoc generation callback. Generates JSDoc both for the model and its fields.
     */
    generateJsDoc?: GenerateModelJsDoc;
    /**
     * Model name generation callback.
     */
    generateName?: GenerateModelNameCallback;
    /**
     * Whether to remove non-generated model files from the models directory. If set to `true`, generator will remove
     * all files in the models directory that are not generated by the generator.
     *
     * @default false
     */
    cleanupFiles?: boolean;
}

/**
 * Configuration for the core classes.
 */
export interface OpenApiClientGeneratorConfigCore {
    /**
     * Filename format for the core classes.
     *
     * @default {filenameCase: 'kebabCase'}
     */
    filenameFormat?: FilenameFormat;
    /**
     * Relative directory path for the core classes.
     *
     * @default 'core'
     */
    relativeDirPath?: string;
    /**
     * Whether to remove non-generated core files from the core directory. If set to `true`, generator will remove all
     * files in the core directory that are not generated by the generator.
     *
     * @default false
     */
    cleanupFiles?: boolean;
}

/**
 * Configuration for the validation schema storage.
 */
export interface OpenApiClientGeneratorConfigValidationSchemaStorage {
    /**
     * Filename format for the validation schema storage. Ignored if `filename` is set.
     *
     * @default {filenameCase: 'kebabCase'}
     */
    filenameFormat?: FilenameFormat;
    /**
     * Filename of the validation schema storage.
     */
    filename?: string;
    /**
     * Relative directory path for the validation schema storage.
     *
     * @default './'
     */
    relativeDirPath?: string;
    /**
     * Name of the export in the validation schema storage file.
     *
     * @default 'validationSchemaStorage'
     */
    exportName?: string;
}

/**
 * Configuration for the validation.
 */
export interface OpenApiClientGeneratorConfigValidation {
    /**
     * Validation library to use. Currently only Zod is supported.
     *
     * @see https://github.com/colinhacks/zod
     */
    library: 'zod';
    /**
     * Configuration for the validation schema storage.
     */
    validationSchemaStorage?: OpenApiClientGeneratorConfigValidationSchemaStorage;
}

/**
 * Configuration for JSDoc word wrap.
 */
export interface OpenApiClientGeneratorConfigJsDocWordWrap {
    /**
     * Maximum line length for JSDoc word wrap.
     *
     * @default 80
     */
    lineLength?: number;
}

/**
 * Configuration for JSDoc generation.
 */
export interface OpenApiClientGeneratorConfigJsDoc {
    /**
     * Whether to word wrap JSDoc comments.
     */
    wordWrap?: OpenApiClientGeneratorConfigJsDocWordWrap | false;
}

/**
 * Configuration for additional comments.
 */
export interface OpenApiClientGeneratorConfigComments {
    /**
     * Comment to prepend to the generated files. This can be used to add a "Do not edit" warning, "Generated by"
     * message or a license.
     */
    leadingComment?: string;
    /**
     * Comment to append to the generated files.
     */
    trailingComment?: string;
}

/**
 * Configuration for generating an OpenAPI client.
 */
export interface OpenApiClientGeneratorConfig extends CommonOpenApiClientGeneratorConfig {
    type: 'openapiClient';
    /**
     * Configuration for generating operation calls.
     */
    operations?: OpenApiClientGeneratorConfigOperations;
    /**
     * Configuration for generating the client. If set to `false`, the client will not be generated.
     */
    client: OpenApiClientGeneratorConfigClient | false;
    /**
     * Configuration for generating services. If set to `false`, services will not be generated. Services are generated
     * based on the tags of the operations.
     */
    services?: OpenApiClientGeneratorConfigServices | false;
    /**
     * Configuration for generating models.
     */
    models?: OpenApiClientGeneratorConfigModels;
    /**
     * Configuration for generating core classes. Core classes are classes that are used by the generated client and
     * services. e.g. HTTP client, HTTP service, Generic Validation schema storage (if validation is enabled).
     */
    core?: OpenApiClientGeneratorConfigCore;
    /**
     * Configuration for request/response validation.
     */
    validation?: OpenApiClientGeneratorConfigValidation;
    /**
     * List of accepted binary types as input.
     *
     * @default ['blob', 'readableStream']
     */
    binaryTypes?: OpenApiClientCustomizableBinaryType[];
    /**
     * Configuration for JSDoc generation.
     */
    jsDoc?: OpenApiClientGeneratorConfigJsDoc;
    /**
     * Configuration for additional comments.
     */
    comments?: OpenApiClientGeneratorConfigComments;
}

export interface OpenApiClientValidationContext {
    validationProvider: ValidationProvider;
    validationSchemaStorageImportPath: string;
    validationSchemaStorageImportName: string;
}

const validationProviders = {
    zod: new ZodValidationProvider()
};

export async function openapiToTypescriptClient({
    document,
    generateConfig
}: {
    document: OpenApiDocument;
    generateConfig: OpenApiClientGeneratorConfig;
}): Promise<ClientGenerationResult> {
    const extractedTags =
        generateConfig.services !== false
            ? extractTags(document)
            : {taggedPaths: {}, rest: {...document.paths}, tags: {}};

    const files: ClientGenerationResultFile[] = [];
    const [commonHttpClient, commonHttpService, commonValidationSchemaStorage] = await Promise.all([
        generateCommonHttpClient(generateConfig.core, generateConfig.comments),
        generateCommonHttpService(generateConfig.core, generateConfig.comments),
        generateConfig.validation
            ? generateCommonValidationSchemaStorage(generateConfig.core, generateConfig.comments)
            : undefined
    ]);

    let validationContext: OpenApiClientValidationContext | undefined;
    if (generateConfig.validation && commonValidationSchemaStorage) {
        const validationProvider = validationProviders[generateConfig.validation.library];
        const validationSchemaStorage = await generateValidationSchemaStorage({
            commonValidationSchemaStorage: commonValidationSchemaStorage,
            validationProvider,
            validationConfig: generateConfig.validation!,
            commentsConfig: generateConfig.comments
        });
        files.push(validationSchemaStorage.file);
        validationContext = {
            validationProvider,
            validationSchemaStorageImportName: validationSchemaStorage.importName,
            validationSchemaStorageImportPath: validationSchemaStorage.importPath
        };
    }

    const binaryTypes = generateConfig.binaryTypes ?? ['blob', 'readableStream'];

    const generatedModels = generateModels({
        extractedTags,
        validationContext,
        modelsConfig: generateConfig.models,
        commonValidationSchemaStorage,
        binaryTypes,
        jsDocRenderConfig: generateConfig.jsDoc,
        commentsConfig: generateConfig.comments
    });

    files.push(commonHttpClient.file, commonHttpService.file);
    if (commonValidationSchemaStorage) {
        files.push(commonValidationSchemaStorage.file);
    }
    files.push(...generatedModels.files);

    const getModelData = (schemaName: string) => {
        const modelData = generatedModels.modelsIndex[schemaName];
        if (!modelData) {
            throw new Error(`Could not find corresponding model for schema "${schemaName}".`);
        }
        return modelData;
    };

    let generatedServices: GeneratedServices | undefined;
    if (generateConfig.services !== false) {
        generatedServices = generateServices({
            taggedPaths: extractedTags.taggedPaths,
            tags: extractedTags.tags,
            servicesConfig: generateConfig.services,
            commonHttpClientImportPath: commonHttpClient.importPath,
            commonHttpServiceImportPath: commonHttpService.importPath,
            commonHttpServiceClassName: commonHttpService.className,
            operationsConfig: generateConfig.operations,
            getModelData,
            validationContext,
            binaryTypes,
            jsDocRenderConfig: generateConfig.jsDoc,
            commentsConfig: generateConfig.comments
        });
        files.push(...generatedServices.files);
    }

    if (generateConfig.client !== false) {
        files.push(
            generateClient({
                commonHttpClientClassName: commonHttpClient.className,
                commonHttpClientClassOptionsName: commonHttpClient.classOptionsName,
                commonHttpClientErrorClassName: commonHttpClient.errorClassName,
                commonHttpClientImportPath: commonHttpClient.importPath,
                commonHttpServiceImportPath: commonHttpService.importPath,
                commonHttpServiceClassName: commonHttpService.className,
                clientConfig: generateConfig.client,
                generatedServiceImports: generatedServices ? generatedServices.services : [],
                servers: document.servers ?? [],
                info: document.info,
                paths: extractedTags.rest,
                operationsConfig: generateConfig.operations,
                getModelData,
                modelImportInfos: Object.values(generatedModels.modelsIndex),
                validationContext,
                responseBinaryType: generateConfig.operations?.responseBinaryType ?? 'blob',
                binaryTypes,
                jsDocRenderConfig: generateConfig.jsDoc,
                commentsConfig: generateConfig.comments
            })
        );
    }

    return {files};
}
