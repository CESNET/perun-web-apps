import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { TABLE_CREATE_RELATION_GROUP_DIALOG, TableConfigService } from '@perun-web-apps/config/table-config';
let CreateRelationDialogComponent = class CreateRelationDialogComponent {
    constructor(dialogRef, groupService, notificator, translate, tableConfigService, data) {
        this.dialogRef = dialogRef;
        this.groupService = groupService;
        this.notificator = notificator;
        this.translate = translate;
        this.tableConfigService = tableConfigService;
        this.data = data;
        this.selection = new SelectionModel(false, []);
        this.hideColumns = ['vo', 'menu'];
        this.filterValue = '';
        this.tableId = TABLE_CREATE_RELATION_GROUP_DIALOG;
        translate.get('DIALOGS.CREATE_RELATION.SUCCESS').subscribe(value => this.successMessage = value);
    }
    ngOnInit() {
        this.loading = true;
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.groupService.getGroupUnions(this.data.groupId, !this.data.reverse).subscribe(unionGroups => {
            unionGroups = unionGroups.concat(this.data.groups);
            this.groupService.getAllGroups(this.data.voId).subscribe(allGroups => {
                const groupIds = unionGroups.map(elem => elem.id);
                this.groups = allGroups.filter(group => !groupIds.includes(group.id) && group.id !== this.data.groupId);
                this.loading = false;
            });
        });
        this.theme = this.data.theme;
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        this.loading = true;
        this.groupService.createGroupUnion(this.data.groupId, this.selection.selected[0].id).subscribe(() => {
            this.notificator.showSuccess(this.successMessage);
            this.loading = false;
            this.dialogRef.close(true);
        }, () => this.loading = false);
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
CreateRelationDialogComponent = __decorate([
    Component({
        selector: 'app-create-relation-dialog',
        templateUrl: './create-relation-dialog.component.html',
        styleUrls: ['./create-relation-dialog.component.scss']
    }),
    __param(5, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef,
        GroupsManagerService,
        NotificatorService,
        TranslateService,
        TableConfigService, Object])
], CreateRelationDialogComponent);
export { CreateRelationDialogComponent };
//# sourceMappingURL=create-relation-dialog.component.js.map