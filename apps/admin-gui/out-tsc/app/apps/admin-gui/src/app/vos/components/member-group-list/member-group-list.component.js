import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let MemberGroupListComponent = class MemberGroupListComponent {
    constructor(route) {
        this.route = route;
        this.groups = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', 'name'];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.groups);
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
    ngOnInit() {
        this.route.parent.params.subscribe(parentParams => this.memberId = parentParams['memberId']);
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], MemberGroupListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], MemberGroupListComponent.prototype, "paginator", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MemberGroupListComponent.prototype, "groups", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], MemberGroupListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberGroupListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberGroupListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MemberGroupListComponent.prototype, "page", void 0);
MemberGroupListComponent = __decorate([
    Component({
        selector: 'app-member-group-list',
        templateUrl: './member-group-list.component.html',
        styleUrls: ['./member-group-list.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute])
], MemberGroupListComponent);
export { MemberGroupListComponent };
//# sourceMappingURL=member-group-list.component.js.map