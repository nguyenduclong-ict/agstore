import { AgStoreService } from './agstore.service';
export class AgStoreModule {
    static forRoot(configs) {
        return {
            ngModule: AgStoreModule,
            providers: [{ provide: AgStoreService, useValue: configs }],
        };
    }
}
//# sourceMappingURL=agstore.module.js.map