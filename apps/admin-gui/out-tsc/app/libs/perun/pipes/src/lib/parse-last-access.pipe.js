import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let ParseLastAccessPipe = class ParseLastAccessPipe {
    transform(value, args) {
        return value.split('.')[0];
    }
};
ParseLastAccessPipe = __decorate([
    Pipe({
        name: 'parseLastAccess',
        pure: true
    })
], ParseLastAccessPipe);
export { ParseLastAccessPipe };
//# sourceMappingURL=parse-last-access.pipe.js.map