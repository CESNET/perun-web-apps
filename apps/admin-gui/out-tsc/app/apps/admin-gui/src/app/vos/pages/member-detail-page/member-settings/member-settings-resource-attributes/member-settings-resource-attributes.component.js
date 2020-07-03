import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
let MemberSettingsResourceAttributesComponent = class MemberSettingsResourceAttributesComponent {
    constructor(route, resourcesManagerService) {
        this.route = route;
        this.resourcesManagerService = resourcesManagerService;
        this.resources = [];
    }
    ngOnInit() {
        this.loading = true;
        this.route.parent.parent.params.subscribe(parent => {
            this.memberId = parent['memberId'];
            this.resourcesManagerService.getAllowedResources(this.memberId).subscribe(resources => {
                this.resources = resources;
                this.loading = false;
            });
        });
    }
};
MemberSettingsResourceAttributesComponent = __decorate([
    Component({
        selector: 'app-member-settings-resource-attributes',
        templateUrl: './member-settings-resource-attributes.component.html',
        styleUrls: ['./member-settings-resource-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        ResourcesManagerService])
], MemberSettingsResourceAttributesComponent);
export { MemberSettingsResourceAttributesComponent };
//# sourceMappingURL=member-settings-resource-attributes.component.js.map