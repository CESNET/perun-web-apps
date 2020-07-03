import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
let ResourceOverviewComponent = class ResourceOverviewComponent {
    constructor(resourcesManager, route) {
        this.resourcesManager = resourcesManager;
        this.route = route;
        this.navItems = [];
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            const resourceId = params['resourceId'];
            this.resourcesManager.getResourceById(resourceId).subscribe(resource => {
                this.resource = resource;
                this.initItems();
            });
        });
    }
    initItems() {
        this.navItems = [
            {
                cssIcon: 'perun-group',
                url: `/facilities/${this.resource.facilityId}/resources/${this.resource.id}/groups`,
                label: 'MENU_ITEMS.RESOURCE.ASSIGNED_GROUPS',
                style: 'resource-btn'
            },
            {
                cssIcon: 'perun-settings2',
                url: `/facilities/${this.resource.facilityId}/resources/${this.resource.id}/settings`,
                label: 'MENU_ITEMS.RESOURCE.SETTINGS',
                style: 'resource-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], ResourceOverviewComponent.prototype, "true", void 0);
ResourceOverviewComponent = __decorate([
    Component({
        selector: 'app-resource-overview',
        templateUrl: './resource-overview.component.html',
        styleUrls: ['./resource-overview.component.scss']
    }),
    __metadata("design:paramtypes", [ResourcesManagerService,
        ActivatedRoute])
], ResourceOverviewComponent);
export { ResourceOverviewComponent };
//# sourceMappingURL=resource-overview.component.js.map