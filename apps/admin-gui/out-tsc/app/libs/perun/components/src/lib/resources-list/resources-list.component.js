import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let ResourcesListComponent = class ResourcesListComponent {
    constructor() {
        this.resources = [];
        this.hideColumns = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.disableRouting = false;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', 'name', 'facility', 'tags', 'description'];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        this.dataSource = new MatTableDataSource(this.resources);
        this.setDataSource();
        this.dataSource.filter = this.filterValue;
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }
    /** The label for the checkbox on the passed row */
    checkboxLabel(row) {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], ResourcesListComponent.prototype, "matSort", null);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ResourcesListComponent.prototype, "resources", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ResourcesListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ResourcesListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ResourcesListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ResourcesListComponent.prototype, "pageSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ResourcesListComponent.prototype, "disableRouting", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], ResourcesListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], ResourcesListComponent.prototype, "paginator", void 0);
ResourcesListComponent = __decorate([
    Component({
        selector: 'perun-web-apps-resources-list',
        templateUrl: './resources-list.component.html',
        styleUrls: ['./resources-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], ResourcesListComponent);
export { ResourcesListComponent };
//# sourceMappingURL=resources-list.component.js.map