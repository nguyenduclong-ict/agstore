"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const extra_1 = require("../lib/extra");
const decorator_1 = require("../lib/decorator");
const store_1 = require("./store");
class AgStore {
    static initStore(configs) {
        const { modules, injects, watchers } = configs;
        store_1.default.MODULES = modules || store_1.default.MODULES;
        store_1.default.INJECTS = injects || store_1.default.INJECTS;
        for (const key in watchers) {
            if (watchers.hasOwnProperty(key)) {
                store_1.default.WATCHERS.push({ path: key, func: watchers[key] });
            }
        }
    }
    static mapState(modulePath, name) {
        const module = store_1.default.MODULES.find((m) => m.nameSpace === modulePath);
        if (!module) {
            throw new Error('AgStore Error - (MapState): Cannot found moudle "' + modulePath + '"');
        }
        if (!extra_1.hasProperty(module.state, name)) {
            throw new Error('AgStore Error - (MapState): Cannot found state "' + name + '" in "' + modulePath + '"');
        }
        return (target, propertyKey) => {
            Object.defineProperty(target, propertyKey, {
                get() {
                    return lodash_1.get(module.state, name);
                },
                set(value) {
                    lodash_1.set(module.state, name, value);
                },
            });
        };
    }
    static mapAction(modulePath, name) {
        const module = store_1.default.MODULES.find((m) => m.nameSpace === modulePath);
        if (!module) {
            throw new Error('AgStore Error - (mapAction): Cannot found moudle ' + `"${modulePath}"`);
        }
        if (!extra_1.hasProperty(module.actions, name)) {
            throw new Error(`AgStore Error - (mapAction): Cannot found action "${name}" + name in "${modulePath}"`);
        }
        const originalFuntion = module.actions[name];
        return (target, propertyKey) => {
            target[propertyKey] = (...args) => {
                originalFuntion(Object.assign({ state: module.state, dispatch: exports.dispatch,
                    getState: exports.getState,
                    setState: exports.setState }, store_1.default.INJECTS), ...args);
            };
        };
    }
    static getState(modulePath, name) {
        const module = store_1.default.MODULES.find((m) => m.nameSpace === modulePath);
        if (!module) {
            throw new Error('AgStore Error - (getState): Cannot found moudle ' + `"${modulePath}"`);
        }
        return lodash_1.get(module.state, name);
    }
    static setState(modulePath, name, value) {
        const module = store_1.default.MODULES.find((m) => m.nameSpace === modulePath);
        if (!module) {
            throw new Error('AgStore Error - (getState): Cannot found moudle ' + `"${modulePath}"`);
        }
        lodash_1.set(module.state, name, value);
    }
    // Call Actions
    static dispatch(modulePath, name, ...args) {
        const module = store_1.default.MODULES.find((m) => m.nameSpace === modulePath);
        if (!module) {
            throw new Error('AgStore Error - (dispatchAction): Cannot found moudle ' + `"${modulePath}"`);
        }
        if (!extra_1.hasProperty(module.actions, name)) {
            throw new Error(`AgStore Error - (dispatchAction): Cannot found action "${name}" + name in "${modulePath}"`);
        }
        const originalFuntion = module.actions[name];
        // call function
        return originalFuntion(Object.assign({ state: module.state, getState: exports.getState,
            setState: exports.setState }, store_1.default.INJECTS), ...args);
    }
    static addInjects(items) {
        Object.assign(store_1.default.INJECTS, items);
    }
    static removeInjects(...names) {
        names.forEach((key) => {
            delete store_1.default.INJECTS[key];
        });
    }
    static addWatcher(path, name, func) {
        store_1.default.WATCHERS.push({
            path: extra_1.joinPath(path, name),
            func,
        });
    }
    static removeWatcher(path, name, func) {
        store_1.default.WATCHERS.splice(store_1.default.WATCHERS.findIndex((w) => w.path === extra_1.joinPath(path, name) && w.func === func), 1);
    }
}
__decorate([
    decorator_1.formatParams
], AgStore, "mapState", null);
__decorate([
    decorator_1.formatParams
], AgStore, "mapAction", null);
exports.initStore = AgStore.initStore;
exports.mapState = AgStore.mapState;
exports.mapAction = AgStore.mapAction;
exports.getState = AgStore.getState;
exports.dispatch = AgStore.dispatch;
exports.setState = AgStore.setState;
exports.addWatcher = AgStore.addWatcher;
exports.removeWatcher = AgStore.removeWatcher;
exports.addInjects = AgStore.addInjects;
exports.removeInjects = AgStore.removeInjects;
//# sourceMappingURL=AgStore.js.map