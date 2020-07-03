import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let ExtSourcesListComponent = class ExtSourcesListComponent {
    constructor() {
        this.selection = new SelectionModel();
        this.filterValue = '';
        this.hideColumns = [];
        this.pageSize = 5;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', 'name', 'type'];
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
    ngOnChanges(changes) {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        this.dataSource = new MatTableDataSource(this.extSources);
        this.setDataSource();
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.filter = this.filterValue;
        }
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
    Input(),
    __metadata("design:type", Array)
], ExtSourcesListComponent.prototype, "extSources", void 0);
__decorate([
    Input(),
    __metadata("design:type", SelectionModel)
], ExtSourcesListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ExtSourcesListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ExtSourcesListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ExtSourcesListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ExtSourcesListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], ExtSourcesListComponent.prototype, "paginator", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], ExtSourcesListComponent.prototype, "matSort", null);
ExtSourcesListComponent = __decorate([
    Component({
        selector: 'app-ext-sources-list',
        templateUrl: './ext-sources-list.component.html',
        styleUrls: ['./ext-sources-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], ExtSourcesListComponent);
export { ExtSourcesListComponent };
//# sourceMappingURL=ext-sources-list.component.js.map