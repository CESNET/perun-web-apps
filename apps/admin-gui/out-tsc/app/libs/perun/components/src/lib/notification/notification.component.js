import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationStorageService } from '@perun-web-apps/perun/services';
import { doAfterDelay, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
let NotificationComponent = class NotificationComponent {
    constructor(dialog, notificationStorageService) {
        this.dialog = dialog;
        this.notificationStorageService = notificationStorageService;
        this.newNotification = false;
        this.closeNotification = new EventEmitter();
        this.alreadyPressed = false;
        this.alreadyClosed = false;
        this.waiting = false;
    }
    doAction() {
        if (this.newNotification) {
            this.alreadyPressed = true;
        }
        if (this.notificationStorageService.newNotificationsCount) {
            this.notificationStorageService.newNotificationsCount--;
        }
        if (this.data.action !== undefined) {
            this.data.action();
        }
        else {
            const config = getDefaultDialogConfig();
            config.width = '550px';
            config.data = this.data;
            config.autoFocus = false;
            const dialogRef = this.dialog.open(NotificationDialogComponent, config);
            dialogRef.afterClosed().subscribe(() => {
                this.closeSelf();
            });
        }
    }
    closeSelf() {
        if (!this.inDialog) {
            if (this.newNotification) {
                this.alreadyClosed = true;
            }
            if (this.notificationStorageService.newNotificationsCount) {
                this.notificationStorageService.newNotificationsCount--;
            }
            this.closeNotification.emit();
        }
    }
    ngOnInit() {
        doAfterDelay(this.data.delay, () => {
            if (!this.alreadyClosed && !this.waiting) {
                this.closeSelf();
            }
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], NotificationComponent.prototype, "data", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], NotificationComponent.prototype, "inDialog", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NotificationComponent.prototype, "newNotification", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], NotificationComponent.prototype, "closeNotification", void 0);
NotificationComponent = __decorate([
    Component({
        selector: 'perun-web-apps-notification',
        templateUrl: './notification.component.html',
        styleUrls: ['./notification.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        NotificationStorageService])
], NotificationComponent);
export { NotificationComponent };
//# sourceMappingURL=notification.component.js.map