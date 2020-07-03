import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { RemoveGroupFromResourceDialogComponent } from '../../../../shared/components/dialogs/remove-group-from-resource-dialog/remove-group-from-resource-dialog.component';
import { AssignGroupToResourceDialogComponent } from '../../../../shared/components/dialogs/assign-group-to-resource-dialog/assign-group-to-resource-dialog.component';
import { TABLE_RESOURCE_ALLOWED_GROUPS, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let ResourceGroupsComponent = class ResourceGroupsComponent {
    constructor(route, resourcesManager, tableConfigService, dialog) {
        this.route = route;
        this.resourcesManager = resourcesManager;
        this.tableConfigService = tableConfigService;
        this.dialog = dialog;
        this.assignedGroups = [];
        this.selected = new SelectionModel(true, []);
        this.filteredGroups = [];
        this.tableId = TABLE_RESOURCE_ALLOWED_GROUPS;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.loading = true;
        this.route.parent.params.subscribe(parentParams => {
            this.resourceId = parentParams['resourceId'];
            this.loadAllGroups();
        });
    }
    loadAllGroups() {
        this.loading = true;
        this.resourcesManager.getAssignedGroups(this.resourceId).subscribe(assignedGroups => {
            this.assignedGroups = assignedGroups;
            this.filteredGroups = assignedGroups;
            this.selected.clear();
            this.loading = false;
        });
    }
    addGroup() {
        const config = getDefaultDialogConfig();
        config.width = '800px';
        config.data = { theme: 'resource-theme', resourceId: this.resourceId };
        const dialogRef = this.dialog.open(AssignGroupToResourceDialogComponent, config);
        dialogRef.afterClosed().subscribe((success) => {
            if (success) {
                this.loadAllGroups();
            }
        });
    }
    removeGroups() {
        const config = getDefaultDialogConfig();
        config.width = '500px';
        config.data = { resourceId: this.resourceId, groups: this.selected.selected };
        const dialogRef = this.dialog.open(RemoveGroupFromResourceDialogComponent, config);
        dialogRef.afterClosed().subscribe((success) => {
            if (success) {
                this.loadAllGroups();
            }
        });
    }
    applyFilter(filterValue) {
        this.filteredGroups = this.assignedGroups.filter(option => option.name.toLowerCase().includes(filterValue.toLowerCase()));
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
__decorate([
    ViewChild('checkbox', { static: true }),
    __metadata("design:type", MatCheckbox)
], ResourceGroupsComponent.prototype, "checkbox", void 0);
ResourceGroupsComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-resource-groups',
        templateUrl: './resource-groups.component.html',
        styleUrls: ['./resource-groups.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        ResourcesManagerService,
        TableConfigService,
        MatDialog])
], ResourceGroupsComponent);
export { ResourceGroupsComponent };
//# sourceMappingURL=resource-groups.component.js.map