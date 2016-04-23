/* eslint no-underscore-dangle: 0 */
'use strict';

const each = require('lodash/forEach');
class Emitter {
    constructor() {
        this._listeners = {};
        this._onQueue = [];
        this._offQueue = [];
        this._triggerStack = [];
    }

    on(ctx, ev, fn) {
        if (!this._listeners[ev]) {
            this._listeners[ev] = [];
        }

        const listener = { ctx, ev, fn };
        if (!this._triggering) {
            this._listeners[ev].push(listener);
        } else {
            this._onQueue.push(listener);
        }
    }

    off(ctx) {
        if (!this._triggering) {
            each(this._listeners, listeners => {
                for (let i = 0, len = listeners.length; i < len; i++) {
                    const listener = listeners[i];
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
    }

    trigger(ev) {
        if (this._triggering) {
            this._triggerStack.unshift(ev);
            return;
        }

        this._triggering = true;

        const type = ev.type;
        const listeners = this._listeners[type];
        if (listeners) {
            for (let i = 0, len = listeners.length; i < len; i++) {
                const listener = listeners[i];
                listener.fn.call(listener.ctx, ev);
            }
        }

        this._triggering = false;
        this._processQueue();
    }

    _processQueue() {
        if (this._triggering) {
            return;
        }

        each(this._offQueue, ctx => {
            this.off(ctx);
        });
        this._offQueue = [];

        each(this._onQueue, listener => {
            this.on(listener.ctx, listener.ev, listener.fn);
        });
        this._onQueue = [];

        if (this._triggerStack.length) {
            const ev = this._triggerStack.pop();
            this.trigger(ev);
        }
    }
}

module.exports = Emitter;
