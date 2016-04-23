/* eslint no-underscore-dangle: 0 */
'use strict';

var each = require('lodash/forEach');
function Emitter() {
    this._listeners = {};
    this._onQueue = [];
    this._offQueue = [];
    this._triggerStack = [];
}

Emitter.prototype = {
    on: function on(ctx, ev, fn) {
        if (!this._listeners[ev]) {
            this._listeners[ev] = [];
        }

        var listener = { ctx: ctx, ev: ev, fn: fn };
        if (!this._triggering) {
            this._listeners[ev].push(listener);
        } else {
            this._onQueue.push(listener);
        }
    },

    off: function off(ctx) {
        if (!this._triggering) {
            each(this._listeners, function offListeners(listeners) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var listener = listeners[i];
                    if (listener.ctx === ctx) {
                        listeners.splice(i, 1);
                        i--;
                        len--;
                    }
                }
            });
        } else {
            this._offQueue.push(ctx);
        }
    },

    trigger: function trigger(ev) {
        if (this._triggering) {
            this._triggerStack.unshift(ev);
            return;
        }

        this._triggering = true;

        var type = ev.type;
        var listeners = this._listeners[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                var listener = listeners[i];
                listener.fn.call(listener.ctx, ev);
            }
        }

        this._triggering = false;
        this._processQueue();
    },

    _processQueue: function _processQueue() {
        if (this._triggering) {
            return;
        }

        each(this._offQueue, function offQueue(ctx) {
            this.off(ctx);
        });
        this._offQueue = [];

        each(this._onQueue, function onQueue(listener) {
            this.on(listener.ctx, listener.ev, listener.fn);
        });
        this._onQueue = [];

        if (this._triggerStack.length) {
            var ev = this._triggerStack.pop();
            this.trigger(ev);
        }
    },
};

module.exports = Emitter;
