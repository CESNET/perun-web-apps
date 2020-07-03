import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
let CreateResourceTagDialogComponent = class CreateResourceTagDialogComponent {
    constructor(dialogRef, data, resourceManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.resourceManager = resourceManager;
        this.name = '';
    }
    ngOnInit() {
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        if (this.name !== '') {
            this.resourceManager.createResourceTagWithTagName(this.name, this.data.voId).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }
};
CreateResourceTagDialogComponent = __decorate([
    Component({
        selector: 'app-create-resource-tag-dialog',
        templateUrl: './create-resource-tag-dialog.component.html',
        styleUrls: ['./create-resource-tag-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, ResourcesManagerService])
], CreateResourceTagDialogComponent);
export { CreateResourceTagDialogComponent };
//# sourceMappingURL=create-resource-tag-dialog.component.js.map