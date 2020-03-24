interface StoreModuleOptions {
    nameSpace: string;
    state: object;
    actions: object;
    watch: object;
}
export declare class StoreModule {
    nameSpace: string;
    state: object;
    actions: object;
    watch: object;
    constructor(options: StoreModuleOptions);
}
export declare type Func = (...args: any[]) => any;
export declare type WatchFunction = (value: any, oldValue: any, injects?: {
    getState: Func;
    setState: Func;
} | any) => Promise<any>;
export declare type ActionFunction = (injects?: {
    getState: Func;
    setState: Func;
} | any, ...args: any) => Promise<any>;
export interface WatchItem {
    path: string;
    func: WatchFunction;
}
export interface AgStoreConfigRoot {
    modules: StoreModule[];
}
export {};
