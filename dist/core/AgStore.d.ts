import { AgStoreConfigRoot, WatchFunction } from './type';
declare class AgStore {
    static initStore(configs: AgStoreConfigRoot): void;
    static mapState(modulePath?: string, name?: string): (target: any, propertyKey: string | symbol) => void;
    static mapAction(modulePath?: string, name?: string): (target: any, propertyKey: string | symbol) => void;
    static getState(modulePath: string, name: string): any;
    static setState(modulePath: string, name: string, value: any): void;
    static dispatch(modulePath: string, name: string, ...args: any): Promise<any>;
    static addInjects(items: object): void;
    static removeInjects(...names: string[]): void;
    static addWatcher(path: string, name: string, func: WatchFunction): void;
    static removeWatcher(path: string, name: string, func: WatchFunction): void;
}
export declare const initStore: typeof AgStore.initStore;
export declare const mapState: typeof AgStore.mapState;
export declare const mapAction: typeof AgStore.mapAction;
export declare const getState: typeof AgStore.getState;
export declare const setState: typeof AgStore.setState;
export declare const addWatcher: typeof AgStore.addWatcher;
export declare const removeWatcher: typeof AgStore.removeWatcher;
export declare const addInjects: typeof AgStore.addInjects;
export declare const removeInjects: typeof AgStore.removeInjects;
export {};
