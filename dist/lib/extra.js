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
function joinPath(...args) {
    return args
        .map((p) => p.replace(/\//g, '.').replace(/^\.|\.$/g, ''))
        .filter((item) => !!item)
        .join('.');
}
exports.joinPath = joinPath;
//# sourceMappingURL=extra.js.map