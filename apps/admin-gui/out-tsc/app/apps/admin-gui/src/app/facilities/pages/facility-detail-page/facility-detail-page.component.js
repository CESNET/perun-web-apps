import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeIn } from '@perun-web-apps/perun/animations';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { addRecentlyVisited } from '@perun-web-apps/perun/utils';
let FacilityDetailPageComponent = class FacilityDetailPageComponent {
    constructor(facilityManager, route, sideMenuService, sideMenuItemService) {
        this.facilityManager = facilityManager;
        this.route = route;
        this.sideMenuService = sideMenuService;
        this.sideMenuItemService = sideMenuItemService;
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            const facilityId = params['facilityId'];
            this.facilityManager.getFacilityById(facilityId).subscribe(facility => {
                this.facility = facility;
                const facilityItem = this.sideMenuItemService.parseFacility(facility);
                this.sideMenuService.setFacilityMenuItems([facilityItem]);
                addRecentlyVisited('facilities', this.facility);
            });
        });
    }
};
FacilityDetailPageComponent = __decorate([
    Component({
        selector: 'app-facility-detail-page',
        templateUrl: './facility-detail-page.component.html',
        styleUrls: ['./facility-detail-page.component.scss'],
        animations: [
            fadeIn
        ]
    }),
    __metadata("design:paramtypes", [FacilitiesManagerService,
        ActivatedRoute,
        SideMenuService,
        SideMenuItemService])
], FacilityDetailPageComponent);
export { FacilityDetailPageComponent };
//# sourceMappingURL=facility-detail-page.component.js.map