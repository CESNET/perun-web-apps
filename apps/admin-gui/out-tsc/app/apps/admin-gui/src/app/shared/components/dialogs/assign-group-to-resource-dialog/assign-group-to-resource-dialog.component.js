import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { GroupsManagerService, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { TABLE_ASSIGN_GROUP_TO_RESOURCE_DIALOG, TableConfigService } from '@perun-web-apps/config/table-config';
let AssignGroupToResourceDialogComponent = class AssignGroupToResourceDialogComponent {
    constructor(dialogRef, data, notificator, translate, resourceManager, tableConfigService, groupService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.resourceManager = resourceManager;
        this.tableConfigService = tableConfigService;
        this.groupService = groupService;
        this.loading = false;
        this.checkGroups = false;
        this.selection = new SelectionModel(true, []);
        this.tableId = TABLE_ASSIGN_GROUP_TO_RESOURCE_DIALOG;
    }
    ngOnInit() {
        this.loading = true;
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.theme = this.data.theme;
        this.resourceManager.getResourceById(this.data.resourceId).subscribe(resource => {
            this.resource = resource;
            this.resourceManager.getAssignedGroups(this.resource.id).subscribe(assignedGroups => {
                this.groupService.getAllGroups(this.resource.voId).subscribe(allGroups => {
                    this.unAssignedGroups = allGroups;
                    for (const assignedGroup of assignedGroups) {
                        for (const allGroup of allGroups) {
                            if (assignedGroup.id === allGroup.id) {
                                this.unAssignedGroups.splice(this.unAssignedGroups.indexOf(allGroup), 1);
                            }
                        }
                    }
                    this.filteredGroups = this.unAssignedGroups;
                    this.loading = false;
                });
            });
        });
    }
    onCancel() {
        this.dialogRef.close();
    }
    onAdd() {
        if (this.checkGroups) {
            //TODO when checkbox is checked
        }
        else {
            this.loading = true;
            const addedGroups = [];
            for (const group of this.selection.selected) {
                addedGroups.push(group.id);
            }
            this.resourceManager.assignGroupsToResource(addedGroups, this.resource.id).subscribe(() => {
                this.translate.get('DIALOGS.ASSIGN_GROUP_TO_RESOURCE.SUCCESS_MESSAGE').subscribe(message => {
                    this.notificator.showSuccess(message);
                    this.dialogRef.close(true);
                });
            });
        }
    }
    applyFilter(filterValue) {
        this.filteredGroups = this.unAssignedGroups.filter(option => option.name.toLowerCase().includes(filterValue.toLowerCase()));
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
AssignGroupToResourceDialogComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-assign-group-to-resource-dialog',
        templateUrl: './assign-group-to-resource-dialog.component.html',
        styleUrls: ['./assign-group-to-resource-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        ResourcesManagerService,
        TableConfigService,
        GroupsManagerService])
], AssignGroupToResourceDialogComponent);
export { AssignGroupToResourceDialogComponent };
//# sourceMappingURL=assign-group-to-resource-dialog.component.js.map