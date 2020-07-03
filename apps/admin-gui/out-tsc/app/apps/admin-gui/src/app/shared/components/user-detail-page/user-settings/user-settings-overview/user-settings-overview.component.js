import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
let UserSettingsOverviewComponent = class UserSettingsOverviewComponent {
    constructor() {
        this.navItems = [];
    }
    ngOnInit() {
        this.initNavItems();
    }
    initNavItems() {
        this.navItems = [
            {
                cssIcon: 'perun-attributes',
                url: `attributes`,
                label: 'MENU_ITEMS.USER.ATTRIBUTES',
                style: 'user-btn'
            },
            {
                cssIcon: 'perun-attributes',
                url: `facilityAttributes`,
                label: 'MENU_ITEMS.USER.FACILITY_ATTRIBUTES',
                style: 'user-btn'
            },
            {
                cssIcon: 'perun-group',
                url: `roles`,
                label: 'MENU_ITEMS.USER.ROLES',
                style: 'user-btn'
            }
        ];
        // if at user profile, add user gui config item
        // if at admin profile, add service identities
        if (!window.location.pathname.startsWith('/admin')) {
            this.navItems.push({
                cssIcon: 'perun-settings2',
                url: 'gui-config',
                label: 'MENU_ITEMS.USER.GUI_CONFIG',
                style: 'user-btn'
            });
        }
        else {
            this.navItems.push({
                cssIcon: 'perun-attributes',
                url: `service-identities`,
                label: 'MENU_ITEMS.USER.SERVICE_IDENTITIES',
                style: 'user-btn'
            });
        }
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], UserSettingsOverviewComponent.prototype, "true", void 0);
UserSettingsOverviewComponent = __decorate([
    Component({
        selector: 'app-user-settings-overview',
        templateUrl: './user-settings-overview.component.html',
        styleUrls: ['./user-settings-overview.component.scss']
    }),
    __metadata("design:paramtypes", [])
], UserSettingsOverviewComponent);
export { UserSettingsOverviewComponent };
//# sourceMappingURL=user-settings-overview.component.js.map