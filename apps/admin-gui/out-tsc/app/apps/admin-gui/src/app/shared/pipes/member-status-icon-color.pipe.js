import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let MemberStatusIconColorPipe = class MemberStatusIconColorPipe {
    /**
     * Return color which should be used for icon of given member's status.
     *
     */
    transform(value, args) {
        switch (value) {
            case 'VALID':
                return 'green';
            case 'INVALID':
                return 'red';
            default:
                return '';
        }
    }
};
MemberStatusIconColorPipe = __decorate([
    Pipe({
        name: 'memberStatusIconColor'
    })
], MemberStatusIconColorPipe);
export { MemberStatusIconColorPipe };
//# sourceMappingURL=member-status-icon-color.pipe.js.map