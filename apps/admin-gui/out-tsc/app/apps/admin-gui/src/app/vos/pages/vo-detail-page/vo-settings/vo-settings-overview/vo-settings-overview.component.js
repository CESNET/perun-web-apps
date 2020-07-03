import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { SideMenuService } from '../../../../../core/services/common/side-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
let VoSettingsOverviewComponent = class VoSettingsOverviewComponent {
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
                cssIcon: 'perun-attributes',
                url: `/organizations/${this.vo.id}/settings/attributes`,
                label: 'MENU_ITEMS.VO.ATTRIBUTES',
                style: 'vo-btn'
            },
            {
                cssIcon: 'perun-group',
                url: `/organizations/${this.vo.id}/settings/expiration`,
                label: 'MENU_ITEMS.VO.EXPIRATION',
                style: 'vo-btn'
            },
            {
                cssIcon: 'perun-manager',
                url: `/organizations/${this.vo.id}/settings/managers`,
                label: 'MENU_ITEMS.VO.MANAGERS',
                style: 'vo-btn'
            },
            {
                cssIcon: 'perun-application-form',
                url: `/organizations/${this.vo.id}/settings/applicationForm`,
                label: 'MENU_ITEMS.VO.APPLICATION_FORM',
                style: 'vo-btn'
            },
            {
                cssIcon: 'perun-notification',
                url: `/organizations/${this.vo.id}/settings/notifications`,
                label: 'MENU_ITEMS.VO.NOTIFICATIONS',
                style: 'vo-btn'
            },
            {
                cssIcon: 'perun-external-sources',
                url: `/organizations/${this.vo.id}/settings/extsources`,
                label: 'MENU_ITEMS.VO.EXTSOURCES',
                style: 'vo-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoSettingsOverviewComponent.prototype, "true", void 0);
VoSettingsOverviewComponent = __decorate([
    Component({
        selector: 'app-vo-settings-overview',
        templateUrl: './vo-settings-overview.component.html',
        styleUrls: ['./vo-settings-overview.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        VosManagerService,
        ActivatedRoute,
        Router])
], VoSettingsOverviewComponent);
export { VoSettingsOverviewComponent };
//# sourceMappingURL=vo-settings-overview.component.js.map