import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
let ServicesListComponent = class ServicesListComponent {
    constructor() {
        this.services = [];
        this.hideColumns = [];
        this.displayedColumns = ['select', 'id', 'name', 'enabled', 'script', 'description'];
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnInit() {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        this.dataSource = new MatTableDataSource(this.services);
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        this.dataSource = new MatTableDataSource(this.services);
        this.setDataSource();
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
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
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], ServicesListComponent.prototype, "matSort", null);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ServicesListComponent.prototype, "services", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ServicesListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ServicesListComponent.prototype, "selection", void 0);
ServicesListComponent = __decorate([
    Component({
        selector: 'app-services-list',
        templateUrl: './services-list.component.html',
        styleUrls: ['./services-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], ServicesListComponent);
export { ServicesListComponent };
//# sourceMappingURL=services-list.component.js.map