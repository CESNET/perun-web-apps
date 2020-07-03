import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let IsVirtualAttributePipe = class IsVirtualAttributePipe {
    transform(attribute, args) {
        return attribute.namespace.split(':')[4] === 'virt';
    }
};
IsVirtualAttributePipe = __decorate([
    Pipe({
        name: 'isVirtualAttribute',
        pure: true
    })
], IsVirtualAttributePipe);
export { IsVirtualAttributePipe };
//# sourceMappingURL=is-virtual-attribute.pipe.js.map