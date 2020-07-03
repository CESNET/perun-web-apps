import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
let DisplayedRolePipe = class DisplayedRolePipe {
    constructor(translate) {
        this.translate = translate;
        this.prefix = 'ROLES.';
    }
    transform(value, args) {
        const data = this.prefix.concat(value);
        return this.translate.instant(data);
    }
};
DisplayedRolePipe = __decorate([
    Pipe({
        name: 'displayedRole'
    }),
    __metadata("design:paramtypes", [TranslateService])
], DisplayedRolePipe);
export { DisplayedRolePipe };
//# sourceMappingURL=displayed-role.pipe.js.map