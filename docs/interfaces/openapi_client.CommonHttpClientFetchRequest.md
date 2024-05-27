[api-typescript-generator](../../README.md) / [Modules](../modules.md) / [openapi-client](../modules/openapi_client.md) / CommonHttpClientFetchRequest

# Interface: CommonHttpClientFetchRequest

[openapi-client](../modules/openapi_client.md).CommonHttpClientFetchRequest

Request prepared for the fetch function.

## Table of contents

### Properties

- [body](openapi_client.CommonHttpClientFetchRequest.md#body)
- [cache](openapi_client.CommonHttpClientFetchRequest.md#cache)
- [credentials](openapi_client.CommonHttpClientFetchRequest.md#credentials)
- [customRequestProps](openapi_client.CommonHttpClientFetchRequest.md#customrequestprops)
- [headers](openapi_client.CommonHttpClientFetchRequest.md#headers)
- [method](openapi_client.CommonHttpClientFetchRequest.md#method)
- [redirect](openapi_client.CommonHttpClientFetchRequest.md#redirect)

## Properties

### body

• `Optional` **body**: `BodyInit`

Request body.

___

### cache

• **cache**: ``"default"`` \| ``"force-cache"`` \| ``"no-cache"`` \| ``"no-store"`` \| ``"only-if-cached"`` \| ``"reload"``

Cache mode.

___

### credentials

• **credentials**: ``"include"`` \| ``"omit"`` \| ``"same-origin"``

Credentials mode.

___

### customRequestProps

• `Optional` **customRequestProps**: `Record`\<`string`, `unknown`\>

Custom request properties. Can be used to pass metadata to the fetch function.

___

### headers

• **headers**: [`CommonHttpClientFetchRequestHeaders`](openapi_client.CommonHttpClientFetchRequestHeaders.md)

Request headers.

___

### method

• **method**: ``"GET"`` \| ``"HEAD"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` \| ``"CONNECT"`` \| ``"OPTIONS"`` \| ``"PATCH"``

HTTP Method.

___

### redirect

• **redirect**: ``"error"`` \| ``"follow"`` \| ``"manual"``

Redirect mode.
