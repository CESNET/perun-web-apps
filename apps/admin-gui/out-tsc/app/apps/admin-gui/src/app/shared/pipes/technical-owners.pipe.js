import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { parseTechnicalOwnersNames } from '@perun-web-apps/perun/utils';
let TechnicalOwnersPipe = class TechnicalOwnersPipe {
    transform(value, ...args) {
        return parseTechnicalOwnersNames(value);
    }
};
TechnicalOwnersPipe = __decorate([
    Pipe({
        name: 'technicalOwners'
    })
], TechnicalOwnersPipe);
export { TechnicalOwnersPipe };
//# sourceMappingURL=technical-owners.pipe.js.map