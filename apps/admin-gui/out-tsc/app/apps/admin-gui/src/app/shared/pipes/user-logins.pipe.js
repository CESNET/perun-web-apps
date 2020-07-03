import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { parseUserLogins } from '@perun-web-apps/perun/utils';
let UserLoginsPipe = class UserLoginsPipe {
    transform(value, ...args) {
        return parseUserLogins(value);
    }
};
UserLoginsPipe = __decorate([
    Pipe({
        name: 'userLogins'
    })
], UserLoginsPipe);
export { UserLoginsPipe };
//# sourceMappingURL=user-logins.pipe.js.map