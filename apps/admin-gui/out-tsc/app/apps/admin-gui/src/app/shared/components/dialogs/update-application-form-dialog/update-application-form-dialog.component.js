import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
let UpdateApplicationFormDialogComponent = class UpdateApplicationFormDialogComponent {
    constructor(dialogRef, data, registrarManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.registrarManager = registrarManager;
    }
    ngOnInit() {
        this.applicationForm = this.data.applicationForm;
        this.moduleName = this.applicationForm.moduleClassName;
        this.initialState = this.applicationForm.automaticApproval ? 'auto' : 'manual';
        this.extensionState = this.applicationForm.automaticApprovalExtension ? 'auto' : 'manual';
    }
    onCancel() {
        this.dialogRef.close();
    }
    submit() {
        this.applicationForm.moduleClassName = this.moduleName;
        this.applicationForm.automaticApproval = this.initialState === 'auto';
        this.applicationForm.automaticApprovalExtension = this.extensionState === 'auto';
        this.registrarManager.updateForm({ applicationForm: this.applicationForm }).subscribe(updatedForm => {
            this.dialogRef.close(updatedForm);
        });
    }
};
UpdateApplicationFormDialogComponent = __decorate([
    Component({
        selector: 'app-update-application-form-dialog',
        templateUrl: './update-application-form-dialog.component.html',
        styleUrls: ['./update-application-form-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, RegistrarManagerService])
], UpdateApplicationFormDialogComponent);
export { UpdateApplicationFormDialogComponent };
//# sourceMappingURL=update-application-form-dialog.component.js.map