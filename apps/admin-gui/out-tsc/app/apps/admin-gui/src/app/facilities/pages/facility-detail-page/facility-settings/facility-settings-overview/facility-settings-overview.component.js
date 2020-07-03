import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
let FacilitySettingsOverviewComponent = class FacilitySettingsOverviewComponent {
    constructor(route, facilityManager) {
        this.route = route;
        this.facilityManager = facilityManager;
        this.items = [];
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(parentParams => {
            const facilityId = parentParams['facilityId'];
            this.facilityManager.getFacilityById(facilityId).subscribe(facility => {
                this.facility = facility;
                this.initItems();
            });
        });
    }
    initItems() {
        this.items = [
            {
                cssIcon: 'perun-attributes',
                url: `/facilities/${this.facility.id}/settings/attributes`,
                label: 'MENU_ITEMS.FACILITY.ATTRIBUTES',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-user',
                url: `/facilities/${this.facility.id}/settings/owners`,
                label: 'MENU_ITEMS.FACILITY.OWNERS',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-manager',
                url: `/facilities/${this.facility.id}/settings/managers`,
                label: 'MENU_ITEMS.FACILITY.MANAGERS',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-black-list',
                url: `/facilities/${this.facility.id}/settings/blacklist`,
                label: 'MENU_ITEMS.FACILITY.BLACKLIST',
                style: 'facility-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], FacilitySettingsOverviewComponent.prototype, "true", void 0);
FacilitySettingsOverviewComponent = __decorate([
    Component({
        selector: 'app-facility-settings-overview',
        templateUrl: './facility-settings-overview.component.html',
        styleUrls: ['./facility-settings-overview.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        FacilitiesManagerService])
], FacilitySettingsOverviewComponent);
export { FacilitySettingsOverviewComponent };
//# sourceMappingURL=facility-settings-overview.component.js.map