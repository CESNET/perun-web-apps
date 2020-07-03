import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let DestinationListComponent = class DestinationListComponent {
    constructor() {
        this.destinations = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.destinations);
        this.setDataSource();
        this.dataSource.filter = this.filterValue.toLowerCase();
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'service': {
                        return item.service.name;
                    }
                    default: return item[property];
                }
            };
            this.dataSource.filterPredicate = (data, filter) => {
                const dataStr = data.service.name + data.id + data.destination + data.type + data.propagationType;
                return dataStr.indexOf(filter) !== -1;
            };
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
    pageChanged(event) {
        this.page.emit(event);
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], DestinationListComponent.prototype, "destinations", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DestinationListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], DestinationListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DestinationListComponent.prototype, "pageSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], DestinationListComponent.prototype, "displayedColumns", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], DestinationListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], DestinationListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], DestinationListComponent.prototype, "paginator", void 0);
DestinationListComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-destination-list',
        templateUrl: './destination-list.component.html',
        styleUrls: ['./destination-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], DestinationListComponent);
export { DestinationListComponent };
//# sourceMappingURL=destination-list.component.js.map