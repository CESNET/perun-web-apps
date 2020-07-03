import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { Role } from '@perun-web-apps/perun/models';
let FacilitySettingsManagersComponent = class FacilitySettingsManagersComponent {
    constructor(facilityService, route) {
        this.facilityService = facilityService;
        this.route = route;
        this.availableRoles = [Role.FACILITYADMIN];
        this.selected = 'user';
        this.type = 'Facility';
        this.theme = 'facility-theme';
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(parentParentParams => {
            const facilityId = parentParentParams['facilityId'];
            this.facilityService.getFacilityById(facilityId).subscribe(facility => {
                this.facility = facility;
            });
        });
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], FacilitySettingsManagersComponent.prototype, "true", void 0);
FacilitySettingsManagersComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-facility-settings-managers',
        templateUrl: './facility-settings-managers.component.html',
        styleUrls: ['./facility-settings-managers.component.scss']
    }),
    __metadata("design:paramtypes", [FacilitiesManagerService,
        ActivatedRoute])
], FacilitySettingsManagersComponent);
export { FacilitySettingsManagersComponent };
//# sourceMappingURL=facility-settings-managers.component.js.map