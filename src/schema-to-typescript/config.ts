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
      }
    | {
          type: 'object';
          /**
           * OpenAPI schema as an object.
           */
          object: unknown;
      }
    | {
          type: 'string';
          /**
           * OpenAPI schema as a string.
           */
          data: string;
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
export type OpenApiDocumentPatchSchema = (
    schema: OpenApiSchema,
    schemaName: string
) => OpenApiSchema | Promise<OpenApiSchema>;

/**
 * Callback to patch all schemas.
 *
 * @param schemas The schemas to patch.
 */
export type OpenApiDocumentPatchAllSchemas = (schemas: {[schemaName: string]: OpenApiSchema}) =>
    | {
          [schemaName: string]: OpenApiSchema;
      }
    | Promise<{
          [schemaName: string]: OpenApiSchema;
      }>;

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
) => OpenApiOperation | Promise<OpenApiOperation>;
/**
 * Callback to patch a path item.
 *
 * @param pathItem The path item to patch.
 * @param path The path of the path item.
 */
export type OpenApiDocumentPatchPathItem = (
    pathItem: OpenApiPathItem,
    path: string
) => OpenApiPathItem | Promise<OpenApiPathItem>;
/**
 * Callback to patch tags.
 *
 * @param tags The tags to patch.
 */
export type OpenApiDocumentPatchTags = (tags: OpenApiTag[]) => OpenApiTag[] | Promise<OpenApiTag[]>;
/**
 * Callback to patch the whole OpenAPI document. Applies after all other patches.
 *
 * @param document The OpenAPI document to patch.
 */
export type OpenApiDocumentPatchDocument = (document: OpenApiDocument) => OpenApiDocument | Promise<OpenApiDocument>;

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
 * Configuration for postprocessing the generated files.
 */
export interface CommonOpenApiClientGeneratorConfigPostprocess {
    /**
     * If true, runs ESLint on the generated files.
     */
    eslint?: boolean;
}

/**
 * Common configuration for the API client generators.
 */
export interface CommonOpenApiClientGeneratorConfig {
    /**
     * Configuration for the OpenAPI document.
     */
    document: CommonOpenApiClientGeneratorConfigDocument;
    /**
     * Output directory for the generated client files.
     */
    outputDirPath: string;
    /**
     * Configuration for the generated client files.
     */
    postprocess?: CommonOpenApiClientGeneratorConfigPostprocess;
}

export interface ClientGenerationResult {
    files: ClientGenerationResultFile[];
}

export interface ClientGenerationResultFile {
    filename: string;
    data: string;
}
