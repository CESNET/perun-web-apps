import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeIn } from '@perun-web-apps/perun/animations';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import { FacilitiesManagerService, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
let ResourceDetailPageComponent = class ResourceDetailPageComponent {
    constructor(route, facilityManager, resourcesManager, sideMenuService, sideMenuItemService) {
        this.route = route;
        this.facilityManager = facilityManager;
        this.resourcesManager = resourcesManager;
        this.sideMenuService = sideMenuService;
        this.sideMenuItemService = sideMenuItemService;
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            const resourceId = params['resourceId'];
            this.resourcesManager.getResourceById(resourceId).subscribe(resource => {
                this.resource = resource;
                this.facilityManager.getFacilityById(resource.facilityId).subscribe(facility => {
                    const facilityItem = this.sideMenuItemService.parseFacility(facility);
                    const resourceItem = this.sideMenuItemService.parseResource(resource);
                    this.sideMenuService.setFacilityMenuItems([facilityItem, resourceItem]);
                });
            });
        });
    }
};
ResourceDetailPageComponent = __decorate([
    Component({
        selector: 'app-resource-detail-page',
        templateUrl: './resource-detail-page.component.html',
        styleUrls: ['./resource-detail-page.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        FacilitiesManagerService,
        ResourcesManagerService,
        SideMenuService,
        SideMenuItemService])
], ResourceDetailPageComponent);
export { ResourceDetailPageComponent };
//# sourceMappingURL=resource-detail-page.component.js.map