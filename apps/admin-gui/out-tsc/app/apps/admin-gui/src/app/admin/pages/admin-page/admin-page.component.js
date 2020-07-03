import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
let AdminPageComponent = class AdminPageComponent {
    constructor(sideMenuService, sideMenuItemService) {
        this.sideMenuService = sideMenuService;
        this.sideMenuItemService = sideMenuItemService;
    }
    ngOnInit() {
        this.sideMenuService.setAdminItems([]);
    }
};
AdminPageComponent = __decorate([
    Component({
        selector: 'app-admin-page',
        templateUrl: './admin-page.component.html',
        styleUrls: ['./admin-page.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        SideMenuItemService])
], AdminPageComponent);
export { AdminPageComponent };
//# sourceMappingURL=admin-page.component.js.map