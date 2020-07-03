import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_SECURITY_TEAMS_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
let FacilitySecurityTeamsComponent = class FacilitySecurityTeamsComponent {
    constructor(dialog, facilitiesManager, tableConfigService, route) {
        this.dialog = dialog;
        this.facilitiesManager = facilitiesManager;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.securityTeams = [];
        this.selected = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_FACILITY_SECURITY_TEAMS_LIST;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.params.subscribe(parentParams => {
            const facilityId = parentParams['facilityId'];
            this.facilitiesManager.getFacilityById(facilityId).subscribe(facility => {
                this.facility = facility;
                this.refreshTable();
            });
        });
    }
    refreshTable() {
        this.loading = true;
        this.facilitiesManager.getAssignedSecurityTeams(this.facility.id).subscribe(securityTeams => {
            this.securityTeams = securityTeams;
            this.selected.clear();
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    addSecurityTeam() {
        //TODO
    }
    removeSecurityTeam() {
        //TODO
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
FacilitySecurityTeamsComponent = __decorate([
    Component({
        selector: 'app-facility-security-teams',
        templateUrl: './facility-security-teams.component.html',
        styleUrls: ['./facility-security-teams.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        FacilitiesManagerService,
        TableConfigService,
        ActivatedRoute])
], FacilitySecurityTeamsComponent);
export { FacilitySecurityTeamsComponent };
//# sourceMappingURL=facility-security-teams.component.js.map