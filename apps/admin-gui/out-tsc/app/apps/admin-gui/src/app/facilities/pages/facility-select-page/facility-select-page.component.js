import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { getRecentlyVisited, getRecentlyVisitedIds } from '@perun-web-apps/perun/utils';
import { TABLE_FACILITY_SELECT, TableConfigService } from '@perun-web-apps/config/table-config';
let FacilitySelectPageComponent = class FacilitySelectPageComponent {
    constructor(facilityManager, sideMenuService, tableConfigService) {
        this.facilityManager = facilityManager;
        this.sideMenuService = sideMenuService;
        this.tableConfigService = tableConfigService;
        this.facilities = [];
        this.recentIds = [];
        this.filterValue = '';
        this.tableId = TABLE_FACILITY_SELECT;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.sideMenuService.setFacilityMenuItems([]);
        this.refreshTable();
    }
    refreshTable() {
        this.loading = true;
        this.facilityManager.getRichFacilities().subscribe(facilities => {
            this.facilities = getRecentlyVisited('facilities', facilities);
            this.recentIds = getRecentlyVisitedIds('facilities');
            this.loading = false;
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
FacilitySelectPageComponent = __decorate([
    Component({
        selector: 'app-facility-select-page',
        templateUrl: './facility-select-page.component.html',
        styleUrls: ['./facility-select-page.component.scss']
    }),
    __metadata("design:paramtypes", [FacilitiesManagerService,
        SideMenuService,
        TableConfigService])
], FacilitySelectPageComponent);
export { FacilitySelectPageComponent };
//# sourceMappingURL=facility-select-page.component.js.map