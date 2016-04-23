/* eslint no-console: 0 */
'use strict';

var Emitter = require('./emitter.js');

function assert(bool, msg) {
    if (!bool) {
        throw new Error(msg);
    }
}

assert(Emitter, 'a module is exported');
var em = new Emitter();

// --- Basic tests: on/off/trigger methods
var callCtx = {};
var wasCalled = false;
em.on(callCtx, 'event', function cb() {
    assert(this === callCtx, 'emitter didnt use given ctx');
    wasCalled = true;
});
assert(!wasCalled, 'was not called yet');
em.trigger({ type: 'event' });
assert(wasCalled, 'but was now called');
wasCalled = false;
em.off(callCtx);
assert(!wasCalled, 'why was this called?');
em.trigger({ type: 'event' });
assert(!wasCalled, 'after detaching by ctx, trigger wont call it');
try {
    em.trigger('thing');
    assert(false, 'triggering with just string is invalid, didnt throw error');
} catch (e) {
    // nothing needed
}

// --- trigger calls are put onto stack until all listeners are triggered
// (in this test, if wasn't the case, you'd see inf loop)
em = new Emitter();
em.on(callCtx, 'event', function evCb() {
    em.trigger({ type: 'event' });
    em.off(callCtx);
});
em.trigger('event');

console.log('All tests passed - you\'re good to go');
