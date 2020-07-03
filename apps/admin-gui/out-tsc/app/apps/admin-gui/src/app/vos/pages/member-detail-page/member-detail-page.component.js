import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeIn } from '@perun-web-apps/perun/animations';
import { MembersService } from '@perun-web-apps/perun/services';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
let MemberDetailPageComponent = class MemberDetailPageComponent {
    constructor(sideMenuItemService, translate, sideMenuService, membersService, voService, route) {
        this.sideMenuItemService = sideMenuItemService;
        this.translate = translate;
        this.sideMenuService = sideMenuService;
        this.membersService = membersService;
        this.voService = voService;
        this.route = route;
        this.fullName = '';
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            const voId = params['voId'];
            const memberId = params['memberId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
                this.membersService.getRichMemberWithAttributes(memberId).subscribe(member => {
                    this.member = member;
                    const voSideMenuItem = this.sideMenuItemService.parseVo(this.vo);
                    const memberSideMenuItem = this.sideMenuItemService.parseMember(this.member);
                    this.fullName = memberSideMenuItem.label;
                    this.sideMenuService.setAccessMenuItems([voSideMenuItem, memberSideMenuItem]);
                });
            });
        });
    }
};
MemberDetailPageComponent = __decorate([
    Component({
        selector: 'app-member-detail-page',
        templateUrl: './member-detail-page.component.html',
        styleUrls: ['./member-detail-page.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [SideMenuItemService,
        TranslateService,
        SideMenuService,
        MembersService,
        VosManagerService,
        ActivatedRoute])
], MemberDetailPageComponent);
export { MemberDetailPageComponent };
//# sourceMappingURL=member-detail-page.component.js.map