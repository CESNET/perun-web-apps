import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { RemoveResourceDialogComponent } from '../../../../shared/components/dialogs/remove-resource-dialog/remove-resource-dialog.component';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { CreateResourceDialogComponent } from '../../../../shared/components/dialogs/create-resource-dialog/create-resource-dialog.component';
import { TABLE_FACILITY_RESOURCES_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let FacilityResourcesComponent = class FacilityResourcesComponent {
    constructor(dialog, facilitiesManager, tableConfigService, route) {
        this.dialog = dialog;
        this.facilitiesManager = facilitiesManager;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.resources = [];
        this.selected = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_FACILITY_RESOURCES_LIST;
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
    removeResource() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = { theme: 'facility-theme', resources: this.selected.selected };
        const dialogRef = this.dialog.open(RemoveResourceDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    refreshTable() {
        this.loading = true;
        this.facilitiesManager.getAssignedRichResourcesForFacility(this.facility.id).subscribe(resources => {
            this.resources = resources;
            this.selected.clear();
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    createResource() {
        const config = getDefaultDialogConfig();
        config.width = '1350px';
        config.data = { facilityId: this.facility.id, theme: 'facility-theme' };
        const dialogRef = this.dialog.open(CreateResourceDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
FacilityResourcesComponent.id = 'FacilityResourcesComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], FacilityResourcesComponent.prototype, "true", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], FacilityResourcesComponent.prototype, "facility", void 0);
FacilityResourcesComponent = __decorate([
    Component({
        selector: 'app-facility-resources',
        templateUrl: './facility-resources.component.html',
        styleUrls: ['./facility-resources.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        FacilitiesManagerService,
        TableConfigService,
        ActivatedRoute])
], FacilityResourcesComponent);
export { FacilityResourcesComponent };
//# sourceMappingURL=facility-resources.component.js.map