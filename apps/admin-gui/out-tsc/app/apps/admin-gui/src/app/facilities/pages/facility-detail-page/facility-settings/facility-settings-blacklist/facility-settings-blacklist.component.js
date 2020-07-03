import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { FacilitiesManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_BLACKLIST_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
let FacilitySettingsBlacklistComponent = class FacilitySettingsBlacklistComponent {
    constructor(facilitiesManager, usersManager, tableConfigService, route) {
        this.facilitiesManager = facilitiesManager;
        this.usersManager = usersManager;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.bansOnFacilitiesWithUsers = [];
        this.selected = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_FACILITY_BLACKLIST_LIST;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.refreshTable();
    }
    refreshTable() {
        this.loading = true;
        this.route.parent.parent.params.subscribe(parentParentParams => {
            const facilityId = parentParentParams['facilityId'];
            this.facilitiesManager.getBansForFacility(facilityId).subscribe(bansOnFacility => {
                const listOfBans = bansOnFacility;
                for (const ban of listOfBans) {
                    let user;
                    this.usersManager.getUserById(ban.userId).subscribe(subscriptionUser => {
                        user = subscriptionUser;
                    });
                    this.bansOnFacilitiesWithUsers.push([ban, user]);
                }
                this.selected.clear();
                this.loading = false;
            });
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
FacilitySettingsBlacklistComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-facility-settings-blacklist',
        templateUrl: './facility-settings-blacklist.component.html',
        styleUrls: ['./facility-settings-blacklist.component.scss']
    }),
    __metadata("design:paramtypes", [FacilitiesManagerService,
        UsersManagerService,
        TableConfigService,
        ActivatedRoute])
], FacilitySettingsBlacklistComponent);
export { FacilitySettingsBlacklistComponent };
//# sourceMappingURL=facility-settings-blacklist.component.js.map