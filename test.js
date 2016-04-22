/* eslint no-console: 0 */
'use strict';

const Emitter = require('./emitter.js');

function assert(bool, msg) {
    if (!bool) {
        throw new Error(msg);
    }
}

assert(Emitter, 'a module is exported');

console.log('All tests passed - you\'re good to go');
