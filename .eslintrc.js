// eslint-disable-next-line no-undef
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'prettier', 'import', 'unused-imports'],
    env: {
        mocha: true
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-use-before-define': [
            'error',
            {
                functions: false,
                classes: false
            }
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true,
                argsIgnorePattern: '^_'
            }
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-namespace': 'off',

        'prettier/prettier': ['error', {singleQuote: true}],
        'no-case-declarations': 'off',
        'no-irregular-whitespace': 'off',
        'no-control-regex': 'off',
        'no-duplicate-imports': ['error', {includeExports: true}],
        'arrow-body-style': ['error', 'as-needed'],
        'no-restricted-globals': ['error', 'name', 'toString', 'pending'],
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'sibling'],
                pathGroupsExcludedImportTypes: ['parent', 'sibling', 'index'],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                }
            }
        ],
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error'
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.ts']
            }
        }
    },
    parser: '@typescript-eslint/parser'
};
