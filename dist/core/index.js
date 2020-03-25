"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const extra_1 = require("../lib/extra");
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const decorator_1 = require("../lib/decorator");
const container = new Map();
let MODULES = new Array();
const WATCHERS = new Array();
const INJECTS = {};
function initStore(configs) {
    const { modules } = configs;
    MODULES = modules || MODULES;
}
exports.initStore = initStore;
// decorator
function mapState(modulePath, name) {
    if (arguments.length === 1) {
        name = joinPath(modulePath);
        modulePath = '';
    }
    else if (arguments.length === 2) {
        name = joinPath(name);
    }
    const module = MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!extra_1.hasProperty(module.state, name)) {
        throw new Error('AgStore Error: Cannot found state ' + name + ' in ' + modulePath);
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
exports.mapState = mapState;
// decorator
function mapAction(modulePath, name) {
    if (arguments.length === 1) {
        name = joinPath(modulePath);
        modulePath = '';
    }
    else if (arguments.length === 2) {
        name = joinPath(name);
    }
    const module = MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!extra_1.hasProperty(module.actions, name)) {
        throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
    }
    const originalFuntion = module.actions[name];
    return (target, propertyKey) => {
        target[propertyKey] = (...args) => {
            originalFuntion({ state: module.state, getState, setState, INJECTS }, ...args);
        };
    };
}
exports.mapAction = mapAction;
function getState(modulePath, name) {
    const module = MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
    }
    return lodash_1.get(module.state, name);
}
exports.getState = getState;
function setState(modulePath, name, value) {
    const module = MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
    }
}
exports.setState = setState;
// Call Actions
function dispatch(modulePath, name, ...args) {
    const module = MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!extra_1.hasProperty(module.actions, name)) {
        throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
    }
    const originalFuntion = module.actions[name];
    // call function
    return originalFuntion({ state: module.state, getState, setState, INJECTS }, ...args);
}
exports.dispatch = dispatch;
function addInjects(items) {
    Object.assign(INJECTS, items);
}
exports.addInjects = addInjects;
function removeInjects(...names) {
    names.forEach((key) => {
        delete INJECTS[key];
    });
}
exports.removeInjects = removeInjects;
function addWatcher(path, name, func) {
    WATCHERS.push({
        path: [path, name].join('/'),
        func,
    });
}
exports.addWatcher = addWatcher;
function removeWatcher(path, name, func) {
    WATCHERS.splice(WATCHERS.findIndex((w) => w.path === joinPath(path, name) && w.func === func), 1);
}
exports.removeWatcher = removeWatcher;
// ------ Classs
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
        container.set(key, source[name]);
        Object.defineProperty(target, name, {
            get() {
                return container.get(key);
            },
            set(value) {
                const oldValue = container.get(key);
                container.set(key, value);
                findAndRunWatcher(context, joinPath(path, name), value, oldValue);
            },
        });
        if (typeof source[name] === 'object') {
            defineState(container.get(key), source[name], context, joinPath(path, name));
        }
    });
}
function findAndRunWatcher(module, name, value, oldValue) {
    const watchers = [
        lodash_1.get(module.watch, name),
        ...WATCHERS.filter((w) => w.path === joinPath(module.nameSpace, name)).map((item) => item.func),
    ].filter((f) => typeof f === 'function');
    watchers.forEach((func) => func(value, oldValue, INJECTS));
}
function joinPath(...args) {
    return args
        .map((p) => p.replace(/\//g, '.').replace(/^\.|\.$/g, ''))
        .filter((item) => !!item)
        .join('.');
}
//# sourceMappingURL=index.js.map