import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let NameSpaceToDefPipe = class NameSpaceToDefPipe {
    transform(value, args) {
        if (value === null) {
            return null;
        }
        const stringValue = value;
        return stringValue.substring(stringValue.lastIndexOf(':') + 1, stringValue.length);
    }
};
NameSpaceToDefPipe = __decorate([
    Pipe({
        name: 'nameSpaceToDef'
    })
], NameSpaceToDefPipe);
export { NameSpaceToDefPipe };
//# sourceMappingURL=name-space-to-def.pipe.js.map