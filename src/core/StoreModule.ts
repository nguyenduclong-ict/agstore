import { AgStoreState, ObjectFunctions } from '../lib/decorator';
import { StoreModuleOptions, WatchFunction } from '.';
import { joinPath } from '../lib/extra';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Store from './store';

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
    Store.container.set(key, source[name]);

    Object.defineProperty(target, name, {
      get() {
        return Store.container.get(key);
      },
      set(value) {
        const oldValue = Store.container.get(key);
        Store.container.set(key, value);
        findAndRunWatcher(context, joinPath(path, name), value, oldValue);
      },
    });

    if (typeof source[name] === 'object') {
      defineState(Store.container.get(key), source[name], context, joinPath(path, name));
    }
  });
}

function findAndRunWatcher(module: StoreModule, name: string, value: any, oldValue: any) {
  const watchers: WatchFunction[] = [
    get(module.watch, name),
    ...Store.WATCHERS.filter((w) => w.path === joinPath(module.nameSpace, name)).map((item) => item.func),
  ].filter((f) => typeof f === 'function');
  watchers.forEach((func) => func(value, oldValue, Store.INJECTS));
}
