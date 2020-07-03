import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import { parseVo } from '@perun-web-apps/perun/utils';
let UserVoPipe = class UserVoPipe {
    transform(value, args) {
        return parseVo(value);
    }
};
UserVoPipe = __decorate([
    Pipe({
        name: 'userVo'
    })
], UserVoPipe);
export { UserVoPipe };
//# sourceMappingURL=vo-or-ext-source.pipe.js.map