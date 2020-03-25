import { StoreModuleOptions, WatchFunction, AgStoreConfigRoot } from './type';
export declare function initStore(configs: AgStoreConfigRoot): void;
export declare function mapState(modulePath?: string, name?: string): (target: any, propertyKey: string | symbol) => void;
export declare function mapAction(modulePath?: string, name?: string): (target: any, propertyKey: string | symbol) => void;
export declare function getState(modulePath: string, name: string): any;
export declare function setState(modulePath: string, name: string, value: any): void;
export declare function dispatch(modulePath: string, name: string, ...args: any): Promise<any>;
export declare function addInjects(items: object): void;
export declare function removeInjects(...names: string[]): void;
export declare function addWatcher(path: string, name: string, func: WatchFunction): void;
export declare function removeWatcher(path: string, name: string, func: WatchFunction): void;
export declare class StoreModule {
    nameSpace: string;
    state: object;
    protected STATE: any;
    actions: object | any;
    watch: object;
    constructor(options: StoreModuleOptions);
}
