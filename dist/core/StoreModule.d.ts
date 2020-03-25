import { StoreModuleOptions } from '.';
export declare class StoreModule {
    nameSpace: string;
    state: object;
    actions: object | any;
    watch: object;
    constructor(options: StoreModuleOptions);
}
