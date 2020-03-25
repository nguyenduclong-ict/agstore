import { StoreModule } from "./StoreModule";

export interface StoreModuleOptions {
  nameSpace?: string;
  state: object;
  actions?: object; // optional
  watch?: object; // optional
}

export type Func = (...args: any[]) => any;

export type WatchFunction = (
  value: any,
  oldValue: any,
  injects?: { getState: Func; setState: Func } | any
) => Promise<any>;

export type ActionFunction = (
  injects?: { getState?: Func; setState?: Func } | any,
  ...args: any
) => Promise<any>;

export interface WatchItem {
  path: string;
  func: WatchFunction;
}

export class AgstoreConfigRoot {
  modules?: StoreModule[];
  injects?: object | any;
  watchers?: object | any;
}
