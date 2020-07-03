import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { parseEmail } from '@perun-web-apps/perun/utils';
let MemberEmailPipe = class MemberEmailPipe {
    transform(value, args) {
        return parseEmail(value);
    }
};
MemberEmailPipe = __decorate([
    Pipe({
        name: 'memberEmail'
    })
], MemberEmailPipe);
export { MemberEmailPipe };
//# sourceMappingURL=member-email.pipe.js.map