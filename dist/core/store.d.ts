import { StoreModule } from './StoreModule';
import { WatchItem } from '.';
export default class Store {
    static container: Map<string, any>;
    static MODULES: StoreModule[];
    static WATCHERS: WatchItem[];
    static INJECTS: object | any;
}
