import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let BlacklistListComponent = class BlacklistListComponent {
    constructor() {
        this.bansOnFacilitiesWithUsers = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'userId', 'name', 'reason'];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.bansOnFacilitiesWithUsers);
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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row[0].userId + 1}`;
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], BlacklistListComponent.prototype, "matSort", null);
__decorate([
    Input(),
    __metadata("design:type", Array)
], BlacklistListComponent.prototype, "bansOnFacilitiesWithUsers", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], BlacklistListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], BlacklistListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], BlacklistListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], BlacklistListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], BlacklistListComponent.prototype, "paginator", void 0);
BlacklistListComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-blacklist-list',
        templateUrl: './blacklist-list.component.html',
        styleUrls: ['./blacklist-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], BlacklistListComponent);
export { BlacklistListComponent };
//# sourceMappingURL=blacklist-list.component.js.map