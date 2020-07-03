import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
import { GuiAuthResolver, StoreService } from '@perun-web-apps/perun/services';
import { AuthService } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { ShowNotificationHistoryDialogComponent } from '../components/dialogs/show-notification-history-dialog/show-notification-history-dialog.component';
import { NotificationStorageService } from '@perun-web-apps/perun/services';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let PerunNavComponent = class PerunNavComponent {
    constructor(storeService, authService, authResolver, authzResolverService, dialog, notificator, translateService, store, sanitizer, notificationStorageService) {
        this.storeService = storeService;
        this.authService = authService;
        this.authResolver = authResolver;
        this.authzResolverService = authzResolverService;
        this.dialog = dialog;
        this.notificator = notificator;
        this.translateService = translateService;
        this.store = store;
        this.sanitizer = sanitizer;
        this.notificationStorageService = notificationStorageService;
        this.logoutEnabled = true;
        this.navTextColor = this.store.get('theme', 'nav_text_color');
        this.iconColor = this.store.get('theme', 'nav_icon_color');
        this.logoPadding = this.storeService.get('logo_padding');
    }
    ngAfterViewInit() {
    }
    ngOnInit() {
        this.logo = this.sanitizer.bypassSecurityTrustHtml(this.store.get('logo'));
        this.logoutEnabled = this.storeService.get('log_out_enabled');
    }
    onLogOut() {
        this.authService.logout();
    }
    showNotificationHistory() {
        this.notificationStorageService.newNotificationsCount = 0;
        const config = getDefaultDialogConfig();
        config.width = '520px';
        this.dialog.open(ShowNotificationHistoryDialogComponent, config);
    }
    getNewNotificationsCount() {
        return this.notificationStorageService.newNotificationsCount;
    }
    reloadRoles() {
        this.authzResolverService.loadAuthorizationComponents().subscribe(() => this.notificator.showSuccess(this.translateService.instant('NAV.RELOAD_ROLES_SUCCESS')));
    }
};
__decorate([
    Input(),
    __metadata("design:type", MatSidenav)
], PerunNavComponent.prototype, "sideNav", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PerunNavComponent.prototype, "principal", void 0);
PerunNavComponent = __decorate([
    Component({
        selector: 'app-perun-nav-menu',
        templateUrl: './perun-nav.component.html',
        styleUrls: ['./perun-nav.component.scss']
    }),
    __metadata("design:paramtypes", [StoreService,
        AuthService,
        GuiAuthResolver,
        AuthzResolverService,
        MatDialog,
        NotificatorService,
        TranslateService,
        StoreService,
        DomSanitizer,
        NotificationStorageService])
], PerunNavComponent);
export { PerunNavComponent };
//# sourceMappingURL=perun-nav.component.js.map