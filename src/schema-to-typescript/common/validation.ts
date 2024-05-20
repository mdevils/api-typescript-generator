import fs from 'fs';
import path from 'path';
import {formatFilename} from '../../utils/string-utils';
import {OpenApiClientGeneratorConfig} from '../openapi-to-typescript-client';

export async function generateCommonValidationSchemaStorage({
    filenameFormat,
    relativeDirPath = 'core'
}: OpenApiClientGeneratorConfig['core'] = {}) {
    return {
        className: 'CommonValidationSchemaStorage',
        importPath: path.join(relativeDirPath, formatFilename('common-validation-schema-storage', filenameFormat)),
        file: {
            filename: path.join(
                relativeDirPath,
                formatFilename('common-validation-schema-storage', {...filenameFormat, extension: '.ts'})
            ),
            data: await fs.promises.readFile(
                path.join(__dirname, 'core', 'common-validation-schema-storage.ts'),
                'utf8'
            )
        }
    };
}
