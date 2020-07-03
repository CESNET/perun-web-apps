import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MembersService } from '@perun-web-apps/perun/services';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
let ChangeMemberStatusDialogComponent = class ChangeMemberStatusDialogComponent {
    constructor(dialogRef, data, memberService, notificatorService, translate, route) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.memberService = memberService;
        this.notificatorService = notificatorService;
        this.translate = translate;
        this.route = route;
        this.loading = false;
    }
    ngOnInit() {
        this.route.params.subscribe(parentParams => {
            if (parentParams['groupId']) {
                this.theme = 'group-theme';
            }
            else {
                this.theme = 'vo-theme';
            }
        });
    }
    cancel() {
        this.dialogRef.close();
    }
    submit() {
        this.loading = true;
        this.memberService.setStatus(this.data.member.id, 'VALID').subscribe(() => {
            this.translate.get('DIALOGS.CHANGE_STATUS.SUCCESS').subscribe(success => {
                this.notificatorService.showSuccess(success);
                this.dialogRef.close(true);
            });
        });
    }
};
ChangeMemberStatusDialogComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-change-member-status-dialog',
        templateUrl: './change-member-status-dialog.component.html',
        styleUrls: ['./change-member-status-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, MembersService,
        NotificatorService,
        TranslateService,
        ActivatedRoute])
], ChangeMemberStatusDialogComponent);
export { ChangeMemberStatusDialogComponent };
//# sourceMappingURL=change-member-status-dialog.component.js.map