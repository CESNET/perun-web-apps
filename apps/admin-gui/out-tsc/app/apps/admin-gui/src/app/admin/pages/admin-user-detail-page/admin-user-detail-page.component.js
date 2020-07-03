import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
let AdminUserDetailPageComponent = class AdminUserDetailPageComponent {
    constructor(route, usersService, sideMenuService, sideMenuItemService) {
        this.route = route;
        this.usersService = usersService;
        this.sideMenuService = sideMenuService;
        this.sideMenuItemService = sideMenuItemService;
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            const userId = params['userId'];
            this.path = `/admin/users/${userId}`;
            this.regex = `/admin/users/\\d+`;
            this.usersService.getUserById(userId).subscribe(user => {
                this.user = user;
                const userItem = this.sideMenuItemService.parseUser(user, this.path, this.regex);
                this.sideMenuService.setAdminItems([userItem]);
            });
        });
    }
};
AdminUserDetailPageComponent = __decorate([
    Component({
        selector: 'app-admin-user-detail-page',
        templateUrl: './admin-user-detail-page.component.html',
        styleUrls: ['./admin-user-detail-page.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        UsersManagerService,
        SideMenuService,
        SideMenuItemService])
], AdminUserDetailPageComponent);
export { AdminUserDetailPageComponent };
//# sourceMappingURL=admin-user-detail-page.component.js.map