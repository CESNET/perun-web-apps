import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { SideMenuService } from '../core/services/common/side-menu.service';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
let MainMenuPageComponent = class MainMenuPageComponent {
    constructor(sideMenuService, authResolver) {
        this.sideMenuService = sideMenuService;
        this.authResolver = authResolver;
    }
    ngOnInit() {
        this.sideMenuService.reset();
    }
};
MainMenuPageComponent = __decorate([
    Component({
        selector: 'app-main-menu-page',
        templateUrl: './main-menu-page.component.html',
        styleUrls: ['./main-menu-page.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        GuiAuthResolver])
], MainMenuPageComponent);
export { MainMenuPageComponent };
//# sourceMappingURL=main-menu-page.component.js.map