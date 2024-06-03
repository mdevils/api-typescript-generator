import {resolveDocumentReferences} from './common';
import {fetchSource} from './fetch-source';
import {OpenApiDocument, processOpenApiDocument} from './openapi';
import {patchOpenApiDocument} from './patch-open-api-document';
import {CommonOpenApiClientGeneratorConfigDocument} from '../schema-to-typescript/config';

export async function loadOpenApiDocument(
    config: CommonOpenApiClientGeneratorConfigDocument
): Promise<OpenApiDocument> {
    let document = (await fetchSource(config.source)) as OpenApiDocument;
    if (config.patch) {
        document = await patchOpenApiDocument(document, config.patch);
    }
    document = resolveDocumentReferences(processOpenApiDocument(document));
    return document;
}
