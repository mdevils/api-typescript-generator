import {OpenApiClientGeneratorConfig} from './openapi-to-typescript-client';
import {OpenApiSchema} from '../schemas/common';
import {
    OpenApiDocument,
    OpenApiHttpMethod,
    OpenApiOperation,
    OpenApiPathItem,
    OpenApiPaths,
    OpenApiTag
} from '../schemas/openapi';

/**
 * Source of the API to generate TypeScript types from. Can be a file or a URL. Supports both YAML and JSON.
 */
export type CommonApiToTypescriptGeneratorSource =
    | {
          type: 'file';
          /**
           * Path to the file.
           */
          path: string;
      }
    | {
          type: 'url';
          /**
           * URL to the file.
           */
          url: string;
      };

/**
 * Codegeneration configuration for the `api-to-typescript` generator.
 */
export interface ApiTypescriptGeneratorConfig {
    /**
     * List of generation sources and targets.
     */
    generates: (OpenApiClientGeneratorConfig & CommonOpenApiClientGeneratorConfig)[];
}

/**
 * Callback to patch a schema.
 *
 * @param schema The schema to patch.
 * @param schemaName The name of the schema.
 */
export type OpenApiDocumentPatchSchema = (schema: OpenApiSchema, schemaName: string) => OpenApiSchema;

/**
 * Callback to patch all schemas.
 *
 * @param schemas The schemas to patch.
 */
export type OpenApiDocumentPatchAllSchemas = (schemas: {[schemaName: string]: OpenApiSchema}) => {
    [schemaName: string]: OpenApiSchema;
};

/**
 * Callback to patch an operation.
 *
 * @param operation The operation to patch.
 * @param path The path of the operation.
 * @param method The method of the operation.
 */
export type OpenApiDocumentPatchOperation = (
    operation: OpenApiOperation,
    path: string,
    httpMethod: OpenApiHttpMethod
) => OpenApiOperation;
/**
 * Callback to patch a path item.
 *
 * @param pathItem The path item to patch.
 * @param path The path of the path item.
 */
export type OpenApiDocumentPatchPathItem = (pathItem: OpenApiPathItem, path: string) => OpenApiPathItem;
/**
 * Callback to patch tags.
 *
 * @param tags The tags to patch.
 */
export type OpenApiDocumentPatchTags = (tags: OpenApiTag[]) => OpenApiTag[];
/**
 * Callback to patch the whole OpenAPI document. Applies after all other patches.
 *
 * @param document The OpenAPI document to patch.
 */
export type OpenApiDocumentPatchDocument = (document: OpenApiDocument) => OpenApiDocument;

/**
 * Configuration to patch an OpenAPI document.
 */
export interface CommonOpenApiClientGeneratorConfigDocumentPatch {
    /**
     * Patches for schemas.
     */
    patchSchemas?: {[schemaName: string]: OpenApiDocumentPatchSchema} | OpenApiDocumentPatchAllSchemas;
    /**
     * Patches for paths.
     */
    patchPaths?:
        | {
              [path: string]:
                  | {[method in OpenApiHttpMethod]?: OpenApiDocumentPatchOperation}
                  | OpenApiDocumentPatchPathItem;
          }
        | ((paths: OpenApiPaths) => OpenApiPaths);
    /**
     * Patches for tags.
     */
    patchTags?: OpenApiDocumentPatchTags;
    /**
     * Patch for the whole document.
     */
    patchDocument?: OpenApiDocumentPatchDocument;
}

/**
 * Configuration for the input document for the OpenAPI client generator.
 */
export interface CommonOpenApiClientGeneratorConfigDocument {
    /**
     * Source of the OpenAPI document.
     */
    source: CommonApiToTypescriptGeneratorSource;
    /**
     * Patches to be applied to the OpenAPI document.
     */
    patch?: CommonOpenApiClientGeneratorConfigDocumentPatch;
}

/**
 * Common configuration for the API client generators.
 */
export interface CommonOpenApiClientGeneratorConfig {
    document: CommonOpenApiClientGeneratorConfigDocument;
    outputDirPath: string;
}

export interface ClientGenerationResult {
    files: ClientGenerationResultFile[];
}

export interface ClientGenerationResultFile {
    filename: string;
    data: string;
}
