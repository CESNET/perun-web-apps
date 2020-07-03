import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
let AttributeValueListEditDialogComponent = class AttributeValueListEditDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.attributeValue = '';
    }
    ngOnInit() {
        this.attributeValue = this.data.attribute.value[this.data.index];
    }
    cancel() {
        this.dialogRef.close();
    }
    submit() {
        this.data.attribute.value[this.data.index] = this.attributeValue;
        this.dialogRef.close(true);
    }
};
AttributeValueListEditDialogComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attribute-value-list-edit-dialog',
        templateUrl: './attribute-value-list-edit-dialog.component.html',
        styleUrls: ['./attribute-value-list-edit-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object])
], AttributeValueListEditDialogComponent);
export { AttributeValueListEditDialogComponent };
//# sourceMappingURL=attribute-value-list-edit-dialog.component.js.map