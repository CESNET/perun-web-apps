import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
let CreateVoDialogComponent = class CreateVoDialogComponent {
    constructor(dialogRef, data, notificator, voService, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.voService = voService;
        this.translate = translate;
        translate.get('DIALOGS.CREATE_VO.SUCCESS').subscribe(value => this.successMessage = value);
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.shortNameCtrl = new FormControl(null, [Validators.required, Validators.pattern('^[\\w.-]+$'), Validators.maxLength(33)]);
        this.fullNameCtrl = new FormControl(null, [Validators.required, Validators.pattern('.*[\\S]+.*'), Validators.maxLength(129)]);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        this.voService.createVoWithName(this.fullNameCtrl.value, this.shortNameCtrl.value).subscribe(() => {
            this.notificator.showSuccess(this.successMessage);
            this.loading = false;
            this.dialogRef.close(true);
        }, () => this.loading = false);
    }
};
CreateVoDialogComponent = __decorate([
    Component({
        selector: 'app-create-vo-dialog',
        templateUrl: './create-vo-dialog.component.html',
        styleUrls: ['./create-vo-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        VosManagerService,
        TranslateService])
], CreateVoDialogComponent);
export { CreateVoDialogComponent };
//# sourceMappingURL=create-vo-dialog.component.js.map