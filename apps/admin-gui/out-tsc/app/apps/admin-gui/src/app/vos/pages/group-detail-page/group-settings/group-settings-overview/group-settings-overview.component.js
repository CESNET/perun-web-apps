import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { SideMenuService } from '../../../../../core/services/common/side-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
let GroupSettingsOverviewComponent = class GroupSettingsOverviewComponent {
    constructor(sideMenuService, voService, groupService, route, router) {
        this.sideMenuService = sideMenuService;
        this.voService = voService;
        this.groupService = groupService;
        this.route = route;
        this.router = router;
        this.items = [];
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(grandParentParams => {
            const voId = grandParentParams['voId'];
            const groupId = grandParentParams['groupId'];
            this.groupService.getGroupById(groupId).subscribe(group => {
                this.group = group;
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
                url: `/organizations/${this.vo.id}/groups/${this.group.id}/settings/attributes`,
                label: 'MENU_ITEMS.GROUP.ATTRIBUTES',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-attributes',
                url: `/organizations/${this.vo.id}/groups/${this.group.id}/settings/resourceAttributes`,
                label: 'MENU_ITEMS.GROUP.RESOURCE_ATTRIBUTES',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-group',
                url: `/organizations/${this.vo.id}/groups/${this.group.id}/settings/expiration`,
                label: 'MENU_ITEMS.GROUP.EXPIRATION',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-manager',
                url: `/organizations/${this.vo.id}/groups/${this.group.id}/settings/managers`,
                label: 'MENU_ITEMS.GROUP.MANAGERS',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-application-form',
                url: `/organizations/${this.vo.id}/groups/${this.group.id}/settings/applicationForm`,
                label: 'MENU_ITEMS.GROUP.APPLICATION_FORM',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-notification',
                url: `/organizations/${this.vo.id}/groups/${this.group.id}/settings/notifications`,
                label: 'MENU_ITEMS.GROUP.NOTIFICATIONS',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-group',
                url: `/organizations/${this.vo.id}/groups/${this.group.id}/settings/relations`,
                label: 'MENU_ITEMS.GROUP.RELATIONS',
                style: 'group-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupSettingsOverviewComponent.prototype, "true", void 0);
GroupSettingsOverviewComponent = __decorate([
    Component({
        selector: 'app-group-settings-overview',
        templateUrl: './group-settings-overview.component.html',
        styleUrls: ['./group-settings-overview.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        VosManagerService,
        GroupsManagerService,
        ActivatedRoute,
        Router])
], GroupSettingsOverviewComponent);
export { GroupSettingsOverviewComponent };
//# sourceMappingURL=group-settings-overview.component.js.map