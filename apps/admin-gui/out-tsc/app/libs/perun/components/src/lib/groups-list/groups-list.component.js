import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let GroupsListComponent = class GroupsListComponent {
    constructor() {
        this.moveGroup = new EventEmitter();
        this.groups = [];
        this.selection = new SelectionModel(true, []);
        this.hasMembersGroup = false;
        this.hideColumns = [];
        this.groupsToDisable = new Set();
        this.pageSize = 10;
        this.filter = '';
        this.disableRouting = false;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', 'vo', 'name', 'description', 'menu'];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.disabledRouting = this.disableRouting;
        this.hasMembersGroup = this.checkIfHasMembersGroup();
        this.dataSource = new MatTableDataSource(this.groups);
        this.setDataSource();
    }
    checkIfHasMembersGroup() {
        for (const group of this.groups) {
            if (group.name === 'members') {
                return true;
            }
        }
        return false;
    }
    setDataSource() {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.filter = this.filter;
        }
    }
    isAllSelected() {
        let numSelected = this.selection.selected.length;
        if (numSelected > 0 && this.hasMembersGroup && this.disableMembers) {
            numSelected++;
        }
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => {
                if (row.name !== 'members') {
                    this.selection.select(row);
                }
                else if (!this.disableMembers) {
                    this.selection.select(row);
                }
            });
    }
    checkboxLabel(row) {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    disableSelect(id) {
        return this.disableGroups && this.groupsToDisable.has(id);
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    onMoveGroup(group) {
        this.moveGroup.emit(group);
        this.disabledRouting = false;
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], GroupsListComponent.prototype, "matSort", null);
__decorate([
    Output(),
    __metadata("design:type", Object)
], GroupsListComponent.prototype, "moveGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], GroupsListComponent.prototype, "groups", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], GroupsListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], GroupsListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], GroupsListComponent.prototype, "disableMembers", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], GroupsListComponent.prototype, "disableGroups", void 0);
__decorate([
    Input(),
    __metadata("design:type", Set)
], GroupsListComponent.prototype, "groupsToDisable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], GroupsListComponent.prototype, "pageSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], GroupsListComponent.prototype, "filter", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], GroupsListComponent.prototype, "disableHeadCheckbox", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], GroupsListComponent.prototype, "disableRouting", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], GroupsListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], GroupsListComponent.prototype, "paginator", void 0);
GroupsListComponent = __decorate([
    Component({
        selector: 'perun-web-apps-groups-list',
        templateUrl: './groups-list.component.html',
        styleUrls: ['./groups-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], GroupsListComponent);
export { GroupsListComponent };
//# sourceMappingURL=groups-list.component.js.map