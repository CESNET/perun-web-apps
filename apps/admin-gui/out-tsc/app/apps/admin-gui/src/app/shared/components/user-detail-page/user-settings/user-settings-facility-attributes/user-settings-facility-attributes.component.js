import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
let UserSettingsFacilityAttributesComponent = class UserSettingsFacilityAttributesComponent {
    constructor(route, storage, facilitiesManagerService, store) {
        this.route = route;
        this.storage = storage;
        this.facilitiesManagerService = facilitiesManagerService;
        this.store = store;
        this.facilities = [];
    }
    ngOnInit() {
        this.loading = true;
        if ((this.showPrincipal = this.route.snapshot.data.showPrincipal) === true) {
            this.userId = this.store.getPerunPrincipal().user.id;
        }
        else {
            this.route.parent.parent.params.subscribe(params => this.userId = params['userId']);
        }
        this.facilitiesManagerService.getAssignedFacilitiesByUser(this.userId).subscribe(facilities => {
            this.facilities = facilities;
            this.loading = false;
        });
    }
};
UserSettingsFacilityAttributesComponent = __decorate([
    Component({
        selector: 'app-user-settings-facility-attributes',
        templateUrl: './user-settings-facility-attributes.component.html',
        styleUrls: ['./user-settings-facility-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        StoreService,
        FacilitiesManagerService,
        StoreService])
], UserSettingsFacilityAttributesComponent);
export { UserSettingsFacilityAttributesComponent };
//# sourceMappingURL=user-settings-facility-attributes.component.js.map