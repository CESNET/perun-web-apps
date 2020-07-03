import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { GroupsManagerService, ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { TableConfigService, TABLE_GROUP_RESOURCES_LIST } from '@perun-web-apps/config/table-config';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupResourceDialogComponent } from '../../../../shared/components/dialogs/add-group-resource-dialog/add-group-resource-dialog.component';
import { RemoveGroupResourceDialogComponent } from '../../../../shared/components/dialogs/remove-group-resource-dialog/remove-group-resource-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let GroupResourcesComponent = class GroupResourcesComponent {
    constructor(resourcesManager, groupService, tableConfigService, route, dialog) {
        this.resourcesManager = resourcesManager;
        this.groupService = groupService;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.dialog = dialog;
        this.resources = null;
        this.selected = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_GROUP_RESOURCES_LIST;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.params.subscribe(parentParams => {
            this.groupId = parentParams['groupId'];
            this.voId = parentParams['voId'];
            this.groupService.getGroupById(this.groupId).subscribe(group => {
                this.group = group;
                this.refreshTable();
            });
        });
    }
    refreshTable() {
        this.loading = true;
        this.resourcesManager.getAssignedRichResourcesWithGroup(this.group.id).subscribe(resources => {
            this.resources = resources;
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
    addResource() {
        const config = getDefaultDialogConfig();
        config.width = '750px';
        config.data = { theme: 'group-theme', groupId: this.groupId, voId: this.voId, unwantedResources: this.resources.map(res => res.id) };
        const dialogRef = this.dialog.open(AddGroupResourceDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    removeResource() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = { theme: 'group-theme', resources: this.selected.selected, groupId: this.groupId };
        const dialogRef = this.dialog.open(RemoveGroupResourceDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selected.clear();
                this.refreshTable();
            }
        });
    }
};
GroupResourcesComponent.id = 'GroupResourcesComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], GroupResourcesComponent.prototype, "true", void 0);
GroupResourcesComponent = __decorate([
    Component({
        selector: 'app-group-resources',
        templateUrl: './group-resources.component.html',
        styleUrls: ['./group-resources.component.scss']
    }),
    __metadata("design:paramtypes", [ResourcesManagerService,
        GroupsManagerService,
        TableConfigService,
        ActivatedRoute,
        MatDialog])
], GroupResourcesComponent);
export { GroupResourcesComponent };
//# sourceMappingURL=group-resources.component.js.map