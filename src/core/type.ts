import { ObjectFunctions, AgStoreState } from '../lib/decorator';

interface StoreModuleOptions {
  nameSpace: string;
  state: object;
  actions: object;
  watch: object;
}

export class StoreModule {
  nameSpace: string;

  @AgStoreState
  state: object;

  @ObjectFunctions
  actions: object;

  @ObjectFunctions
  watch: object;

  constructor(options: StoreModuleOptions) {
    this.nameSpace = options.nameSpace || '';
    this.state = options.state || {};
    this.actions = options.actions || {};
    this.watch = options.watch || {};
  }
}

export type Func = (...args) => any;

export type WatchFunction = (
  value: any,
  oldValue: any,
  injects?: { getState: Func; setState: Func } | any,
) => Promise<any>;

export type ActionFunction = (injects?: { getState: Func; setState: Func } | any, ...args: any) => Promise<any>;

export interface WatchItem {
  path: string;
  func: WatchFunction;
}

export interface AgStoreConfigRoot {
  modules: StoreModule[];
}
