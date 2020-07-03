import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { GroupsManagerService } from '@perun-web-apps/perun/openapi';
import { CreateRelationDialogComponent } from '../../../../../shared/components/dialogs/create-relation-dialog/create-relation-dialog.component';
import { RemoveRelationDialogComponent } from '../../../../../shared/components/dialogs/remove-relation-dialog/remove-relation-dialog.component';
import { TABLE_GROUP_SETTINGS_RELATIONS, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let GroupSettingsRelationsComponent = class GroupSettingsRelationsComponent {
    constructor(route, groupService, tableConfigService, dialog) {
        this.route = route;
        this.groupService = groupService;
        this.tableConfigService = tableConfigService;
        this.dialog = dialog;
        this.selection = new SelectionModel(true, []);
        this.groups = [];
        this.reverse = false;
        this.filterValue = '';
        this.tableId = TABLE_GROUP_SETTINGS_RELATIONS;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(params => {
            this.groupId = params['groupId'];
            this.voId = params['voId'];
            this.refreshTable();
        });
    }
    onCreate() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            groups: this.groups,
            theme: 'group-theme',
            groupId: +this.groupId,
            voId: this.voId,
            reverse: this.reverse
        };
        const dialogRef = this.dialog.open(CreateRelationDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    onDelete() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            groups: this.selection.selected,
            theme: 'group-theme',
            groupId: +this.groupId,
            reverse: this.reverse
        };
        const dialogRef = this.dialog.open(RemoveRelationDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    refreshTable() {
        this.loading = true;
        this.groupService.getGroupUnions(this.groupId, this.reverse).subscribe(groups => {
            this.groups = groups;
            this.selection.clear();
            this.loading = false;
        }, () => this.loading = false);
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    showReverseUnions() {
        this.reverse = !this.reverse;
        this.refreshTable();
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupSettingsRelationsComponent.prototype, "true", void 0);
GroupSettingsRelationsComponent = __decorate([
    Component({
        selector: 'app-group-settings-relations',
        templateUrl: './group-settings-relations.component.html',
        styleUrls: ['./group-settings-relations.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        GroupsManagerService,
        TableConfigService,
        MatDialog])
], GroupSettingsRelationsComponent);
export { GroupSettingsRelationsComponent };
//# sourceMappingURL=group-settings-relations.component.js.map