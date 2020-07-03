import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { SideMenuService } from '../../../../../core/services/common/side-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '@perun-web-apps/perun/services';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
let MemberSettingsOverviewComponent = class MemberSettingsOverviewComponent {
    constructor(sideMenuService, voService, memberService, route, router) {
        this.sideMenuService = sideMenuService;
        this.voService = voService;
        this.memberService = memberService;
        this.route = route;
        this.router = router;
        this.items = [];
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(grandParentParams => {
            const voId = grandParentParams['voId'];
            const memberId = grandParentParams['memberId'];
            this.memberService.getMemberById(memberId).subscribe(member => {
                this.member = member;
                this.voService.getVoById(voId).subscribe(vo => {
                    this.vo = vo;
                    this.initItems();
                });
            });
        });
    }
    initItems() {
        this.items = [
            {
                cssIcon: 'perun-attributes',
                url: `/organizations/${this.vo.id}/members/${this.member.id}/settings/attributes`,
                label: 'MENU_ITEMS.MEMBER.ATTRIBUTES',
                style: 'member-btn'
            },
            {
                cssIcon: 'perun-attributes',
                url: `/organizations/${this.vo.id}/members/${this.member.id}/settings/resourceAttributes`,
                label: 'MENU_ITEMS.MEMBER.RESOURCE_ATTRIBUTES',
                style: 'member-btn'
            },
            {
                cssIcon: 'perun-attributes',
                url: `/organizations/${this.vo.id}/members/${this.member.id}/settings/groupAttributes`,
                label: 'MENU_ITEMS.MEMBER.GROUP_ATTRIBUTES',
                style: 'member-btn'
            },
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], MemberSettingsOverviewComponent.prototype, "true", void 0);
MemberSettingsOverviewComponent = __decorate([
    Component({
        selector: 'app-member-settings-overview',
        templateUrl: './member-settings-overview.component.html',
        styleUrls: ['./member-settings-overview.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        VosManagerService,
        MembersService,
        ActivatedRoute,
        Router])
], MemberSettingsOverviewComponent);
export { MemberSettingsOverviewComponent };
//# sourceMappingURL=member-settings-overview.component.js.map