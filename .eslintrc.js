module.exports = {
    extends: 'airbnb/base',
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],

        // demoted to es5, so don't use the new sugar
        'no-var': 0,
        'object-shorthand': 0,
        'vars-on-top': 0,
        'prefer-arrow-callback': 0,
    },
    globals: {
        require: false,
    },
    parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script',
    },
};
