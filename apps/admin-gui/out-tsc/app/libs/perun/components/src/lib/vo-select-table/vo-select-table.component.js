import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let VoSelectTableComponent = class VoSelectTableComponent {
    constructor() {
        this.vos = [];
        this.pageSize = 10;
        this.disableRouting = false;
        this.page = new EventEmitter();
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.vos);
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
        }
    }
    checkboxLabel(row) {
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], VoSelectTableComponent.prototype, "vos", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], VoSelectTableComponent.prototype, "recentIds", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], VoSelectTableComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", SelectionModel)
], VoSelectTableComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], VoSelectTableComponent.prototype, "displayedColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], VoSelectTableComponent.prototype, "pageSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], VoSelectTableComponent.prototype, "disableRouting", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], VoSelectTableComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], VoSelectTableComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], VoSelectTableComponent.prototype, "paginator", void 0);
VoSelectTableComponent = __decorate([
    Component({
        selector: 'perun-web-apps-vo-select-table',
        templateUrl: './vo-select-table.component.html',
        styleUrls: ['./vo-select-table.component.scss']
    }),
    __metadata("design:paramtypes", [])
], VoSelectTableComponent);
export { VoSelectTableComponent };
//# sourceMappingURL=vo-select-table.component.js.map