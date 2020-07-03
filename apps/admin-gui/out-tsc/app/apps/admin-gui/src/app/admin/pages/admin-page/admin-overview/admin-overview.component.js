import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
let AdminOverviewComponent = class AdminOverviewComponent {
    constructor() {
        this.navItems = [
            {
                cssIcon: 'perun-attributes',
                url: '/admin/attributes',
                label: 'MENU_ITEMS.ADMIN.ATTRIBUTES',
                style: 'admin-btn',
            },
            {
                cssIcon: 'perun-user',
                url: '/admin/users',
                label: 'MENU_ITEMS.ADMIN.USERS',
                style: 'admin-btn'
            },
            {
                cssIcon: 'perun-preview',
                url: '/admin/visualizer',
                label: 'MENU_ITEMS.ADMIN.VISUALIZER',
                style: 'admin-btn'
            },
            {
                cssIcon: 'perun-external-sources',
                url: '/admin/ext_sources',
                label: 'MENU_ITEMS.ADMIN.EXT_SOURCES',
                style: 'admin-btn'
            }
        ];
    }
    ngOnInit() {
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], AdminOverviewComponent.prototype, "true", void 0);
AdminOverviewComponent = __decorate([
    Component({
        selector: 'app-admin-overview',
        templateUrl: './admin-overview.component.html',
        styleUrls: ['./admin-overview.component.scss']
    }),
    __metadata("design:paramtypes", [])
], AdminOverviewComponent);
export { AdminOverviewComponent };
//# sourceMappingURL=admin-overview.component.js.map