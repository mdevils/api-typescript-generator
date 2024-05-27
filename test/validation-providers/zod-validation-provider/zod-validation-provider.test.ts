import fs from 'node:fs/promises';
import path from 'node:path';
import {callExpression, expressionStatement, identifier, memberExpression, program, stringLiteral} from '@babel/types';
import {renderTypeScript} from '../../../src/schema-to-typescript/common';
import {ZodValidationProvider} from '../../../src/schema-to-typescript/common/validation-providers/zod-validation-provider';
import {generateValidationSchemaStorage} from '../../../src/schema-to-typescript/common/validation-schema-storage';
import {OpenApiSchema} from '../../../src/schemas/common';
import {
    addDependencyImport,
    collectSchemaDependencies,
    DependencyImports,
    extendDependenciesAndGetResult,
    generateTsImports
} from '../../../src/utils/dependencies';

describe('ZodValidationProvider', () => {
    it('should generate descriptions', async () => {
        const provider = new ZodValidationProvider();
        const validationSchemaStorage = await generateValidationSchemaStorage({
            commonValidationSchemaStorage: {
                importPath: '../../../../src/schema-to-typescript/common/core/common-validation-schema-storage',
                className: 'CommonValidationSchemaStorage'
            },
            commentsConfig: undefined,
            validationProvider: provider,
            validationConfig: {
                library: 'zod'
            }
        });
        const schema: OpenApiSchema = {
            name: 'Data',
            type: 'object',
            properties: {
                status: {type: 'number'},
                mediaType: {type: 'string'},
                body: {
                    name: 'Group',
                    type: 'object',
                    properties: {
                        id: {type: 'string'},
                        name: {type: 'string'},
                        users: {
                            type: 'array',
                            items: {
                                name: 'User',
                                type: 'object',
                                properties: {
                                    id: {type: 'string'},
                                    name: {type: 'string'},
                                    tags: {
                                        type: 'object',
                                        additionalProperties: {
                                            name: 'Tag',
                                            type: 'object',
                                            properties: {
                                                name: {type: 'string'},
                                                value: {type: 'string'}
                                            },
                                            required: ['name']
                                        }
                                    },
                                    role: {
                                        oneOf: [
                                            {
                                                name: 'Role',
                                                type: 'object',
                                                properties: {
                                                    roleId: {type: 'string'}
                                                },
                                                additionalProperties: false
                                            },
                                            {
                                                name: 'AdminRole',
                                                type: 'object',
                                                properties: {
                                                    adminRoleId: {type: 'string'}
                                                },
                                                additionalProperties: false
                                            }
                                        ]
                                    }
                                },
                                additionalProperties: false
                            },
                            required: ['id', 'name'],
                            additionalProperties: false
                        }
                    },
                    required: ['id', 'name'],
                    additionalProperties: false
                },
                response: {
                    type: 'object',
                    properties: {
                        url: {type: 'string'}
                    }
                }
            }
        };
        function collectAllSchemas(schema: OpenApiSchema): Record<string, OpenApiSchema> {
            const deps = collectSchemaDependencies(schema);
            for (const subSchema of Object.values(deps)) {
                Object.assign(deps, collectAllSchemas(subSchema));
            }
            return deps;
        }
        const allSubSchemas = collectAllSchemas(schema);
        const dependencyImports: DependencyImports = {};
        const registerStatements = Object.entries(allSubSchemas).map(([schemaName, schema]) =>
            expressionStatement(
                callExpression(
                    memberExpression(identifier(validationSchemaStorage.importName), identifier('register')),
                    [
                        stringLiteral(schemaName),
                        extendDependenciesAndGetResult(
                            provider.generateSetModelNameCall(
                                extendDependenciesAndGetResult(
                                    provider.generateSchema(schema, {
                                        getNamedSchemaReference: (name: string) =>
                                            callExpression(
                                                memberExpression(
                                                    identifier(validationSchemaStorage.importName),
                                                    identifier('lazy')
                                                ),
                                                [stringLiteral(name)]
                                            )
                                    }),
                                    dependencyImports
                                ),
                                schemaName
                            ),
                            dependencyImports
                        )
                    ]
                )
            )
        );
        addDependencyImport(
            dependencyImports,
            `./${validationSchemaStorage.importPath}`,
            validationSchemaStorage.importName,
            {
                kind: 'value',
                entity: {name: validationSchemaStorage.importName}
            }
        );
        await fs.mkdir(path.join(__dirname, 'tmp'), {recursive: true});
        await Promise.all([
            fs.writeFile(
                path.join(__dirname, 'tmp', validationSchemaStorage.file.filename),
                validationSchemaStorage.file.data
            ),
            fs.writeFile(
                path.join(__dirname, 'tmp', 'schemas.ts'),
                renderTypeScript(program([...generateTsImports(dependencyImports), ...registerStatements]))
            )
        ]);
        require('./tmp/schemas');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const schemaStorage = require('./tmp/validation-schema-storage').validationSchemaStorage;

        function validate(data: unknown) {
            return schemaStorage.validator('Data')({
                status: 200,
                mediaType: 'application/json',
                body: data,
                response: {url: 'http://example.com'}
            });
        }

        // No errors are expected.
        validate({
            id: '1',
            name: 'group'
        });

        expect(() =>
            validate({
                id: 1,
                name: 'group'
            })
        ).toThrow("Expected string, received number at 'Group.id', full path: 'body.id'.");

        expect(() =>
            validate({
                id: '1',
                name: 'group',
                hello: 'world'
            })
        ).toThrow("Unrecognized key(s) in object: 'hello' at 'Data.body', full path: 'body'.");

        expect(() =>
            validate({
                id: '1',
                name: 'group',
                users: [
                    {
                        id: '1',
                        name: 'user',
                        hello: 'world'
                    }
                ]
            })
        ).toThrow("Unrecognized key(s) in object: 'hello' at 'User', full path: 'body.users[0]'.");

        expect(() =>
            validate({
                id: '1',
                name: 'group',
                users: [
                    {
                        id: '1',
                        name: 5
                    }
                ]
            })
        ).toThrow("Expected string, received number at 'User.name', full path: 'body.users[0].name'.");

        validate({
            id: '1',
            name: 'group',
            users: [
                {
                    id: '1',
                    name: 'User',
                    role: {
                        roleId: '1'
                    }
                }
            ]
        });

        expect(() =>
            validate({
                id: '1',
                name: 'group',
                users: [
                    {
                        id: '1',
                        name: 'User',
                        tags: {
                            test: {
                                name: 1
                            }
                        }
                    }
                ]
            })
        ).toThrow("Expected string, received number at 'Tag.name', full path: 'body.users[0].tags.test.name'.");
    });
});
