import { StoreModuleOptions } from '.';
export declare class StoreModule {
    nameSpace: string;
    state: object;
    protected STATE: any;
    actions: object | any;
    watch: object;
    constructor(options: StoreModuleOptions);
}
