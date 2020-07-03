import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
let DeleteNotificationDialogComponent = class DeleteNotificationDialogComponent {
    constructor(dialogRef, data, notificator, translate, registrarService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.registrarService = registrarService;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.mails);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        if (this.data.groupId) {
            for (const mail of this.data.mails) {
                this.registrarService.deleteApplicationMailForGroup(this.data.groupId, mail.id).subscribe(() => {
                    this.dialogRef.close(true);
                });
            }
        }
        else {
            for (const mail of this.data.mails) {
                this.registrarService.deleteApplicationMailForVo(this.data.voId, mail.id).subscribe(() => {
                    this.dialogRef.close(true);
                });
            }
        }
    }
    getMailType(applicationMail) {
        let value = '';
        // @ts-ignore
        if (applicationMail.mailType === undefined || applicationMail.mailType === null || applicationMail.mailType === '') {
            value = '';
        }
        else {
            this.translate.get('VO_DETAIL.SETTINGS.NOTIFICATIONS.MAIL_TYPE_' + applicationMail.mailType).subscribe(text => {
                value = text;
            });
        }
        return value;
    }
};
DeleteNotificationDialogComponent = __decorate([
    Component({
        selector: 'app-delete-notification-dialog',
        templateUrl: './delete-notification-dialog.component.html',
        styleUrls: ['./delete-notification-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        RegistrarManagerService])
], DeleteNotificationDialogComponent);
export { DeleteNotificationDialogComponent };
//# sourceMappingURL=delete-notification-dialog.component.js.map