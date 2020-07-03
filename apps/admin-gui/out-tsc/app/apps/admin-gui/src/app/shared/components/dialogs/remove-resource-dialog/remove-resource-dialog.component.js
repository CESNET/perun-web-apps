import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
let RemoveResourceDialogComponent = class RemoveResourceDialogComponent {
    constructor(dialogRef, data, notificator, translate, resourcesManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.resourcesManager = resourcesManager;
        this.displayedColumns = ['name'];
        this.loading = false;
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.resources);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        if (this.data.resources.length === 0) {
            this.translate.get('DIALOGS.REMOVE_RESOURCES.SUCCESS').subscribe(successMessage => {
                this.loading = false;
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close(true);
            });
        }
        else {
            this.resourcesManager.deleteResource(this.data.resources[0].id).subscribe(() => {
                this.data.resources.shift();
                this.onSubmit();
            }, () => {
                this.dialogRef.close(true);
            });
        }
    }
};
RemoveResourceDialogComponent = __decorate([
    Component({
        selector: 'app-remove-resource-dialog',
        templateUrl: './remove-resource-dialog.component.html',
        styleUrls: ['./remove-resource-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        ResourcesManagerService])
], RemoveResourceDialogComponent);
export { RemoveResourceDialogComponent };
//# sourceMappingURL=remove-resource-dialog.component.js.map