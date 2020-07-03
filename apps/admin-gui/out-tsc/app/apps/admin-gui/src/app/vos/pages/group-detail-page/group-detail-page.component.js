import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { ActivatedRoute } from '@angular/router';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import { fadeIn } from '@perun-web-apps/perun/animations';
import { GroupsManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
let GroupDetailPageComponent = class GroupDetailPageComponent {
    constructor(sideMenuService, voService, route, sideMenuItemService, groupService) {
        this.sideMenuService = sideMenuService;
        this.voService = voService;
        this.route = route;
        this.sideMenuItemService = sideMenuItemService;
        this.groupService = groupService;
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            const voId = params['voId'];
            const groupId = params['groupId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
                this.groupService.getGroupById(groupId).subscribe(group => {
                    this.group = group;
                    const voSideMenuItem = this.sideMenuItemService.parseVo(vo);
                    const groupSideMenuItem = this.sideMenuItemService.parseGroup(group);
                    this.sideMenuService.setAccessMenuItems([voSideMenuItem, groupSideMenuItem]);
                });
            });
        });
    }
};
GroupDetailPageComponent = __decorate([
    Component({
        selector: 'app-group-detail-page',
        templateUrl: './group-detail-page.component.html',
        styleUrls: ['./group-detail-page.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [SideMenuService,
        VosManagerService,
        ActivatedRoute,
        SideMenuItemService,
        GroupsManagerService])
], GroupDetailPageComponent);
export { GroupDetailPageComponent };
//# sourceMappingURL=group-detail-page.component.js.map