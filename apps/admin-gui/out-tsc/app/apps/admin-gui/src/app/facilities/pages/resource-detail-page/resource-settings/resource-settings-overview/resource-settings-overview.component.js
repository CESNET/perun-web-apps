import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
let ResourceSettingsOverviewComponent = class ResourceSettingsOverviewComponent {
    constructor(route, resourceManager) {
        this.route = route;
        this.resourceManager = resourceManager;
        this.items = [];
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(parentParams => {
            const resourceId = parentParams['resourceId'];
            this.resourceManager.getResourceById(resourceId).subscribe(resource => {
                this.resource = resource;
                this.initItems();
            });
        });
    }
    initItems() {
        this.items = [
            {
                cssIcon: 'perun-attributes',
                url: `/facilities/${this.resource.facilityId}/resources/${this.resource.id}/settings/attributes`,
                label: 'MENU_ITEMS.RESOURCE.ATTRIBUTES',
                style: 'resource-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], ResourceSettingsOverviewComponent.prototype, "true", void 0);
ResourceSettingsOverviewComponent = __decorate([
    Component({
        selector: 'app-resource-settings-overview',
        templateUrl: './resource-settings-overview.component.html',
        styleUrls: ['./resource-settings-overview.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        ResourcesManagerService])
], ResourceSettingsOverviewComponent);
export { ResourceSettingsOverviewComponent };
//# sourceMappingURL=resource-settings-overview.component.js.map