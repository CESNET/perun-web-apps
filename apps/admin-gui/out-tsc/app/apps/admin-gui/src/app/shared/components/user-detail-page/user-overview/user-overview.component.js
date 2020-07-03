import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
let UserOverviewComponent = class UserOverviewComponent {
    constructor() {
        this.navItems = [];
    }
    ngOnInit() {
        this.initNavItems();
    }
    initNavItems() {
        this.navItems = [
            {
                cssIcon: 'perun-vo',
                url: `organizations`,
                label: 'MENU_ITEMS.ADMIN.ORGANIZATIONS',
                style: 'user-btn'
            },
            {
                cssIcon: 'perun-group',
                url: `groups`,
                label: 'MENU_ITEMS.ADMIN.GROUPS',
                style: 'user-btn'
            },
            {
                cssIcon: 'perun-group',
                url: `identities`,
                label: 'MENU_ITEMS.USER.IDENTITIES',
                style: 'user-btn'
            },
            {
                cssIcon: 'perun-settings2',
                url: `settings`,
                label: 'MENU_ITEMS.ADMIN.SETTINGS',
                style: 'user-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], UserOverviewComponent.prototype, "true", void 0);
UserOverviewComponent = __decorate([
    Component({
        selector: 'app-user-overview',
        templateUrl: './user-overview.component.html',
        styleUrls: ['./user-overview.component.scss']
    }),
    __metadata("design:paramtypes", [])
], UserOverviewComponent);
export { UserOverviewComponent };
//# sourceMappingURL=user-overview.component.js.map