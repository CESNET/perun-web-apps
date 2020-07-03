import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
import { Router } from '@angular/router';
let HostsListComponent = class HostsListComponent {
    constructor(router) {
        this.router = router;
        this.hosts = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', "name"];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.hosts);
        this.setDataSource();
        this.dataSource.filter = this.filterValue;
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'name': {
                        if (item.hostname) {
                            return item.hostname;
                        }
                        break;
                    }
                    default: return item[property];
                }
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
    selectHost(host) {
        this.router.navigate(['/facilities', this.facilityId, 'hosts', host.id]);
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], HostsListComponent.prototype, "matSort", null);
__decorate([
    Input(),
    __metadata("design:type", Array)
], HostsListComponent.prototype, "hosts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], HostsListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], HostsListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], HostsListComponent.prototype, "pageSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], HostsListComponent.prototype, "facilityId", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], HostsListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], HostsListComponent.prototype, "paginator", void 0);
HostsListComponent = __decorate([
    Component({
        selector: 'app-hosts-list',
        templateUrl: './hosts-list.component.html',
        styleUrls: ['./hosts-list.component.css']
    }),
    __metadata("design:paramtypes", [Router])
], HostsListComponent);
export { HostsListComponent };
//# sourceMappingURL=hosts-list.component.js.map