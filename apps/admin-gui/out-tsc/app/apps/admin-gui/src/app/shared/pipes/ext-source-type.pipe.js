import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let ExtSourceTypePipe = 
/**
 * removes first 40 characters from string - 'cz.metacentrum.perun.core.impl.ExtSource'
 */
class ExtSourceTypePipe {
    transform(type, args) {
        return type.substring(40);
    }
};
ExtSourceTypePipe = __decorate([
    Pipe({
        name: 'extSourceType'
    })
    /**
     * removes first 40 characters from string - 'cz.metacentrum.perun.core.impl.ExtSource'
     */
], ExtSourceTypePipe);
export { ExtSourceTypePipe };
//# sourceMappingURL=ext-source-type.pipe.js.map