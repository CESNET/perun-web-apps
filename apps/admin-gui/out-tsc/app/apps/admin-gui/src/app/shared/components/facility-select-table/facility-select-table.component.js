import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { parseTechnicalOwnersNames, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let FacilitySelectTableComponent = class FacilitySelectTableComponent {
    constructor() {
        this.pageSize = 10;
        this.displayedColumns = ['id', 'recent', 'name', 'description', 'technicalOwners'];
        this.page = new EventEmitter();
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.facilities);
        this.setDataSource();
        this.dataSource.filter = this.filterValue;
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.filterPredicate = ((data, filter) => {
                const lowerCaseFilter = filter.trim().toLowerCase();
                if (data.name.trim().toLowerCase().indexOf(lowerCaseFilter) !== -1) {
                    return true;
                }
                if (data.description !== null && data.description.trim().toLowerCase().indexOf(lowerCaseFilter) !== -1) {
                    return true;
                }
                if (data.id.toString(10).startsWith(filter)) {
                    return true;
                }
                if (this.displayedColumns.indexOf('technicalOwners') !== -1) {
                    return parseTechnicalOwnersNames(data.facilityOwners).toLowerCase().indexOf(lowerCaseFilter) !== -1;
                }
                return false;
            });
        }
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], FacilitySelectTableComponent.prototype, "facilities", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], FacilitySelectTableComponent.prototype, "recentIds", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], FacilitySelectTableComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], FacilitySelectTableComponent.prototype, "pageSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], FacilitySelectTableComponent.prototype, "displayedColumns", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], FacilitySelectTableComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], FacilitySelectTableComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], FacilitySelectTableComponent.prototype, "paginator", void 0);
FacilitySelectTableComponent = __decorate([
    Component({
        selector: 'app-facility-select-table',
        templateUrl: './facility-select-table.component.html',
        styleUrls: ['./facility-select-table.component.scss']
    }),
    __metadata("design:paramtypes", [])
], FacilitySelectTableComponent);
export { FacilitySelectTableComponent };
//# sourceMappingURL=facility-select-table.component.js.map