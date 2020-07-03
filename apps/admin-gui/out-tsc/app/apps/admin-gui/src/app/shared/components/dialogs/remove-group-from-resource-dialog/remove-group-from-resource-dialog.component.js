import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
let RemoveGroupFromResourceDialogComponent = class RemoveGroupFromResourceDialogComponent {
    constructor(dialogRef, data, notificator, translate, resourceManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.resourceManager = resourceManager;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.groups);
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSubmit() {
        const groupsId = [];
        for (const group of this.data.groups) {
            groupsId.push(group.id);
        }
        this.resourceManager.removeGroupsFromResource(groupsId, this.data.resourceId).subscribe(() => {
            this.translate.get('DIALOGS.REMOVE_GROUP_FROM_RESOURCE.SUCCESS').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close(true);
            });
        });
    }
};
RemoveGroupFromResourceDialogComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-remove-group-from-resource-dialog',
        templateUrl: './remove-group-from-resource-dialog.component.html',
        styleUrls: ['./remove-group-from-resource-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        ResourcesManagerService])
], RemoveGroupFromResourceDialogComponent);
export { RemoveGroupFromResourceDialogComponent };
//# sourceMappingURL=remove-group-from-resource-dialog.component.js.map