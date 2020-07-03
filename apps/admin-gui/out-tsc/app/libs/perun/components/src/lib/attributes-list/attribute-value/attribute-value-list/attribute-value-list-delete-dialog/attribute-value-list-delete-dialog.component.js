import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
let AttributeValueListDeleteDialogComponent = class AttributeValueListDeleteDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ngOnInit() {
    }
    cancel() {
        this.dialogRef.close();
    }
    submit() {
        this.dialogRef.close(true);
    }
};
AttributeValueListDeleteDialogComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attribute-value-list-delete-dialog',
        templateUrl: './attribute-value-list-delete-dialog.component.html',
        styleUrls: ['./attribute-value-list-delete-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object])
], AttributeValueListDeleteDialogComponent);
export { AttributeValueListDeleteDialogComponent };
//# sourceMappingURL=attribute-value-list-delete-dialog.component.js.map