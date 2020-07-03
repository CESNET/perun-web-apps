import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
let FacilityOverviewComponent = class FacilityOverviewComponent {
    constructor(facilityManager, route) {
        this.facilityManager = facilityManager;
        this.route = route;
        this.navItems = [];
    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            const facilityId = params['facilityId'];
            this.facilityManager.getFacilityById(facilityId).subscribe(facility => {
                this.facility = facility;
                this.initItems();
            });
        });
    }
    initItems() {
        this.navItems = [
            {
                cssIcon: 'perun-manage-facility',
                url: `/facilities/${this.facility.id}/resources`,
                label: 'MENU_ITEMS.FACILITY.RESOURCES',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-group',
                url: `/facilities/${this.facility.id}/allowed-groups`,
                label: 'MENU_ITEMS.FACILITY.ALLOWED_GROUPS',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-settings2',
                url: `/facilities/${this.facility.id}/service-config`,
                label: 'MENU_ITEMS.FACILITY.SERVICE_CONFIG',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-service_destination',
                url: `/facilities/${this.facility.id}/services-destinations`,
                label: 'MENU_ITEMS.FACILITY.SERVICES_DESTINATIONS',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-hosts',
                url: `/facilities/${this.facility.id}/hosts`,
                label: 'MENU_ITEMS.FACILITY.HOSTS',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-security-teams',
                url: `/facilities/${this.facility.id}/security-teams`,
                label: 'MENU_ITEMS.FACILITY.SECURITY_TEAMS',
                style: 'facility-btn'
            },
            {
                cssIcon: 'perun-settings2',
                url: `/facilities/${this.facility.id}/settings`,
                label: 'MENU_ITEMS.FACILITY.SETTINGS',
                style: 'facility-btn'
            }
        ];
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], FacilityOverviewComponent.prototype, "true", void 0);
FacilityOverviewComponent = __decorate([
    Component({
        selector: 'app-facility-overview',
        templateUrl: './facility-overview.component.html',
        styleUrls: ['./facility-overview.component.scss']
    }),
    __metadata("design:paramtypes", [FacilitiesManagerService,
        ActivatedRoute])
], FacilityOverviewComponent);
export { FacilityOverviewComponent };
//# sourceMappingURL=facility-overview.component.js.map