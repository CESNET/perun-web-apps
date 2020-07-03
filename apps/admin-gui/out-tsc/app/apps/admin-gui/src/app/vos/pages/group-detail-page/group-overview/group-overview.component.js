import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
let GroupOverviewComponent = class GroupOverviewComponent {
    constructor(route, groupService) {
        this.route = route;
        this.groupService = groupService;
        this.navItems = [];
        this.parentGroup = null;
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.groupId = params['groupId'];
            this.groupService.getGroupById(this.groupId).subscribe(group => {
                this.group = group;
                if (this.group.parentGroupId !== null) {
                    this.loadParentGroupData();
                }
                else {
                    this.parentGroup = null;
                    this.initNavItems();
                }
            });
        });
    }
    loadParentGroupData() {
        this.groupService.getGroupById(this.group.parentGroupId).subscribe(parentGroup => {
            this.parentGroup = parentGroup;
            this.initNavItems();
        });
    }
    initNavItems() {
        this.navItems = [
            {
                cssIcon: 'perun-user',
                url: `/organizations/${this.group.voId}/groups/${this.groupId}/members`,
                label: 'MENU_ITEMS.GROUP.MEMBERS',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-group',
                url: `/organizations/${this.group.voId}/groups/${this.groupId}/subgroups`,
                label: 'MENU_ITEMS.GROUP.SUBGROUPS',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-manage-facility',
                url: `/organizations/${this.group.voId}/groups/${this.groupId}/resources`,
                label: 'MENU_ITEMS.GROUP.RESOURCES',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-applications',
                url: `/organizations/${this.group.voId}/groups/${this.groupId}/applications`,
                label: 'MENU_ITEMS.GROUP.APPLICATIONS',
                style: 'group-btn'
            },
            {
                cssIcon: 'perun-settings2',
                url: `/organizations/${this.group.voId}/groups/${this.groupId}/settings`,
                label: 'MENU_ITEMS.GROUP.SETTINGS',
                style: 'group-btn'
            },
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupOverviewComponent.prototype, "true", void 0);
GroupOverviewComponent = __decorate([
    Component({
        selector: 'app-group-overview',
        templateUrl: './group-overview.component.html',
        styleUrls: ['./group-overview.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        GroupsManagerService])
], GroupOverviewComponent);
export { GroupOverviewComponent };
//# sourceMappingURL=group-overview.component.js.map