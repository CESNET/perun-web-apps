import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
let RemoveGroupResourceDialogComponent = class RemoveGroupResourceDialogComponent {
    constructor(dialogRef, data, notificator, translate, resourcesManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.resourcesManager = resourcesManager;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.resources);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        const resourceIds = this.data.resources.map(res => res.id);
        this.resourcesManager.removeGroupFromResources(this.data.groupId, resourceIds).subscribe(() => {
            this.translate.get('DIALOGS.REMOVE_RESOURCES.SUCCESS').subscribe(successMessage => {
                this.loading = false;
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close(true);
            });
        }, () => this.loading = false);
    }
};
RemoveGroupResourceDialogComponent = __decorate([
    Component({
        selector: 'app-remove-group-resource-dialog',
        templateUrl: './remove-group-resource-dialog.component.html',
        styleUrls: ['./remove-group-resource-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        ResourcesManagerService])
], RemoveGroupResourceDialogComponent);
export { RemoveGroupResourceDialogComponent };
//# sourceMappingURL=remove-group-resource-dialog.component.js.map