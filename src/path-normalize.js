"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function pathNormalize(path) {
    const split = path.split(/\/|\\/);
    return split.join(path_1.sep);
}
exports.pathNormalize = pathNormalize;
/* console.log(pathNormalize('a/b/c') === 'a/b/c');
console.log(pathNormalize('a/b/c/') === 'a/b/c/');
console.log(pathNormalize('a\\b\\c') === 'a/b/c');
console.log(pathNormalize('a\\b\\c\\d\\') === 'a/b/c/d/');
console.log(pathNormalize('a\\b/c\\d/') === 'a/b/c/d/'); */
//# sourceMappingURL=path-normalize.js.map