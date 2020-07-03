import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let UserFullNamePipe = class UserFullNamePipe {
    transform(value, args) {
        const user = value;
        let fullName = '';
        if (user.titleBefore !== null) {
            fullName += user.titleBefore + ' ';
        }
        if (user.firstName !== null) {
            fullName += user.firstName + ' ';
        }
        if (user.middleName !== null) {
            fullName += user.middleName + ' ';
        }
        if (user.lastName !== null) {
            fullName += user.lastName + ' ';
        }
        if (user.titleAfter !== null) {
            fullName += user.titleAfter + ' ';
        }
        if (fullName.endsWith(' ')) {
            fullName = fullName.substring(0, fullName.length - 1);
        }
        return fullName;
    }
};
UserFullNamePipe = __decorate([
    Pipe({
        name: 'userFullName'
    })
], UserFullNamePipe);
export { UserFullNamePipe };
//# sourceMappingURL=user-full-name.pipe.js.map