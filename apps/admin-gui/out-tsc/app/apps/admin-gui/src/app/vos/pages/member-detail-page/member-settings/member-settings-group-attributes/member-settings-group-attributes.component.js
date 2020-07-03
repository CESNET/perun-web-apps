import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
let MemberSettingsGroupAttributesComponent = class MemberSettingsGroupAttributesComponent {
    constructor(route, groupsManagerService) {
        this.route = route;
        this.groupsManagerService = groupsManagerService;
        this.groups = [];
    }
    ngOnInit() {
        this.loading = true;
        this.route.parent.parent.params.subscribe(parent => {
            this.memberId = parent['memberId'];
            this.groupsManagerService.getMemberGroups(this.memberId).subscribe(groups => {
                this.groups = groups;
                this.loading = false;
            });
        });
    }
};
MemberSettingsGroupAttributesComponent = __decorate([
    Component({
        selector: 'app-member-settings-group-attributes',
        templateUrl: './member-settings-group-attributes.component.html',
        styleUrls: ['./member-settings-group-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        GroupsManagerService])
], MemberSettingsGroupAttributesComponent);
export { MemberSettingsGroupAttributesComponent };
//# sourceMappingURL=member-settings-group-attributes.component.js.map