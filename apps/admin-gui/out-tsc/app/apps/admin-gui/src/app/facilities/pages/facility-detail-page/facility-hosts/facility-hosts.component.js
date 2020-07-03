import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_FACILITY_HOSTS_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddHostDialogComponent } from '../../../../shared/components/dialogs/add-host-dialog/add-host-dialog.component';
import { RemoveHostDialogComponent } from '../../../../shared/components/dialogs/remove-host-dialog/remove-host-dialog.component';
let FacilityHostsComponent = class FacilityHostsComponent {
    constructor(dialog, facilitiesManager, tableConfigService, route) {
        this.dialog = dialog;
        this.facilitiesManager = facilitiesManager;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.hosts = [];
        this.selected = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_FACILITY_HOSTS_LIST;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.params.subscribe(parentParams => {
            this.facilityId = parentParams['facilityId'];
            this.facilitiesManager.getFacilityById(this.facilityId).subscribe(facility => {
                this.facility = facility;
                this.refreshTable();
            });
        });
    }
    refreshTable() {
        this.loading = true;
        this.facilitiesManager.getHosts(this.facilityId).subscribe(hosts => {
            this.hosts = hosts;
            this.selected.clear();
            this.loading = false;
        });
    }
    addHost() {
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = {
            facilityId: this.facility.id,
            facilityName: this.facility.name,
            theme: 'facility-theme'
        };
        const dialogRef = this.dialog.open(AddHostDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    removeHost() {
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = {
            facilityId: this.facility.id,
            theme: 'facility-theme',
            hosts: this.selected.selected
        };
        const dialogRef = this.dialog.open(RemoveHostDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
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
FacilityHostsComponent = __decorate([
    Component({
        selector: 'app-facility-hosts',
        templateUrl: './facility-hosts.component.html',
        styleUrls: ['./facility-hosts.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        FacilitiesManagerService,
        TableConfigService,
        ActivatedRoute])
], FacilityHostsComponent);
export { FacilityHostsComponent };
//# sourceMappingURL=facility-hosts.component.js.map