import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { parseUserEmail } from '@perun-web-apps/perun/utils';
let UserEmailPipe = class UserEmailPipe {
    transform(value, ...args) {
        return parseUserEmail(value);
    }
};
UserEmailPipe = __decorate([
    Pipe({
        name: 'userEmail'
    })
], UserEmailPipe);
export { UserEmailPipe };
//# sourceMappingURL=user-email.pipe.js.map