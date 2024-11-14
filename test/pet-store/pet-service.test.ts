/* eslint-disable @typescript-eslint/no-var-requires */
import {CommonHttpClientFetchRequest} from './petstore-api-client/core/common-http-client';

describe('pet-service', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should show a deprecation warning', () => {
        const {PetStoreApiClient} = require('./petstore-api-client/pet-store-api-client');
        const client = new PetStoreApiClient({baseUrl: 'https://petstore.swagger.io/v2'});
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        client.pet.findPetsByTags({tags: ['tag']});
        client.pet.findPetsByTags({tags: ['tag']});
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith(
            'Deprecated API call PetStoreApiClient.pet.findPetsByTags: GET /pet/findByTags'
        );
    });

    it('should call a custom deprecation log function', (done) => {
        const {PetStoreApiClient} = require('./petstore-api-client/pet-store-api-client');
        const client = new PetStoreApiClient({
            baseUrl: 'https://petstore.swagger.io/v2',
            logDeprecationWarning(params: {
                operationName: string;
                path: string;
                method: CommonHttpClientFetchRequest['method'];
            }) {
                expect(params).toEqual({
                    operationName: 'pet.findPetsByTags',
                    method: 'GET',
                    path: '/pet/findByTags'
                });
                done();
            }
        });
        client.pet.findPetsByTags({tags: ['tag']});
    });
});
