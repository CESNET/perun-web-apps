import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import { fadeIn } from '@perun-web-apps/perun/animations';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
import { addRecentlyVisited } from '@perun-web-apps/perun/utils';
let VoDetailPageComponent = class VoDetailPageComponent {
    constructor(sideMenuService, voService, route, router, sideMenuItemService) {
        this.sideMenuService = sideMenuService;
        this.voService = voService;
        this.route = route;
        this.router = router;
        this.sideMenuItemService = sideMenuItemService;
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            const voId = params['voId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
                const sideMenuItem = this.sideMenuItemService.parseVo(vo);
                this.sideMenuService.setAccessMenuItems([sideMenuItem]);
                addRecentlyVisited('vos', this.vo);
            });
        });
    }
};
VoDetailPageComponent = __decorate([
    Component({
        selector: 'app-vo-detail-page',
        templateUrl: './vo-detail-page.component.html',
        styleUrls: ['./vo-detail-page.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [SideMenuService,
        VosManagerService,
        ActivatedRoute,
        Router,
        SideMenuItemService])
], VoDetailPageComponent);
export { VoDetailPageComponent };
//# sourceMappingURL=vo-detail-page.component.js.map