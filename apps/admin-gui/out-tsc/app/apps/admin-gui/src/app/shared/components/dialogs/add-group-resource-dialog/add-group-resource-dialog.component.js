import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
let AddGroupResourceDialogComponent = class AddGroupResourceDialogComponent {
    constructor(dialogRef, data, notificator, translate, resourcesManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.resourcesManager = resourcesManager;
        this.filterValue = '';
        this.resources = [];
        this.hiddenColumns = ['tags', 'facility'];
        this.selection = new SelectionModel(true, []);
        this.theme = '';
    }
    ngOnInit() {
        this.theme = this.data.theme;
        this.loading = true;
        this.resourcesManager.getResources(this.data.voId).subscribe(resources => {
            this.resources = resources.filter(res => !this.data.unwantedResources.includes(res.id));
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        const resourceIds = this.selection.selected.map(res => res.id);
        this.resourcesManager.assignGroupToResources(this.data.groupId, resourceIds).subscribe(() => {
            this.translate.get('DIALOGS.ADD_GROUP_RESOURCES.SUCCESS').subscribe(successMessage => {
                this.loading = false;
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close(true);
            });
        }, () => this.loading = false);
    }
};
AddGroupResourceDialogComponent = __decorate([
    Component({
        selector: 'app-add-group-resource-dialog',
        templateUrl: './add-group-resource-dialog.component.html',
        styleUrls: ['./add-group-resource-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        ResourcesManagerService])
], AddGroupResourceDialogComponent);
export { AddGroupResourceDialogComponent };
//# sourceMappingURL=add-group-resource-dialog.component.js.map