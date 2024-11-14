import {
    CommonHttpClient,
    CommonHttpClientError,
    CommonHttpClientFetchResponse,
    CommonHttpClientRequest
} from './petstore-api-client/core/common-http-client';

describe('CommonHttpClient', () => {
    describe('serialize parameters', () => {
        const baseUrl = 'http://localhost/';

        async function getRequestUrl(request: CommonHttpClientRequest): Promise<string> {
            let resultUrl = '';
            const client = new CommonHttpClient({
                apiClientClassName: 'ApiClient',
                baseUrl,
                errorClass: CommonHttpClientError,
                binaryResponseType: 'blob',
                async fetch(url: URL): Promise<CommonHttpClientFetchResponse> {
                    resultUrl = url.toString();
                    return {
                        url: url.toString(),
                        ok: true,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        body: {type: 'json', data: {}},
                        customRequestProps: {}
                    };
                }
            });
            await client.request(request);
            return resultUrl;
        }
        describe('form', () => {
            it('should serialize primitive query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: 1, b: '2', c: true}
                    })
                ).toEqual(`${baseUrl}dir?a=1&b=2&c=true`);
            });
            it('should serialize primitive query values with explode=false', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: 1, b: '2', c: true},
                        parameters: {
                            query: {
                                a: {explode: false},
                                b: {explode: false},
                                c: {explode: false}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=1&b=2&c=true`);
            });
            it('should serialize array query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: [1, 2, 3]}
                    })
                ).toEqual(`${baseUrl}dir?a=1&a=2&a=3`);
            });
            it('should serialize array query values with explode=false', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: [1, 2, 3]},
                        parameters: {
                            query: {
                                a: {explode: false}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=1%2C2%2C3`);
            });
            it('should serialize object query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: {b: 'Hey?', c: 2}}
                    })
                ).toEqual(`${baseUrl}dir?b=Hey%3F&c=2`);
            });
            it('should serialize object query values with explode=false', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: {b: 'Hey?', c: 2}},
                        parameters: {
                            query: {
                                a: {explode: false}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=b%2CHey%3F%2Cc%2C2`);
            });
        });
        describe('deepObject', () => {
            it('should serialize primitive query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: 1, b: '2', c: true},
                        parameters: {
                            query: {
                                a: {style: 'deepObject'},
                                b: {style: 'deepObject'},
                                c: {style: 'deepObject'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=1&b=2&c=true`);
            });
            it('should serialize array query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: [1, 2, 3]},
                        parameters: {
                            query: {
                                a: {style: 'deepObject'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=1%2C2%2C3`);
            });
            it('should serialize object query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: {b: 'Hey?', c: 2}},
                        parameters: {
                            query: {a: {style: 'deepObject'}}
                        }
                    })
                ).toEqual(`${baseUrl}dir?a%5Bb%5D=Hey%3F&a%5Bc%5D=2`);
            });
        });
        describe('simple', () => {
            it('should serialize primitive path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: 'test'},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'simple'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/test/subdir`);
            });
            it('should serialize array path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: ['test', 'another']},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'simple'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/test,another/subdir`);
            });
            it('should serialize object path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: {a: 'test', b: 'another'}},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'simple'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/a,test,b,another/subdir`);
            });
            it('should serialize object path params with explode=true', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: {a: 'test', b: 'another'}},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'simple', explode: true}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/a=test,b=another/subdir`);
            });
        });
        describe('label', () => {
            it('should serialize primitive path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: 'test'},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'label'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/.test/subdir`);
            });
            it('should serialize array path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: ['test', 'another']},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'label'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/.test.another/subdir`);
            });
            it('should serialize object path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: {a: 'test', b: 'another'}},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'label'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/.a.test.b.another/subdir`);
            });
            it('should serialize object path params with explode=true', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: {a: 'test', b: 'another'}},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'label', explode: true}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/.a=test.b=another/subdir`);
            });
        });
        describe('matrix', () => {
            it('should serialize primitive path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: 'test'},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'matrix'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/;param=test/subdir`);
            });
            it('should serialize array path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: ['test', 'another']},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'matrix'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/;param=test,another/subdir`);
            });
            it('should serialize object path params', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: {a: 'test', b: 'another'}},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'matrix'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/;param=a,test,b,another/subdir`);
            });
            it('should serialize object path params with explode=true', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir/{param}/subdir',
                        pathParams: {param: {a: 'test', b: 'another'}},
                        method: 'GET',
                        parameters: {
                            path: {
                                param: {style: 'matrix', explode: true}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir/;a=test;b=another/subdir`);
            });
        });
        describe('spaceDelimited', () => {
            it('should serialize primitive query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: [1, 2, 3]},
                        parameters: {
                            query: {
                                a: {style: 'spaceDelimited'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=1+2+3`);
            });
            it('should serialize array query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: [1, 2, 3]},
                        parameters: {
                            query: {
                                a: {style: 'spaceDelimited'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=1+2+3`);
            });
            it('should serialize object query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: {b: 'Hey?', c: 2}},
                        parameters: {
                            query: {
                                a: {style: 'spaceDelimited'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=b+Hey%3F+c+2`);
            });
        });
        describe('pipeDelimited', () => {
            it('should serialize primitive query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: [1, 2, 3]},
                        parameters: {
                            query: {
                                a: {style: 'pipeDelimited'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=1%7C2%7C3`);
            });
            it('should serialize array query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: [1, 2, 3]},
                        parameters: {
                            query: {
                                a: {style: 'pipeDelimited'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=1%7C2%7C3`);
            });
            it('should serialize object query values', async () => {
                expect(
                    await getRequestUrl({
                        path: '/dir',
                        method: 'GET',
                        query: {a: {b: 'Hey?', c: 2}},
                        parameters: {
                            query: {
                                a: {style: 'pipeDelimited'}
                            }
                        }
                    })
                ).toEqual(`${baseUrl}dir?a=b%7CHey%3F%7Cc%7C2`);
            });
        });
    });
});
