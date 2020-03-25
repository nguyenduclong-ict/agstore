"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasProperty(obj, property) {
    let current = obj;
    if (typeof property === 'string') {
        property = property.split(/\.|\//);
    }
    return property.every((prop) => {
        if (typeof current === 'object' && current.hasOwnProperty(prop)) {
            current = current[prop];
            return true;
        }
        return false;
    });
}
exports.hasProperty = hasProperty;
//# sourceMappingURL=extra.js.map