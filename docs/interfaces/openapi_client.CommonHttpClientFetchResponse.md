[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / CommonHttpClientFetchResponse

# Interface: CommonHttpClientFetchResponse

[openapi-client](../modules/openapi_client.md).CommonHttpClientFetchResponse

Response of the fetch function.

## Table of contents

### Properties

- [body](openapi_client.CommonHttpClientFetchResponse.md#body)
- [customRequestProps](openapi_client.CommonHttpClientFetchResponse.md#customrequestprops)
- [headers](openapi_client.CommonHttpClientFetchResponse.md#headers)
- [ok](openapi_client.CommonHttpClientFetchResponse.md#ok)
- [status](openapi_client.CommonHttpClientFetchResponse.md#status)
- [statusText](openapi_client.CommonHttpClientFetchResponse.md#statustext)
- [url](openapi_client.CommonHttpClientFetchResponse.md#url)

## Properties

### body

• **body**: [`CommonHttpClientFetchResponseBody`](../modules/openapi_client.md#commonhttpclientfetchresponsebody)

Response body.

___

### customRequestProps

• `Optional` **customRequestProps**: `Record`\<`string`, `unknown`\>

Custom request properties. Can be used to pass metadata outside the fetch function.

___

### headers

• **headers**: [`CommonHttpClientResponseHeaders`](../modules/openapi_client.md#commonhttpclientresponseheaders)

Response headers.

___

### ok

• **ok**: `boolean`

Whether the request was successful. True for 2xx status codes.

___

### status

• **status**: `number`

HTTP status code.

___

### statusText

• **statusText**: `string`

HTTP status code explanation.

___

### url

• **url**: `string`

The final URL of the request (after redirects).
