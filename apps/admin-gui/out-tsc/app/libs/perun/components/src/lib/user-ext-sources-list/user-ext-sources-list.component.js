import { __decorate, __metadata } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
let UserExtSourcesListComponent = class UserExtSourcesListComponent {
    constructor() {
        this.selection = new SelectionModel();
        this.filterValue = '';
        this.hideColumns = [];
        this.pageSize = 5;
        this.displayedColumns = ['select', 'id', 'mail', 'extSourceName', 'login', 'loa', 'lastAccess'];
        this.exporting = false;
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
        this.dataSource = new MatTableDataSource(this.userExtSources);
        this.setDataSource();
    }
    setDataSource() {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.filter = this.filterValue;
        }
    }
    checkboxLabel(row) {
        return `${this.selection.isSelected(row.userExtSource) ? 'deselect' : 'select'} row ${row.userExtSource.id + 1}`;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], UserExtSourcesListComponent.prototype, "userExtSources", void 0);
__decorate([
    Input(),
    __metadata("design:type", SelectionModel)
], UserExtSourcesListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], UserExtSourcesListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], UserExtSourcesListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], UserExtSourcesListComponent.prototype, "pageSize", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], UserExtSourcesListComponent.prototype, "extSourceNameHeader", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], UserExtSourcesListComponent.prototype, "loginHeader", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], UserExtSourcesListComponent.prototype, "paginator", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], UserExtSourcesListComponent.prototype, "matSort", null);
UserExtSourcesListComponent = __decorate([
    Component({
        selector: 'perun-web-apps-user-ext-sources-list',
        templateUrl: './user-ext-sources-list.component.html',
        styleUrls: ['./user-ext-sources-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], UserExtSourcesListComponent);
export { UserExtSourcesListComponent };
//# sourceMappingURL=user-ext-sources-list.component.js.map