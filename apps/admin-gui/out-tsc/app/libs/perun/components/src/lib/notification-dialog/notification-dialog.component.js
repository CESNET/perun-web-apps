import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BugReportDialogComponent } from '../bug-report-dialog/bug-report-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let NotificationDialogComponent = class NotificationDialogComponent {
    constructor(dialogRef, dialog, data) {
        this.dialogRef = dialogRef;
        this.dialog = dialog;
        this.data = data;
    }
    onCloseClick() {
        this.dialogRef.close();
    }
    onBugReportClick() {
        this.dialogRef.afterClosed().subscribe(() => {
            const config = getDefaultDialogConfig();
            config.width = '550px';
            config.data = { error: this.data.error, };
            config.autoFocus = false;
            this.dialog.open(BugReportDialogComponent, config);
        });
        this.dialogRef.close();
    }
};
NotificationDialogComponent = __decorate([
    Component({
        selector: 'perun-web-apps-notification-dialog',
        templateUrl: './notification-dialog.component.html',
        styleUrls: ['./notification-dialog.component.scss']
    }),
    __param(2, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef,
        MatDialog, Object])
], NotificationDialogComponent);
export { NotificationDialogComponent };
//# sourceMappingURL=notification-dialog.component.js.map