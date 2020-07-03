import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacilitiesManagerService, OwnersManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TABLE_ADD_EXTSOURCE_DIALOG, TableConfigService } from '@perun-web-apps/config/table-config';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
let AddFacilityOwnerDialogComponent = class AddFacilityOwnerDialogComponent {
    constructor(dialogRef, data, notificator, tableConfigService, translate, ownersManagerService, facilitiesManagerService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.tableConfigService = tableConfigService;
        this.translate = translate;
        this.ownersManagerService = ownersManagerService;
        this.facilitiesManagerService = facilitiesManagerService;
        this.extSources = [];
        this.selection = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_ADD_EXTSOURCE_DIALOG;
        this.owners = [];
        this.translate.get('DIALOGS.ADD_OWNERS.SUCCESS').subscribe(result => this.successMessage = result);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.theme = this.data.theme;
        this.loading = true;
        this.ownersManagerService.getAllOwners().subscribe(owners => {
            this.owners = owners.filter(owner => !this.data.forbiddenOwners.includes(owner.id));
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    onAdd() {
        this.loading = true;
        if (this.selection.selected.length !== 0) {
            this.facilitiesManagerService.addFacilityOwner(this.data.facilityId, this.selection.selected.pop().id).subscribe(() => this.onAdd(), () => this.loading = false);
        }
        else {
            this.loading = false;
            this.notificator.showSuccess(this.successMessage);
            this.dialogRef.close(true);
        }
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
AddFacilityOwnerDialogComponent = __decorate([
    Component({
        selector: 'app-add-facility-owner-dialog',
        templateUrl: './add-facility-owner-dialog.component.html',
        styleUrls: ['./add-facility-owner-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TableConfigService,
        TranslateService,
        OwnersManagerService,
        FacilitiesManagerService])
], AddFacilityOwnerDialogComponent);
export { AddFacilityOwnerDialogComponent };
//# sourceMappingURL=add-facility-owner-dialog.component.js.map