import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
let ApplicationReSendNotificationDialogComponent = class ApplicationReSendNotificationDialogComponent {
    constructor(dialogRef, data, translate, notificator, registrarManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.translate = translate;
        this.notificator = notificator;
        this.registrarManager = registrarManager;
        this.mailType = 'APP_CREATED_USER';
        this.reason = '';
    }
    ngOnInit() {
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSubmit() {
        if (this.mailType === 'APP_REJECTED_USER') {
            this.registrarManager.sendMessage({ applicationId: this.data.applicationId, mailType: this.mailType, reason: this.reason }).subscribe(() => {
                this.translate.get('DIALOGS.RE_SEND_NOTIFICATION.SUCCESS').subscribe(successMessage => {
                    this.notificator.showSuccess(successMessage);
                    this.dialogRef.close();
                });
            });
        }
        else {
            this.registrarManager.sendMessage({ applicationId: this.data.applicationId, mailType: this.mailType }).subscribe(() => {
                this.translate.get('DIALOGS.RE_SEND_NOTIFICATION.SUCCESS').subscribe(successMessage => {
                    this.notificator.showSuccess(successMessage);
                    this.dialogRef.close();
                });
            });
        }
    }
};
ApplicationReSendNotificationDialogComponent = __decorate([
    Component({
        selector: 'app-application-re-send-notification-dialog',
        templateUrl: './application-re-send-notification-dialog.component.html',
        styleUrls: ['./application-re-send-notification-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, TranslateService,
        NotificatorService,
        RegistrarManagerService])
], ApplicationReSendNotificationDialogComponent);
export { ApplicationReSendNotificationDialogComponent };
//# sourceMappingURL=application-re-send-notification-dialog.component.js.map