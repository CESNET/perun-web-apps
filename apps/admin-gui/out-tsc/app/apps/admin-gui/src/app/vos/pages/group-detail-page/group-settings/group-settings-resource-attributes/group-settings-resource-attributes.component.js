import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
let GroupSettingsResourceAttributesComponent = class GroupSettingsResourceAttributesComponent {
    constructor(route, resourcesManagerService) {
        this.route = route;
        this.resourcesManagerService = resourcesManagerService;
        this.resources = [];
    }
    ngOnInit() {
        this.loading = true;
        this.route.parent.parent.params.subscribe(parent => {
            this.groupId = parent['groupId'];
            this.resourcesManagerService.getAssignedResourcesWithGroup(this.groupId).subscribe(resources => {
                this.resources = resources;
                this.loading = false;
            });
        });
    }
};
GroupSettingsResourceAttributesComponent = __decorate([
    Component({
        selector: 'app-group-settings-resource-attributes',
        templateUrl: './group-settings-resource-attributes.component.html',
        styleUrls: ['./group-settings-resource-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        ResourcesManagerService])
], GroupSettingsResourceAttributesComponent);
export { GroupSettingsResourceAttributesComponent };
//# sourceMappingURL=group-settings-resource-attributes.component.js.map