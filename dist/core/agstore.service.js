"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const extra_1 = require("../lib/extra");
const lodash_1 = require("lodash");
var _modules = new Array();
var _watchers = new Array();
var _injects = {};
let AgStoreService = class AgStoreService {
    constructor(configs) {
        const { modules } = configs;
        _modules = modules || _modules;
    }
};
AgStoreService = __decorate([
    core_1.Injectable({
        providedIn: 'root'
    })
], AgStoreService);
exports.AgStoreService = AgStoreService;
// decorator
function mapState(modulePath, name) {
    const module = _modules.find(m => m.nameSpace);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!extra_1.hasProperty(module.state, name)) {
        throw new Error('AgStore Error: Cannot found state ' + name + ' in ' + modulePath);
    }
    return function (target, propertyKey) {
        Object.defineProperty(target, propertyKey, {
            get() {
                return module.state[name];
            },
            set(value) {
                setState(modulePath, name, value);
            }
        });
    };
}
exports.mapState = mapState;
// decorator
function mapAction(modulePath, name) {
    const module = _modules.find(m => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!extra_1.hasProperty(module.actions, name)) {
        throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
    }
    const originalFuntion = module.actions[name];
    return function (target, propertyKey) {
        target[propertyKey] = function (...args) {
            originalFuntion({ state: Object, getState, setState, _injects }, ...args);
        };
    };
}
exports.mapAction = mapAction;
function getState(modulePath, name) {
    const module = _modules.find(m => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
    }
    return lodash_1.get(module.state, name);
}
exports.getState = getState;
function setState(modulePath, name, value) {
    const module = _modules.find(m => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
    }
    const oldValue = lodash_1.get(module.state, name);
    lodash_1.set(module.state, name, value);
    const watchers = [
        lodash_1.get(module.watch, name),
        ..._watchers
            .filter(w => w.path === [modulePath, name].join('/'))
            .map(item => item.func)
    ];
    watchers.forEach(func => func(value, oldValue, _injects));
}
exports.setState = setState;
// Call Actions
function dispatch(modulePath, name, ...args) {
    const module = _modules.find(m => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!extra_1.hasProperty(module.actions, name)) {
        throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
    }
    const originalFuntion = module.actions[name];
    // call function
    return originalFuntion({ state: Object, getState, setState, _injects }, ...args);
}
exports.dispatch = dispatch;
function addInjects(items) {
    Object.assign(_injects, items);
}
exports.addInjects = addInjects;
function removeInjects(...names) {
    names.forEach(key => {
        delete _injects[key];
    });
}
exports.removeInjects = removeInjects;
function addWatcher(path, name, func) {
    _watchers.push({
        path: [path, name].join('/'),
        func
    });
}
exports.addWatcher = addWatcher;
function removeWatcher(path, name, func) {
    _watchers.splice(_watchers.findIndex(w => w.path === [path, name].join('/') && w.func === func), 1);
}
exports.removeWatcher = removeWatcher;
//# sourceMappingURL=agstore.service.js.map