import {checkReponseMediaType, CommonHttpClientError} from './petstore-api-client/core/common-http-client';
import {PetStoreApiClient} from './petstore-api-client/pet-store-api-client';

const client = new PetStoreApiClient({baseUrl: 'https://petstore.swagger.io/v2'});

describe('store-service', () => {
    it('should get inventory', async () => {
        const inventory = await client.store.getInventory();
        expect(typeof inventory).toEqual('object');
        expect(inventory).not.toBeNull();
        expect(Object.keys(inventory).length).toBeGreaterThan(0);
    });
    it('should return 404 in case of non-existing orders', async () => {
        try {
            await client.store.getOrderById({orderId: -1});
            fail('Unexpected status 200.');
        } catch (error) {
            expect(error).toBeInstanceOf(CommonHttpClientError);
            expect((error as CommonHttpClientError).response?.status).toEqual(404);
        }
    });
    it('should place an order', async () => {
        const response = await client.store.placeOrder({
            order: {
                petId: 10,
                quantity: 1,
                shipDate: '2021-09-01T00:00:00.000Z',
                status: 'placed',
                complete: true
            }
        });
        if (checkReponseMediaType(response, 'application/json')) {
            expect(response.status).toEqual(200);
            expect(response.mediaType).toEqual('application/json');
            expect(response.body.petId).toEqual(10);
        } else {
            fail('Unexpected media type.');
        }
    });
    it('should get and delete the placed order', async () => {
        const orderId = 123123123;
        await client.store.placeOrder({
            order: {
                id: orderId,
                petId: 123,
                quantity: 1,
                shipDate: '2021-09-01T00:00:00.000Z',
                status: 'placed',
                complete: true
            }
        });
        const orderResponse = await client.store.getOrderById({orderId});
        if (checkReponseMediaType(orderResponse, 'application/json')) {
            expect(orderResponse.body.petId).toEqual(123);
        } else {
            throw new Error('Unexpected media type.');
        }
        await client.store.deleteOrder({orderId});
    });
    it('should fail in case of non-existing orders', async () => {
        try {
            await client.store.deleteOrder({orderId: -1});
            fail('Unexpected status 200.');
        } catch (error) {
            expect(error).toBeInstanceOf(CommonHttpClientError);
            expect((error as CommonHttpClientError).response?.status).toEqual(404);
        }
    });
});
