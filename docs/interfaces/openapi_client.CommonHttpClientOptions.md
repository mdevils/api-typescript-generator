[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / CommonHttpClientOptions

# Interface: CommonHttpClientOptions

[openapi-client](../modules/openapi_client.md).CommonHttpClientOptions

Options for the common HTTP client.

## Table of contents

### Properties

- [apiClientClassName](openapi_client.CommonHttpClientOptions.md#apiclientclassname)
- [baseUrl](openapi_client.CommonHttpClientOptions.md#baseurl)
- [binaryResponseType](openapi_client.CommonHttpClientOptions.md#binaryresponsetype)
- [deprecatedOperations](openapi_client.CommonHttpClientOptions.md#deprecatedoperations)
- [errorClass](openapi_client.CommonHttpClientOptions.md#errorclass)
- [fetch](openapi_client.CommonHttpClientOptions.md#fetch)
- [followRedirects](openapi_client.CommonHttpClientOptions.md#followredirects)
- [formatHttpErrorMessage](openapi_client.CommonHttpClientOptions.md#formathttperrormessage)
- [handleValidationError](openapi_client.CommonHttpClientOptions.md#handlevalidationerror)
- [headers](openapi_client.CommonHttpClientOptions.md#headers)
- [preprocessFetchResponse](openapi_client.CommonHttpClientOptions.md#preprocessfetchresponse)
- [preprocessRequest](openapi_client.CommonHttpClientOptions.md#preprocessrequest)
- [processError](openapi_client.CommonHttpClientOptions.md#processerror)
- [shouldRetryOnError](openapi_client.CommonHttpClientOptions.md#shouldretryonerror)

### Methods

- [logDeprecationWarning](openapi_client.CommonHttpClientOptions.md#logdeprecationwarning)

## Properties

### apiClientClassName

• **apiClientClassName**: `string`

Class name of the API client.

___

### baseUrl

• **baseUrl**: `string`

Base URL for the API. Endpoints are relative to this URL.

___

### binaryResponseType

• **binaryResponseType**: ``"blob"`` \| ``"readableStream"``

Type of the response body for binary responses.

___

### deprecatedOperations

• `Optional` **deprecatedOperations**: `Object`

Deprecated operations. Used to warn about deprecated operations.

#### Index signature

▪ [methodAndPath: `string`]: `string`

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

### followRedirects

• `Optional` **followRedirects**: `boolean`

Whether to follow redirects. Default is true.

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

___

### processError

• `Optional` **processError**: (`error`: `Error`) => `Error`

#### Type declaration

▸ (`error`): `Error`

Process the error before throwing it. Can be used to add additional information to the error.

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

##### Returns

`Error`

___

### shouldRetryOnError

• `Optional` **shouldRetryOnError**: (`error`: `Error`, `attemptNumber`: `number`) => `boolean` \| `Promise`\<`boolean`\>

#### Type declaration

▸ (`error`, `attemptNumber`): `boolean` \| `Promise`\<`boolean`\>

Determine whether to retry on error.

##### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |
| `attemptNumber` | `number` |

##### Returns

`boolean` \| `Promise`\<`boolean`\>

## Methods

### logDeprecationWarning

▸ `Optional` **logDeprecationWarning**(`params`): `void`

Log a deprecation warning.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | - |
| `params.method` | ``"GET"`` \| ``"HEAD"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` \| ``"CONNECT"`` \| ``"OPTIONS"`` \| ``"PATCH"`` | - |
| `params.operationName` | `string` | Either operation method name in case if it's not part of the service, or service name and operation method name separated by a dot. Examples: `users.getUserById`, `getSystemConfig` |
| `params.path` | `string` | - |

#### Returns

`void`
