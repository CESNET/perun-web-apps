import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../../../../shared/components/dialogs/create-group-dialog/create-group-dialog.component';
import { SideMenuService } from '../../../../core/services/common/side-menu.service';
import { ActivatedRoute } from '@angular/router';
import { DeleteGroupDialogComponent } from '../../../../shared/components/dialogs/delete-group-dialog/delete-group-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MoveGroupDialogComponent } from '../../../../shared/components/dialogs/move-group-dialog/move-group-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { applyFilter, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { GroupsManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_VO_GROUPS, TableConfigService } from '@perun-web-apps/config/table-config';
import { Urns } from '@perun-web-apps/perun/urns';
let VoGroupsComponent = class VoGroupsComponent {
    constructor(dialog, groupService, sideMenuService, voService, route, tableConfigService) {
        this.dialog = dialog;
        this.groupService = groupService;
        this.sideMenuService = sideMenuService;
        this.voService = voService;
        this.route = route;
        this.tableConfigService = tableConfigService;
        this.groups = [];
        this.filteredGroups = [];
        this.filteredTreeGroups = [];
        this.showGroupList = false;
        this.selected = new SelectionModel(true, []);
        this.filtering = false;
        this.tableId = TABLE_VO_GROUPS;
    }
    onCreateGroup() {
        const config = getDefaultDialogConfig();
        config.width = '350px';
        config.data = { voId: this.vo.id, parentGroup: null };
        const dialogRef = this.dialog.open(CreateGroupDialogComponent, config);
        dialogRef.afterClosed().subscribe((success) => {
            if (success) {
                this.loadAllGroups();
            }
        });
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        if (localStorage.getItem('preferedValue') === 'list') {
            this.checkbox.toggle();
            this.selected.clear();
            this.showGroupList = true;
        }
        this.checkbox.change.subscribe(() => {
            const value = this.checkbox.checked ? 'list' : 'tree';
            localStorage.setItem('preferedValue', value);
        });
        this.route.parent.params.subscribe(parentParams => {
            const voId = parentParams['voId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
                this.loadAllGroups();
            });
        });
    }
    deleteGroup() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = { voId: this.vo.id, groups: this.selected.selected };
        const dialogRef = this.dialog.open(DeleteGroupDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadAllGroups();
            }
        });
    }
    removeAllGroups() {
        this.selected.clear();
    }
    onMoveGroup(group) {
        console.log('Vo - ' + group);
        const config = getDefaultDialogConfig();
        config.width = '550px';
        config.data = {
            group: group,
            theme: 'vo-theme'
        };
        const dialogRef = this.dialog.open(MoveGroupDialogComponent, config);
        dialogRef.afterClosed().subscribe(groupMoved => {
            if (groupMoved) {
                this.loadAllGroups();
            }
        });
    }
    loadAllGroups() {
        this.loading = true;
        this.groupService.getAllRichGroupsWithAttributesByNames(this.vo.id, [
            Urns.GROUP_SYNC_ENABLED,
            Urns.GROUP_LAST_SYNC_STATE,
            Urns.GROUP_LAST_SYNC_TIMESTAMP,
            Urns.GROUP_STRUCTURE_SYNC_ENABLED,
            Urns.GROUP_LAST_STRUCTURE_SYNC_STATE,
            Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP
        ]).subscribe(groups => {
            this.groups = groups;
            this.filteredGroups = groups;
            this.filteredTreeGroups = groups;
            this.selected.clear();
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        const results = applyFilter(filterValue, this.groups);
        this.filteredGroups = results[0];
        this.filteredTreeGroups = results[1];
        this.filtering = filterValue !== '';
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
VoGroupsComponent.id = 'VoGroupsComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoGroupsComponent.prototype, "true", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], VoGroupsComponent.prototype, "vo", void 0);
__decorate([
    ViewChild('checkbox', { static: true }),
    __metadata("design:type", MatCheckbox)
], VoGroupsComponent.prototype, "checkbox", void 0);
VoGroupsComponent = __decorate([
    Component({
        selector: 'app-vo-groups',
        templateUrl: './vo-groups.component.html',
        styleUrls: ['./vo-groups.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        GroupsManagerService,
        SideMenuService,
        VosManagerService,
        ActivatedRoute,
        TableConfigService])
], VoGroupsComponent);
export { VoGroupsComponent };
//# sourceMappingURL=vo-groups.component.js.map