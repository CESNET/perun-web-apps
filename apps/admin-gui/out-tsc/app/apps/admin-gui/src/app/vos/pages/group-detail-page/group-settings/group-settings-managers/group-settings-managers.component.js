import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { Role } from '@perun-web-apps/perun/models';
let GroupSettingsManagersComponent = class GroupSettingsManagersComponent {
    constructor(groupService, route) {
        this.groupService = groupService;
        this.route = route;
        this.availableRoles = [Role.GROUPADMIN];
        this.selected = 'user';
        this.type = 'Group';
        this.theme = 'group-theme';
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(parentParentParams => {
            const groupId = parentParentParams['groupId'];
            this.groupService.getGroupById(groupId).subscribe(group => {
                this.group = group;
            });
        });
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupSettingsManagersComponent.prototype, "true", void 0);
GroupSettingsManagersComponent = __decorate([
    Component({
        selector: 'app-group-settings-managers',
        templateUrl: './group-settings-managers.component.html',
        styleUrls: ['./group-settings-managers.component.scss']
    }),
    __metadata("design:paramtypes", [GroupsManagerService,
        ActivatedRoute])
], GroupSettingsManagersComponent);
export { GroupSettingsManagersComponent };
//# sourceMappingURL=group-settings-managers.component.js.map