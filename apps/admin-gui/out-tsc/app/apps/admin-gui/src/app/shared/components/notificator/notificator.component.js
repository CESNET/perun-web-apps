import { __decorate, __metadata } from "tslib";
import { Component, HostListener } from '@angular/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { flyInOut } from '@perun-web-apps/perun/animations';
import { environment } from '../../../../environments/environment';
import { AppComponent } from '../../../app.component';
import { NotificationStorageService } from '@perun-web-apps/perun/services';
let NotificatorComponent = class NotificatorComponent {
    constructor(notificator, notificationStorageService) {
        this.notificator = notificator;
        this.notificationStorageService = notificationStorageService;
        this.mobileView = false;
        this.notifications = [];
        this.notificator.addNotification.subscribe(notificationData => {
            this.processNotification(notificationData);
        });
        this.getScreenSize();
    }
    getScreenSize() {
        this.mobileView = window.innerWidth <= AppComponent.minWidth;
    }
    processNotification(data) {
        this.notifications.push(data);
        this.notificationStorageService.storeNotification(data);
    }
    getNotificatorTop() {
        if (this.mobileView) {
            return 'initial';
        }
        return environment.production ? '112px' : '64px';
    }
    removeNotification(index) {
        this.notifications.splice(index, 1);
    }
};
__decorate([
    HostListener('window:resize', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificatorComponent.prototype, "getScreenSize", null);
NotificatorComponent = __decorate([
    Component({
        selector: 'app-notificator',
        templateUrl: './notificator.component.html',
        styleUrls: ['./notificator.component.scss'],
        animations: [
            flyInOut
        ]
    }),
    __metadata("design:paramtypes", [NotificatorService,
        NotificationStorageService])
], NotificatorComponent);
export { NotificatorComponent };
//# sourceMappingURL=notificator.component.js.map