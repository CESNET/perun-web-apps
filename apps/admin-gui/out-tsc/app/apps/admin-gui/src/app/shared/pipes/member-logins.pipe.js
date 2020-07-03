import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { parseLogins } from '@perun-web-apps/perun/utils';
let MemberLoginsPipe = class MemberLoginsPipe {
    transform(value, args) {
        return parseLogins(value);
    }
};
MemberLoginsPipe = __decorate([
    Pipe({
        name: 'memberLogins'
    })
], MemberLoginsPipe);
export { MemberLoginsPipe };
//# sourceMappingURL=member-logins.pipe.js.map