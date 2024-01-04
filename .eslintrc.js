module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        indent: [2, 4],
        // 'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'no-unused-vars': 'warn',
        'no-shadow': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-underscore-dangle': 'off',
        'import/no-absolute-path': 'off',
        'max-len': ['error', {
            ignoreComments: true,
            code: 150
        }]
    },
    globals: {
        __IS_DEV__: true
    },
    overrides: [{
        files: ['**/src/**/*.test.{ts}'],
    }],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.d.ts', '.svg'],
                moduleDirectory: ['src', 'node_modules']
            }
        }
    }
};
