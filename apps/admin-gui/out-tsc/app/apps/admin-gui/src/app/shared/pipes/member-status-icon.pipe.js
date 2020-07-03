import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let MemberStatusIconPipe = class MemberStatusIconPipe {
    /**
     * Return string representing Material icon for status of given member.
     *
     * @param value string status
     * @param args not used
     */
    transform(value, args) {
        switch (value) {
            case 'VALID':
                return 'verified_user';
            case 'INVALID':
                return 'report';
            case 'SUSPENDED':
                return 'lock';
            case 'EXPIRED':
                return 'schedule';
            case 'DISABLED':
                return 'delete';
            default:
                return value;
        }
    }
};
MemberStatusIconPipe = __decorate([
    Pipe({
        name: 'memberStatusIcon'
    })
], MemberStatusIconPipe);
export { MemberStatusIconPipe };
//# sourceMappingURL=member-status-icon.pipe.js.map