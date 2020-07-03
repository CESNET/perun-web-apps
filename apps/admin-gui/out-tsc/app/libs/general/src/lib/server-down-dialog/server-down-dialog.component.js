import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
let ServerDownDialogComponent = class ServerDownDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    refresh() {
        location.reload();
    }
};
ServerDownDialogComponent = __decorate([
    Component({
        selector: 'perun-web-apps-server-down-dialog',
        templateUrl: './server-down-dialog.component.html',
        styleUrls: ['./server-down-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object])
], ServerDownDialogComponent);
export { ServerDownDialogComponent };
//# sourceMappingURL=server-down-dialog.component.js.map