import { StoreModuleOptions, WatchFunction, WatchItem, AgStoreConfigRoot, Func } from './type';
import { hasProperty } from '../lib/extra';
import { set, get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { AgStoreState, ObjectFunctions } from '../lib/decorator';

const container = new Map<string, any>();
let MODULES: StoreModule[] = new Array<StoreModule>();
const WATCHERS: WatchItem[] = new Array<WatchItem>();
const INJECTS: object | any = {};

export function initStore(configs: AgStoreConfigRoot) {
  const { modules } = configs;
  MODULES = modules || MODULES;
}

// decorator
export function mapState(modulePath?: string, name?: string) {
  if (arguments.length === 1) {
    name = joinPath(modulePath);
    modulePath = '';
  } else if (arguments.length === 2) {
    name = joinPath(name);
  }

  const module: StoreModule = MODULES.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
  }
  if (!hasProperty(module.state, name)) {
    throw new Error('AgStore Error: Cannot found state ' + name + ' in ' + modulePath);
  }

  return (target: any, propertyKey: string | symbol) => {
    Object.defineProperty(target, propertyKey, {
      get() {
        return get(module.state, name);
      },
      set(value) {
        set(module.state, name, value);
      },
    });
  };
}

// decorator
export function mapAction(modulePath?: string, name?: string) {
  if (arguments.length === 1) {
    name = joinPath(modulePath);
    modulePath = '';
  } else if (arguments.length === 2) {
    name = joinPath(name);
  }

  const module: StoreModule | null = MODULES.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
  }
  if (!hasProperty(module.actions, name)) {
    throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
  }
  const originalFuntion: Func = module.actions[name];
  return (target: any, propertyKey: string | symbol) => {
    target[propertyKey] = (...args: any) => {
      originalFuntion({ state: module.state, getState, setState, INJECTS }, ...args);
    };
  };
}

export function getState(modulePath: string, name: string): any {
  const module: StoreModule = MODULES.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
  }
  return get(module.state, name);
}

export function setState(modulePath: string, name: string, value: any) {
  const module: StoreModule = MODULES.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error(getState): Cannot found moudle ' + modulePath);
  }
}

// Call Actions
export function dispatch(modulePath: string, name: string, ...args: any): Promise<any> {
  const module: StoreModule = MODULES.find((m) => m.nameSpace === modulePath);
  if (!module) {
    throw new Error('AgStore Error: Cannot found moudle ' + modulePath);
  }
  if (!hasProperty(module.actions, name)) {
    throw new Error('AgStore Error: Cannot found action ' + name + ' in ' + modulePath);
  }
  const originalFuntion: Func = module.actions[name];
  // call function
  return originalFuntion({ state: module.state, getState, setState, INJECTS }, ...args);
}

export function addInjects(items: object) {
  Object.assign(INJECTS, items);
}

export function removeInjects(...names: string[]) {
  names.forEach((key) => {
    delete INJECTS[key];
  });
}

export function addWatcher(path: string, name: string, func: WatchFunction) {
  WATCHERS.push({
    path: [path, name].join('/'),
    func,
  });
}

export function removeWatcher(path: string, name: string, func: WatchFunction) {
  WATCHERS.splice(
    WATCHERS.findIndex((w) => w.path === joinPath(path, name) && w.func === func),
    1,
  );
}

// ------ Classs

export class StoreModule {
  nameSpace: string;

  @AgStoreState
  state: object = {};
  protected STATE: any;

  @ObjectFunctions
  actions: object | any;

  @ObjectFunctions
  watch: object;

  constructor(options: StoreModuleOptions) {
    this.nameSpace = options.nameSpace || '';
    this.STATE = options.state || {};
    this.actions = options.actions || {};
    this.watch = options.watch || {};
    defineState(this.state, this.STATE, this);
  }
}

function defineState(target: any, source: any, context: StoreModule, path = '') {
  Object.keys(source).forEach((name) => {
    const key = uuidv4();
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

function findAndRunWatcher(module: StoreModule, name: string, value: any, oldValue: any) {
  const watchers: WatchFunction[] = [
    get(module.watch, name),
    ...WATCHERS.filter((w) => w.path === joinPath(module.nameSpace, name)).map((item) => item.func),
  ].filter((f) => typeof f === 'function');
  watchers.forEach((func) => func(value, oldValue, INJECTS));
}

function joinPath(...args: string[]) {
  return args
    .map((p) => p.replace(/\//g, '.').replace(/^\.|\.$/g, ''))
    .filter((item) => !!item)
    .join('.');
}
