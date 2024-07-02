[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / CommonHttpClientError

# Class: CommonHttpClientError

[openapi-client](../modules/openapi_client.md).CommonHttpClientError

Error thrown by the common HTTP client.

## Hierarchy

- `Error`

  ↳ **`CommonHttpClientError`**

## Table of contents

### Constructors

- [constructor](openapi_client.CommonHttpClientError.md#constructor)

### Properties

- [options](openapi_client.CommonHttpClientError.md#options)
- [request](openapi_client.CommonHttpClientError.md#request)
- [response](openapi_client.CommonHttpClientError.md#response)
- [url](openapi_client.CommonHttpClientError.md#url)

## Constructors

### constructor

• **new CommonHttpClientError**(`url`, `request`, `response`, `options`, `message`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `URL` |
| `request` | `undefined` \| [`CommonHttpClientFetchRequest`](../interfaces/openapi_client.CommonHttpClientFetchRequest.md) |
| `response` | `undefined` \| [`CommonHttpClientFetchResponse`](../interfaces/openapi_client.CommonHttpClientFetchResponse.md) |
| `options` | `undefined` \| [`CommonHttpClientOptions`](../interfaces/openapi_client.CommonHttpClientOptions.md) |
| `message` | `string` |

#### Overrides

Error.constructor

## Properties

### options

• `Readonly` **options**: `undefined` \| [`CommonHttpClientOptions`](../interfaces/openapi_client.CommonHttpClientOptions.md)

Options of the common HTTP client.

___

### request

• `Readonly` **request**: `undefined` \| [`CommonHttpClientFetchRequest`](../interfaces/openapi_client.CommonHttpClientFetchRequest.md)

Request that caused the error. Can be undefined in case of failure during request building phase.

___

### response

• `Readonly` **response**: `undefined` \| [`CommonHttpClientFetchResponse`](../interfaces/openapi_client.CommonHttpClientFetchResponse.md)

Response that caused the error. Can be undefined in case of network failure.

___

### url

• `Readonly` **url**: `URL`

URL of the request.
