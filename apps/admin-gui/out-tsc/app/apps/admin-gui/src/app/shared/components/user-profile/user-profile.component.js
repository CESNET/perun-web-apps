import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { StoreService } from '@perun-web-apps/perun/services';
import { Router } from '@angular/router';
let UserProfileComponent = class UserProfileComponent {
    constructor(sideMenuService, store, router) {
        this.sideMenuService = sideMenuService;
        this.store = store;
        this.router = router;
    }
    ngOnInit() {
        this.path = this.router.url;
        this.router.events.subscribe(path => {
            this.path = this.router.url;
        });
        this.principal = this.store.getPerunPrincipal();
        this.user = this.principal.user;
        this.sideMenuService.setUserItems([]);
    }
};
UserProfileComponent = __decorate([
    Component({
        selector: 'app-user-profile',
        templateUrl: './user-profile.component.html',
        styleUrls: ['./user-profile.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        StoreService,
        Router])
], UserProfileComponent);
export { UserProfileComponent };
//# sourceMappingURL=user-profile.component.js.map