import { StoreModule } from './StoreModule';
import { WatchItem } from '.';

export default class Store {
  static container: Map<string, any> = new Map<string, any>();
  static MODULES: StoreModule[] = new Array<StoreModule>();
  static WATCHERS: WatchItem[] = new Array<WatchItem>();
  static INJECTS: object | any = {};
}
