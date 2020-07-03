import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let OwnersListComponent = class OwnersListComponent {
    constructor() {
        this.owners = [];
        this.hideColumns = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.filterValue = '';
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', 'name', 'contact', 'type'];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngAfterViewInit() {
        this.setDataSource();
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.filter = this.filterValue;
        }
    }
    ngOnChanges(changes) {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        this.dataSource = new MatTableDataSource(this.owners);
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
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], OwnersListComponent.prototype, "paginator", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], OwnersListComponent.prototype, "owners", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], OwnersListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], OwnersListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], OwnersListComponent.prototype, "pageSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], OwnersListComponent.prototype, "filterValue", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], OwnersListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], OwnersListComponent.prototype, "matSort", null);
OwnersListComponent = __decorate([
    Component({
        selector: 'app-owners-list',
        templateUrl: './owners-list.component.html',
        styleUrls: ['./owners-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], OwnersListComponent);
export { OwnersListComponent };
//# sourceMappingURL=owners-list.component.js.map