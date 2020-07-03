import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { NotificationStorageService } from '@perun-web-apps/perun/services';
import { MatDialogRef } from '@angular/material/dialog';
let ShowNotificationHistoryDialogComponent = class ShowNotificationHistoryDialogComponent {
    constructor(dialogRef, notificationStorageService) {
        this.dialogRef = dialogRef;
        this.notificationStorageService = notificationStorageService;
    }
    ngOnInit() {
        this.notifications = this.notificationStorageService.getNotifications();
    }
    onCancel() {
        this.dialogRef.close();
    }
    onClear() {
        this.notificationStorageService.clearNotifications();
        this.notifications = [];
    }
};
ShowNotificationHistoryDialogComponent = __decorate([
    Component({
        selector: 'app-show-notification-history-dialog',
        templateUrl: './show-notification-history-dialog.component.html',
        styleUrls: ['./show-notification-history-dialog.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialogRef,
        NotificationStorageService])
], ShowNotificationHistoryDialogComponent);
export { ShowNotificationHistoryDialogComponent };
//# sourceMappingURL=show-notification-history-dialog.component.js.map