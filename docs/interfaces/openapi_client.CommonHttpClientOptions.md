[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / CommonHttpClientOptions

# Interface: CommonHttpClientOptions

[openapi-client](../modules/openapi_client.md).CommonHttpClientOptions

Options for the common HTTP client.

## Table of contents

### Properties

- [baseUrl](openapi_client.CommonHttpClientOptions.md#baseurl)
- [binaryResponseType](openapi_client.CommonHttpClientOptions.md#binaryresponsetype)
- [errorClass](openapi_client.CommonHttpClientOptions.md#errorclass)
- [fetch](openapi_client.CommonHttpClientOptions.md#fetch)
- [formatHttpErrorMessage](openapi_client.CommonHttpClientOptions.md#formathttperrormessage)
- [handleValidationError](openapi_client.CommonHttpClientOptions.md#handlevalidationerror)
- [headers](openapi_client.CommonHttpClientOptions.md#headers)
- [preprocessFetchResponse](openapi_client.CommonHttpClientOptions.md#preprocessfetchresponse)
- [preprocessRequest](openapi_client.CommonHttpClientOptions.md#preprocessrequest)

## Properties

### baseUrl

• **baseUrl**: `string`

Base URL for the API. Endpoints are relative to this URL.

___

### binaryResponseType

• **binaryResponseType**: ``"blob"`` \| ``"readableStream"``

Type of the response body for binary responses.

___

### errorClass

• **errorClass**: (`url`: `URL`, `request`: `undefined` \| [`CommonHttpClientFetchRequest`](openapi_client.CommonHttpClientFetchRequest.md), `response`: `undefined` \| [`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md), `options`: `undefined` \| [`CommonHttpClientOptions`](openapi_client.CommonHttpClientOptions.md), `message`: `string`) => `Error`

#### Type declaration

• **new errorClass**(`url`, `request`, `response`, `options`, `message`)

Error class to be thrown when an error occurs.

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `URL` |
| `request` | `undefined` \| [`CommonHttpClientFetchRequest`](openapi_client.CommonHttpClientFetchRequest.md) |
| `response` | `undefined` \| [`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md) |
| `options` | `undefined` \| [`CommonHttpClientOptions`](openapi_client.CommonHttpClientOptions.md) |
| `message` | `string` |

___

### fetch

• `Optional` **fetch**: (`url`: `URL`, `request`: [`CommonHttpClientFetchRequest`](openapi_client.CommonHttpClientFetchRequest.md)) => `Promise`\<[`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md)\>

#### Type declaration

▸ (`url`, `request`): `Promise`\<[`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md)\>

Fetch function. Default is window.fetch-based implementation.

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `URL` |
| `request` | [`CommonHttpClientFetchRequest`](openapi_client.CommonHttpClientFetchRequest.md) |

##### Returns

`Promise`\<[`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md)\>

___

### formatHttpErrorMessage

• `Optional` **formatHttpErrorMessage**: (`response`: [`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md), `request`: [`CommonHttpClientFetchRequest`](openapi_client.CommonHttpClientFetchRequest.md)) => `string`

#### Type declaration

▸ (`response`, `request`): `string`

Format the HTTP error message.

##### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md) |
| `request` | [`CommonHttpClientFetchRequest`](openapi_client.CommonHttpClientFetchRequest.md) |

##### Returns

`string`

___

### handleValidationError

• `Optional` **handleValidationError**: (`error`: `Error`) => `void`

#### Type declaration

▸ (`error`): `void`

Custom validation error handling. Can be used to log errors.

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

##### Returns

`void`

___

### headers

• `Optional` **headers**: [`CommonHttpClientRequestHeaders`](openapi_client.CommonHttpClientRequestHeaders.md)

Default headers to be sent with each request.

___

### preprocessFetchResponse

• `Optional` **preprocessFetchResponse**: (`response`: [`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md), `request`: [`CommonHttpClientFetchRequest`](openapi_client.CommonHttpClientFetchRequest.md)) => `Promise`\<[`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md)\>

#### Type declaration

▸ (`response`, `request`): `Promise`\<[`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md)\>

Preprocess the response before returning it.

##### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md) |
| `request` | [`CommonHttpClientFetchRequest`](openapi_client.CommonHttpClientFetchRequest.md) |

##### Returns

`Promise`\<[`CommonHttpClientFetchResponse`](openapi_client.CommonHttpClientFetchResponse.md)\>

___

### preprocessRequest

• `Optional` **preprocessRequest**: (`request`: [`CommonHttpClientRequest`](../modules/openapi_client.md#commonhttpclientrequest)) => `Promise`\<[`CommonHttpClientRequest`](../modules/openapi_client.md#commonhttpclientrequest)\>

#### Type declaration

▸ (`request`): `Promise`\<[`CommonHttpClientRequest`](../modules/openapi_client.md#commonhttpclientrequest)\>

Preprocess the request before sending it.

##### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`CommonHttpClientRequest`](../modules/openapi_client.md#commonhttpclientrequest) |

##### Returns

`Promise`\<[`CommonHttpClientRequest`](../modules/openapi_client.md#commonhttpclientrequest)\>
