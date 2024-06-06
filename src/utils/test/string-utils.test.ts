import {applyEntityNameCase} from '../string-utils';

// Some of the test cases were taken from https://github.com/sindresorhus/camelcase/blob/main/test.js
const camelCaseTestCases = {
    foo: 'foo',
    IDs: 'ids',
    FooIDs: 'fooIds',
    'foo-bar': 'fooBar',
    'foo-bar-baz': 'fooBarBaz',
    'foo--bar': 'fooBar',
    '--foo-bar': 'fooBar',
    '--foo--bar': 'fooBar',
    'FOO-BAR': 'fooBar',
    '-foo-bar-': 'fooBar',
    '--foo--bar--': 'fooBar',
    'foo-1': 'foo1',
    'foo.bar': 'fooBar',
    'foo..bar': 'fooBar',
    '..foo..bar..': 'fooBar',
    foo_bar: 'fooBar',
    __foo__bar__: 'fooBar',
    'foo bar': 'fooBar',
    '  foo  bar  ': 'fooBar',
    '-': '',
    ' - ': '',
    fooBar: 'fooBar',
    'fooBar-baz': 'fooBarBaz',
    'fooBarBaz-bazzy': 'fooBarBazBazzy',
    FBBazzy: 'fbBazzy',
    F: 'f',
    FooBar: 'fooBar',
    Foo: 'foo',
    FOO: 'foo',
    '--': '',
    '': '',
    _: '',
    ' ': '',
    '.': '',
    '..': '',
    '  ': '',
    __: '',
    '--__--_--_': '',
    XMLHttpRequest: 'xmlHttpRequest',
    AjaxXMLHttpRequest: 'ajaxXmlHttpRequest',
    'Ajax-XMLHttpRequest': 'ajaxXmlHttpRequest',
    'mGridCol6@md': 'mGridCol6Md',
    'A::a': 'aA',
    Hello1World: 'hello1World',
    Hello11World: 'hello11World',
    hello1world: 'hello1World',
    Hello1World11foo: 'hello1World11Foo',
    Hello1: 'hello1',
    hello1: 'hello1',
    h2w: 'h2W'
};

describe('string-utils', () => {
    describe('applyEntityNameCase()', () => {
        it('should format a sentence', () => {
            expect(applyEntityNameCase('Hello World!', 'kebabCase')).toBe('hello-world');
        });
        it('should format a filename', () => {
            expect(applyEntityNameCase('filename-without-ext', 'snakeCase')).toBe('filename_without_ext');
        });
        it('should format a snake-case', () => {
            expect(applyEntityNameCase('CONST_NAME_EXAMPLE', 'pascalCase')).toBe('ConstNameExample');
        });
        it('should format a simple camel-case string', () => {
            expect(applyEntityNameCase('simpleCamelCaseString', 'kebabCase')).toBe('simple-camel-case-string');
        });
        it('should format a camel-case string with abbrev', () => {
            expect(applyEntityNameCase('openAPILibrary', 'kebabCase')).toBe('open-api-library');
        });
        it('should format a camel-case string with abbrev with numbers', () => {
            expect(applyEntityNameCase('publicV2Api', 'kebabCase')).toBe('public-v2-api');
        });
        it('should work for the specified camelCase testcases', () => {
            for (const [input, expected] of Object.entries(camelCaseTestCases)) {
                expect(applyEntityNameCase(input, 'camelCase')).toBe(expected);
            }
        });
    });
});
