var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ObjectFunctions, AgStoreState } from '../lib/decorator';
export class StoreModule {
    constructor(options) {
        this.nameSpace = options.nameSpace || '';
        this.state = options.state || {};
        this.actions = options.actions || {};
        this.watch = options.watch || {};
    }
}
__decorate([
    AgStoreState
], StoreModule.prototype, "state", void 0);
__decorate([
    ObjectFunctions
], StoreModule.prototype, "actions", void 0);
__decorate([
    ObjectFunctions
], StoreModule.prototype, "watch", void 0);
//# sourceMappingURL=type.js.map