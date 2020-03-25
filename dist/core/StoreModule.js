"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("../lib/decorator");
const extra_1 = require("../lib/extra");
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const store_1 = require("./store");
class StoreModule {
    constructor(options) {
        this.state = {};
        this.nameSpace = options.nameSpace || '';
        this.STATE = options.state || {};
        this.actions = options.actions || {};
        this.watch = options.watch || {};
        defineState(this.state, this.STATE, this);
    }
}
__decorate([
    decorator_1.AgStoreState
], StoreModule.prototype, "state", void 0);
__decorate([
    decorator_1.ObjectFunctions
], StoreModule.prototype, "actions", void 0);
__decorate([
    decorator_1.ObjectFunctions
], StoreModule.prototype, "watch", void 0);
exports.StoreModule = StoreModule;
function defineState(target, source, context, path = '') {
    Object.keys(source).forEach((name) => {
        const key = uuid_1.v4();
        store_1.default.container.set(key, source[name]);
        Object.defineProperty(target, name, {
            get() {
                return store_1.default.container.get(key);
            },
            set(value) {
                const oldValue = store_1.default.container.get(key);
                store_1.default.container.set(key, value);
                findAndRunWatcher(context, extra_1.joinPath(path, name), value, oldValue);
            },
        });
        if (typeof source[name] === 'object') {
            defineState(store_1.default.container.get(key), source[name], context, extra_1.joinPath(path, name));
        }
    });
}
function findAndRunWatcher(module, name, value, oldValue) {
    const watchers = [
        lodash_1.get(module.watch, name),
        ...store_1.default.WATCHERS.filter((w) => w.path === extra_1.joinPath(module.nameSpace, name)).map((item) => item.func),
    ].filter((f) => typeof f === 'function');
    watchers.forEach((func) => func(value, oldValue, store_1.default.INJECTS));
}
//# sourceMappingURL=StoreModule.js.map