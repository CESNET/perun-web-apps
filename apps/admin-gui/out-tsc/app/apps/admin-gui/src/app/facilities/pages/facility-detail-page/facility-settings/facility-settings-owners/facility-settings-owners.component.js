import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddFacilityOwnerDialogComponent } from '../../../../../shared/components/dialogs/add-facility-owner-dialog/add-facility-owner-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { RemoveFacilityOwnerDialogComponent } from '../../../../../shared/components/dialogs/remove-facility-owner-dialog/remove-facility-owner-dialog.component';
let FacilitySettingsOwnersComponent = class FacilitySettingsOwnersComponent {
    constructor(facilitiesManagerService, route, dialog) {
        this.facilitiesManagerService = facilitiesManagerService;
        this.route = route;
        this.dialog = dialog;
        this.owners = [];
        this.selection = new SelectionModel(true, []);
    }
    ngOnInit() {
        this.route.parent.parent.params.subscribe(params => {
            this.facilityId = params['facilityId'];
            this.refreshTable();
        });
    }
    refreshTable() {
        this.loading = true;
        this.selection.clear();
        this.facilitiesManagerService.getFacilityOwners(this.facilityId).subscribe(owners => {
            this.owners = owners;
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    onCreate() {
        const config = getDefaultDialogConfig();
        config.width = '800px';
        config.data = { theme: 'facility-theme', facilityId: this.facilityId, forbiddenOwners: this.owners.map(owner => owner.id) };
        const dialogRef = this.dialog.open(AddFacilityOwnerDialogComponent, config);
        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this.refreshTable();
            }
        });
    }
    onRemove() {
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = { theme: 'facility-theme', owners: this.selection.selected, facilityId: this.facilityId };
        const dialogRef = this.dialog.open(RemoveFacilityOwnerDialogComponent, config);
        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this.refreshTable();
            }
        });
    }
};
FacilitySettingsOwnersComponent = __decorate([
    Component({
        selector: 'app-facility-settings-owners',
        templateUrl: './facility-settings-owners.component.html',
        styleUrls: ['./facility-settings-owners.component.scss']
    }),
    __metadata("design:paramtypes", [FacilitiesManagerService,
        ActivatedRoute,
        MatDialog])
], FacilitySettingsOwnersComponent);
export { FacilitySettingsOwnersComponent };
//# sourceMappingURL=facility-settings-owners.component.js.map