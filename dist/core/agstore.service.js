var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { hasProperty } from '../lib/extra';
import { set, get } from 'lodash';
let _modules = new Array();
const _watchers = new Array();
const _injects = {};
let AgStoreService = class AgStoreService {
    constructor(configs) {
        const { modules } = configs;
        _modules = modules || _modules;
    }
};
AgStoreService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], AgStoreService);
export { AgStoreService };
// decorator
export function mapState(modulePath, name) {
    const module = _modules.find((m) => m.nameSpace);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!hasProperty(module.state, name)) {
        throw new Error('AgStore Error: Cannot found state ' + name + ' in ' + modulePath);
    }
    return (target, propertyKey) => {
        Object.defineProperty(target, propertyKey, {
            get() {
                return module.state[name];
            },
            set(value) {
                setState(modulePath, name, value);
            },
        });
    };
}
// decorator
export function mapAction(modulePath, name) {
    const module = _modules.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!hasProperty(module.actions, name)) {
        throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
    }
    const originalFuntion = module.actions[name];
    return (target, propertyKey) => {
        target[propertyKey] = (...args) => {
            originalFuntion({ state: Object, getState, setState, _injects }, ...args);
        };
    };
}
export function getState(modulePath, name) {
    const module = _modules.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
    }
    return get(module.state, name);
}
export function setState(modulePath, name, value) {
    const module = _modules.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
    }
    const oldValue = get(module.state, name);
    set(module.state, name, value);
    const watchers = [
        get(module.watch, name),
        ..._watchers.filter((w) => w.path === [modulePath, name].join('/')).map((item) => item.func),
    ];
    watchers.forEach((func) => func(value, oldValue, _injects));
}
// Call Actions
export function dispatch(modulePath, name, ...args) {
    const module = _modules.find((m) => m.nameSpace === modulePath);
    if (!module) {
        throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
    }
    if (!hasProperty(module.actions, name)) {
        throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
    }
    const originalFuntion = module.actions[name];
    // call function
    return originalFuntion({ state: Object, getState, setState, _injects }, ...args);
}
export function addInjects(items) {
    Object.assign(_injects, items);
}
export function removeInjects(...names) {
    names.forEach((key) => {
        delete _injects[key];
    });
}
export function addWatcher(path, name, func) {
    _watchers.push({
        path: [path, name].join('/'),
        func,
    });
}
export function removeWatcher(path, name, func) {
    _watchers.splice(_watchers.findIndex((w) => w.path === [path, name].join('/') && w.func === func), 1);
}
//# sourceMappingURL=agstore.service.js.map