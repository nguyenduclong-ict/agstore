"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agstore_service_1 = require("./agstore.service");
class AgStoreModule {
    static forRoot(configs) {
        return {
            ngModule: AgStoreModule,
            providers: [{ provide: agstore_service_1.AgStoreService, useValue: configs }]
        };
    }
}
exports.AgStoreModule = AgStoreModule;
//# sourceMappingURL=agstore.module.js.map