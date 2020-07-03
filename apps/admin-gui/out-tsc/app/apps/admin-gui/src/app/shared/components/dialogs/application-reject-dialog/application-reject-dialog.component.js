import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
let ApplicationRejectDialogComponent = class ApplicationRejectDialogComponent {
    constructor(dialogRef, data, translate, notificator, registrarManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.translate = translate;
        this.notificator = notificator;
        this.registrarManager = registrarManager;
        this.reason = '';
    }
    ngOnInit() {
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSubmit() {
        this.registrarManager.rejectApplication(this.data.applicationId, this.reason).subscribe(() => {
            this.translate.get('DIALOGS.REJECT_APPLICATION.SUCCESS').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close();
            });
        });
    }
};
ApplicationRejectDialogComponent = __decorate([
    Component({
        selector: 'app-application-reject-dialog',
        templateUrl: './application-reject-dialog.component.html',
        styleUrls: ['./application-reject-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, TranslateService,
        NotificatorService,
        RegistrarManagerService])
], ApplicationRejectDialogComponent);
export { ApplicationRejectDialogComponent };
//# sourceMappingURL=application-reject-dialog.component.js.map