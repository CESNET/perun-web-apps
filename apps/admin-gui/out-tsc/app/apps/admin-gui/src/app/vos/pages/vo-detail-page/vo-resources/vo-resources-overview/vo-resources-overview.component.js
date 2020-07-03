import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { SideMenuService } from '../../../../../core/services/common/side-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
let VoResourcesOverviewComponent = class VoResourcesOverviewComponent {
    constructor(sideMenuService, voService, route, router) {
        this.sideMenuService = sideMenuService;
        this.voService = voService;
        this.route = route;
        this.router = router;
        this.items = [];
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(parentParams => {
            const voId = parentParams['voId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
                this.initItems();
            });
        });
    }
    initItems() {
        this.items = [
            {
                cssIcon: 'perun-resource',
                url: `/organizations/${this.vo.id}/resources/preview`,
                label: 'MENU_ITEMS.VO.RESOURCE_PREVIEW',
                style: 'vo-btn'
            },
            {
                cssIcon: 'perun-resource-tags',
                url: `/organizations/${this.vo.id}/resources/tags`,
                label: 'MENU_ITEMS.VO.RESOURCE_TAGS',
                style: 'vo-btn'
            },
            {
                cssIcon: 'perun-resources-state',
                url: `/organizations/${this.vo.id}/resources/states`,
                label: 'MENU_ITEMS.VO.RESOURCE_STATES',
                style: 'vo-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoResourcesOverviewComponent.prototype, "true", void 0);
VoResourcesOverviewComponent = __decorate([
    Component({
        selector: 'app-vo-resources-overview',
        templateUrl: './vo-resources-overview.component.html',
        styleUrls: ['./vo-resources-overview.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        VosManagerService,
        ActivatedRoute,
        Router])
], VoResourcesOverviewComponent);
export { VoResourcesOverviewComponent };
//# sourceMappingURL=vo-resources-overview.component.js.map