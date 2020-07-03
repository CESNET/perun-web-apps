import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
let DeleteApplicationFormItemDialogComponent = class DeleteApplicationFormItemDialogComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    ngOnInit() {
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    submit() {
        this.dialogRef.close(true);
    }
};
DeleteApplicationFormItemDialogComponent = __decorate([
    Component({
        selector: 'app-delete-application-form-item-dialog',
        templateUrl: './delete-application-form-item-dialog.component.html',
        styleUrls: ['./delete-application-form-item-dialog.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialogRef])
], DeleteApplicationFormItemDialogComponent);
export { DeleteApplicationFormItemDialogComponent };
//# sourceMappingURL=delete-application-form-item-dialog.component.js.map