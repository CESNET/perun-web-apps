import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let SecurityTeamsListComponent = class SecurityTeamsListComponent {
    constructor() {
        this.securityTeams = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', "name", "description"];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.securityTeams);
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
], SecurityTeamsListComponent.prototype, "matSort", null);
__decorate([
    Input(),
    __metadata("design:type", Array)
], SecurityTeamsListComponent.prototype, "securityTeams", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], SecurityTeamsListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], SecurityTeamsListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], SecurityTeamsListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], SecurityTeamsListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], SecurityTeamsListComponent.prototype, "paginator", void 0);
SecurityTeamsListComponent = __decorate([
    Component({
        selector: 'app-security-teams-list',
        templateUrl: './security-teams-list.component.html',
        styleUrls: ['./security-teams-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], SecurityTeamsListComponent);
export { SecurityTeamsListComponent };
//# sourceMappingURL=security-teams-list.component.js.map