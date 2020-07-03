import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { parseFullName, parseUserEmail, parseVo, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let UsersListComponent = class UsersListComponent {
    constructor() {
        this.hideColumns = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', 'name', 'email', 'logins', 'organization'];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'name':
                        return parseFullName(item);
                    case 'email':
                        return parseUserEmail(item);
                    case 'organization':
                        return parseVo(item);
                    default:
                        return item[property];
                }
            };
        }
    }
    ngOnChanges(changes) {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.setDataSource();
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }
    checkboxLabel(row) {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], UsersListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator, { static: true }),
    __metadata("design:type", MatPaginator)
], UsersListComponent.prototype, "paginator", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], UsersListComponent.prototype, "users", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], UsersListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], UsersListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], UsersListComponent.prototype, "inDialog", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], UsersListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], UsersListComponent.prototype, "page", void 0);
UsersListComponent = __decorate([
    Component({
        selector: 'app-users-list',
        templateUrl: './users-list.component.html',
        styleUrls: ['./users-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], UsersListComponent);
export { UsersListComponent };
//# sourceMappingURL=users-list.component.js.map