"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-console
const extra_1 = require("./extra");
function ObjectFunctions(target, propertyKey) {
    return;
}
exports.ObjectFunctions = ObjectFunctions;
function AgStoreState(target, propertyKey) {
    return;
}
exports.AgStoreState = AgStoreState;
function formatParams(target, propertyName, propertyDesciptor) {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = function (...args) {
        const newArgs = [];
        if (args.length === 1) {
            newArgs.push('');
            newArgs.push(extra_1.joinPath(args.shift()));
        }
        else if (arguments.length === 2) {
            newArgs.push(args.shift());
            newArgs.push(extra_1.joinPath(args.pop()));
        }
        return method.call(this, ...newArgs);
    };
    return propertyDesciptor;
}
exports.formatParams = formatParams;
//# sourceMappingURL=decorator.js.map