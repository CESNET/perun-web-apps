import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
let ApplicationStatePipe = class ApplicationStatePipe {
    constructor(translate) {
        this.translate = translate;
        this.returnData = '';
    }
    transform(value, args) {
        switch (value) {
            case 'APPROVED': {
                this.translate.get('VO_DETAIL.APPLICATION.STATE.APPROVED').subscribe(response => {
                    this.returnData = `<i class="material-icons green">done</i>${response}`;
                });
                break;
            }
            case 'REJECTED': {
                this.translate.get('VO_DETAIL.APPLICATION.STATE.REJECTED').subscribe(response => {
                    this.returnData = `<i class="material-icons red">clear</i>${response}`;
                });
                break;
            }
            case 'NEW': {
                this.translate.get('VO_DETAIL.APPLICATION.STATE.NEW').subscribe(response => {
                    this.returnData = `<i class="material-icons orange">contact_mail</i> ${response}`;
                });
                break;
            }
            case 'VERIFIED': {
                this.translate.get('VO_DETAIL.APPLICATION.STATE.VERIFIED').subscribe(response => {
                    this.returnData = `<i class="material-icons blue">find_replace</i>${response}`;
                });
                break;
            }
            default: {
                this.returnData = value;
                break;
            }
        }
        return this.returnData;
    }
};
ApplicationStatePipe = __decorate([
    Pipe({
        name: 'applicationState',
        pure: false
    }),
    __metadata("design:paramtypes", [TranslateService])
], ApplicationStatePipe);
export { ApplicationStatePipe };
//# sourceMappingURL=application-state.pipe.js.map