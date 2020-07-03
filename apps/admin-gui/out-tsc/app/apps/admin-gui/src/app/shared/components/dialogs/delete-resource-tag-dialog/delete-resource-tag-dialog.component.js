import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
let DeleteResourceTagDialogComponent = class DeleteResourceTagDialogComponent {
    constructor(dialogRef, data, resourceManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.resourceManager = resourceManager;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.tagsForDelete);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        for (const resourceTag of this.data.tagsForDelete) {
            this.resourceManager.deleteResourceTag({ resourceTag: resourceTag }).subscribe(() => {
                this.dialogRef.close(true);
            }, error => this.dialogRef.close(true));
        }
    }
};
DeleteResourceTagDialogComponent = __decorate([
    Component({
        selector: 'app-delete-resource-tag-dialog',
        templateUrl: './delete-resource-tag-dialog.component.html',
        styleUrls: ['./delete-resource-tag-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, ResourcesManagerService])
], DeleteResourceTagDialogComponent);
export { DeleteResourceTagDialogComponent };
//# sourceMappingURL=delete-resource-tag-dialog.component.js.map