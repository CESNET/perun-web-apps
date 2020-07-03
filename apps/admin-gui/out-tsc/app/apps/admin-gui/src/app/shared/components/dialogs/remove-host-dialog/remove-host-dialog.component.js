import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
let RemoveHostDialogComponent = class RemoveHostDialogComponent {
    constructor(dialogRef, data, facilitiesManager, notificator, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.facilitiesManager = facilitiesManager;
        this.notificator = notificator;
        this.translate = translate;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.hosts = this.data.hosts;
        this.dataSource = new MatTableDataSource(this.data.hosts);
    }
    onConfirm() {
        this.facilitiesManager.removeHosts(this.data.facilityId, this.hosts.map(m => m.id)).subscribe(() => {
            this.notificator.showSuccess(this.translate.instant('DIALOGS.REMOVE_HOST.SUCCESS'));
            this.dialogRef.close(true);
        });
    }
    onCancel() {
        this.dialogRef.close(false);
    }
};
RemoveHostDialogComponent = __decorate([
    Component({
        selector: 'app-remove-host-dialog',
        templateUrl: './remove-host-dialog.component.html',
        styleUrls: ['./remove-host-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, FacilitiesManagerService,
        NotificatorService,
        TranslateService])
], RemoveHostDialogComponent);
export { RemoveHostDialogComponent };
//# sourceMappingURL=remove-host-dialog.component.js.map