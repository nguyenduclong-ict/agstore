import { StoreModule } from '.';

export interface StoreModuleOptions {
  nameSpace: string;
  state: object;
  actions: object;
  watch: object;
}

export type Func = (...args: any[]) => any;

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
