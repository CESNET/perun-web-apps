import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
let InviteMemberDialogComponent = class InviteMemberDialogComponent {
    constructor(dialogRef, data, registrarManager, snackBar, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.registrarManager = registrarManager;
        this.snackBar = snackBar;
        this.translate = translate;
        this.emailForm = new FormControl('', [Validators.required, Validators.email]);
        this.language = 'en';
        this.name = '';
    }
    ngOnInit() {
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSubmit() {
        if (this.emailForm.invalid || this.name === '') {
            return;
        }
        else {
            this.registrarManager.sendInvitation(this.emailForm.value, 'en', this.data.voId).subscribe(() => {
                this.translate.get('DIALOGS.INVITE_MEMBER.SUCCESS').subscribe(successMessage => {
                    this.snackBar.open(successMessage, null, { duration: 5000 });
                    this.dialogRef.close();
                });
            });
        }
    }
};
InviteMemberDialogComponent = __decorate([
    Component({
        selector: 'app-invite-member-dialog',
        templateUrl: './invite-member-dialog.component.html',
        styleUrls: ['./invite-member-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, RegistrarManagerService,
        MatSnackBar,
        TranslateService])
], InviteMemberDialogComponent);
export { InviteMemberDialogComponent };
//# sourceMappingURL=invite-member-dialog.component.js.map