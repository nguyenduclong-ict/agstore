import { AgStoreConfigRoot, Func, WatchFunction } from './type';
import { get, set } from 'lodash';
import { joinPath, hasProperty } from '../lib/extra';
import { formatParams } from '../lib/decorator';
import Store from './store';
import { StoreModule } from './StoreModule';

class AgStore {
  static initStore(configs: AgStoreConfigRoot) {
    const { modules, injects, watchers } = configs;
    Store.MODULES = modules || Store.MODULES;
    Store.INJECTS = injects || Store.INJECTS;
    for (const key in watchers) {
      if (watchers.hasOwnProperty(key)) {
        Store.WATCHERS.push({ path: key, func: watchers[key] });
      }
    }
  }

  @formatParams
  static mapState(modulePath?: string, name?: string) {
    const module: StoreModule = Store.MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
      throw new Error('AgStore Error - (MapState): Cannot found moudle "' + modulePath + '"');
    }
    if (!hasProperty(module.state, name)) {
      throw new Error('AgStore Error - (MapState): Cannot found state "' + name + '" in "' + modulePath + '"');
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

  @formatParams
  static mapAction(modulePath?: string, name?: string) {
    const module: StoreModule | null = Store.MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
      throw new Error('AgStore Error - (mapAction): Cannot found moudle ' + `"${modulePath}"`);
    }
    if (!hasProperty(module.actions, name)) {
      throw new Error(`AgStore Error - (mapAction): Cannot found action "${name}" + name in "${modulePath}"`);
    }
    const originalFuntion: Func = module.actions[name];
    return (target: any, propertyKey: string | symbol) => {
      target[propertyKey] = (...args: any) => {
        originalFuntion(
          {
            state: module.state,
            getState,
            setState,
            ...Store.INJECTS,
          },
          ...args,
        );
      };
    };
  }

  static getState(modulePath: string, name: string): any {
    const module: StoreModule = Store.MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
      throw new Error('AgStore Error - (getState): Cannot found moudle ' + `"${modulePath}"`);
    }
    return get(module.state, name);
  }

  static setState(modulePath: string, name: string, value: any) {
    const module: StoreModule = Store.MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
      throw new Error('AgStore Error - (getState): Cannot found moudle ' + `"${modulePath}"`);
    }
    set(module.state, name, value);
  }

  // Call Actions
  static dispatch(modulePath: string, name: string, ...args: any): Promise<any> {
    const module: StoreModule = Store.MODULES.find((m) => m.nameSpace === modulePath);
    if (!module) {
      throw new Error('AgStore Error - (dispatchAction): Cannot found moudle ' + `"${modulePath}"`);
    }
    if (!hasProperty(module.actions, name)) {
      throw new Error(`AgStore Error - (dispatchAction): Cannot found action "${name}" + name in "${modulePath}"`);
    }
    const originalFuntion: Func = module.actions[name];
    // call function
    return originalFuntion(
      {
        state: module.state,
        getState,
        setState,
        ...Store.INJECTS,
      },
      ...args,
    );
  }

  static addInjects(items: object) {
    Object.assign(Store.INJECTS, items);
  }

  static removeInjects(...names: string[]) {
    names.forEach((key) => {
      delete Store.INJECTS[key];
    });
  }

  static addWatcher(path: string, name: string, func: WatchFunction) {
    Store.WATCHERS.push({
      path: joinPath(path, name),
      func,
    });
  }

  static removeWatcher(path: string, name: string, func: WatchFunction) {
    Store.WATCHERS.splice(
      Store.WATCHERS.findIndex((w) => w.path === joinPath(path, name) && w.func === func),
      1,
    );
  }
}

export const initStore = AgStore.initStore;
export const mapState = AgStore.mapState;
export const mapAction = AgStore.mapAction;
export const getState = AgStore.getState;
export const setState = AgStore.setState;
export const addWatcher = AgStore.addWatcher;
export const removeWatcher = AgStore.removeWatcher;
export const addInjects = AgStore.addInjects;
export const removeInjects = AgStore.removeInjects;
