import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let AttributeTypeCleanPipe = class AttributeTypeCleanPipe {
    transform(value, args) {
        if (value === null) {
            return null;
        }
        const stringValue = value;
        return stringValue.substring(stringValue.lastIndexOf('.') + 1, stringValue.length);
    }
};
AttributeTypeCleanPipe = __decorate([
    Pipe({
        name: 'attributeTypeClean'
    })
], AttributeTypeCleanPipe);
export { AttributeTypeCleanPipe };
//# sourceMappingURL=attribute-type-clean.pipe.js.map