import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
let NotificationStorageService = class NotificationStorageService {
    constructor() {
        this.notificationData = [];
        this.newNotificationsCount = 0;
    }
    storeNotification(notification) {
        this.newNotificationsCount++;
        this.notificationData.push(notification);
    }
    getNotifications() {
        return this.notificationData.reverse();
    }
    clearNotifications() {
        this.notificationData = [];
    }
};
NotificationStorageService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [])
], NotificationStorageService);
export { NotificationStorageService };
//# sourceMappingURL=notification-storage.service.js.map