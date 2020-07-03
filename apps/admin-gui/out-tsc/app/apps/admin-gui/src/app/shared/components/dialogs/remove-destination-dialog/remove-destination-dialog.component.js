import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TABLE_FACILITY_SERVICES_DESTINATION_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
let RemoveDestinationDialogComponent = class RemoveDestinationDialogComponent {
    constructor(dialogRef, data, tableConfigService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.tableConfigService = tableConfigService;
        this.displayedColumns = ['destinationId', 'service', 'destination', 'type', 'propagationType'];
        this.tableId = TABLE_FACILITY_SERVICES_DESTINATION_LIST;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.dialogRef.close(true);
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
RemoveDestinationDialogComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-remove-destination-dialog',
        templateUrl: './remove-destination-dialog.component.html',
        styleUrls: ['./remove-destination-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, TableConfigService])
], RemoveDestinationDialogComponent);
export { RemoveDestinationDialogComponent };
//# sourceMappingURL=remove-destination-dialog.component.js.map