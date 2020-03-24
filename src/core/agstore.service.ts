import { Injectable } from '@angular/core';
import { StoreModule, WatchFunction, WatchItem, AgStoreConfigRoot, Func } from './type';
import { hasProperty } from '../lib/extra';
import { set, get } from 'lodash';

let _modules: StoreModule[] = new Array<StoreModule>();
const _watchers: WatchItem[] = new Array<WatchItem>();
const _injects: object = {};

@Injectable({
  providedIn: 'root',
})
export class AgStoreService {
  constructor(configs: AgStoreConfigRoot) {
    const { modules } = configs;
    _modules = modules || _modules;
  }
}

// decorator
export function mapState(modulePath: string, name: string) {
  const module: StoreModule = _modules.find((m) => m.nameSpace);
  if (!module) {
    throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
  }
  if (!hasProperty(module.state, name)) {
    throw new Error('AgStore Error: Cannot found state ' + name + ' in ' + modulePath);
  }

  return (target: any, propertyKey: string | symbol) => {
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
export function mapAction(modulePath: string, name: string) {
  const module: StoreModule | null = _modules.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
  }
  if (!hasProperty(module.actions, name)) {
    throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
  }
  const originalFuntion: Func = module.actions[name];
  return (target: any, propertyKey: string | symbol) => {
    target[propertyKey] = (...args: any) => {
      originalFuntion({ state: Object, getState, setState, _injects }, ...args);
    };
  };
}

export function getState(modulePath: string, name: string): any {
  const module: StoreModule = _modules.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
  }
  return get(module.state, name);
}

export function setState(modulePath: string, name: string, value: any) {
  const module: StoreModule = _modules.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
  }
  const oldValue = get(module.state, name);
  set(module.state, name, value);
  const watchers: WatchFunction[] = [
    get(module.watch, name),
    ..._watchers.filter((w) => w.path === [modulePath, name].join('/')).map((item) => item.func),
  ];

  watchers.forEach((func) => func(value, oldValue, _injects));
}

// Call Actions
export function dispatch(modulePath: string, name: string, ...args: any): Promise<any> {
  const module: StoreModule = _modules.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
  }
  if (!hasProperty(module.actions, name)) {
    throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
  }
  const originalFuntion: Func = module.actions[name];
  // call function
  return originalFuntion({ state: Object, getState, setState, _injects }, ...args);
}

export function addInjects(items: object) {
  Object.assign(_injects, items);
}

export function removeInjects(...names: string[]) {
  names.forEach((key) => {
    delete _injects[key];
  });
}

export function addWatcher(path: string, name: string, func: WatchFunction) {
  _watchers.push({
    path: [path, name].join('/'),
    func,
  });
}

export function removeWatcher(path: string, name: string, func: WatchFunction) {
  _watchers.splice(
    _watchers.findIndex((w) => w.path === [path, name].join('/') && w.func === func),
    1,
  );
}
