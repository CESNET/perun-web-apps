import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';
let RemoveFacilityOwnerDialogComponent = class RemoveFacilityOwnerDialogComponent {
    constructor(dialogRef, data, notificator, translate, facilitiesManagerService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.facilitiesManagerService = facilitiesManagerService;
        this.displayedColumns = ['name'];
        translate.get('DIALOGS.REMOVE_OWNERS.SUCCESS').subscribe(res => this.successMessage = res);
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.owners);
        this.theme = this.data.theme;
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        if (this.data.owners.length !== 0) {
            this.facilitiesManagerService.removeFacilityOwner(this.data.facilityId, this.data.owners.pop().id).subscribe(() => this.onSubmit(), () => this.loading = false);
        }
        else {
            this.loading = false;
            this.notificator.showSuccess(this.successMessage);
            this.dialogRef.close(true);
        }
    }
};
RemoveFacilityOwnerDialogComponent = __decorate([
    Component({
        selector: 'app-remove-facility-owner-dialog',
        templateUrl: './remove-facility-owner-dialog.component.html',
        styleUrls: ['./remove-facility-owner-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        FacilitiesManagerService])
], RemoveFacilityOwnerDialogComponent);
export { RemoveFacilityOwnerDialogComponent };
//# sourceMappingURL=remove-facility-owner-dialog.component.js.map