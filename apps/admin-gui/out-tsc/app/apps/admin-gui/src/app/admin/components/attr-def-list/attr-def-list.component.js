import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { EditAttributeDefinitionDialogComponent } from '../../../shared/components/dialogs/edit-attribute-definition-dialog/edit-attribute-definition-dialog.component';
import { getDefaultDialogConfig, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let AttrDefListComponent = class AttrDefListComponent {
    constructor(dialog) {
        this.dialog = dialog;
        this.selection = new SelectionModel(true, []);
        this.hideColumns = [];
        this.pageSize = 10;
        this.refreshEvent = new EventEmitter();
        this.page = new EventEmitter();
        this.exporting = false;
        this.displayedColumns = ['select', 'id', 'friendlyName', 'entity', 'namespace', 'type', 'unique'];
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.definitions);
        this.setDataSource();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.filter = this.filterValue;
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = (item, property) => {
                if (property === 'namespace') {
                    return item.namespace.substring(item.namespace.lastIndexOf(':') + 1, item.namespace.length);
                }
                else if (property === 'friendlyName') {
                    return item[property].toLowerCase();
                }
                else {
                    return item[property];
                }
            };
            this.dataSource.paginator = this.paginator;
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
    onRowClick(attDef) {
        const config = getDefaultDialogConfig();
        config.width = '700px';
        config.data = {
            attDef: attDef
        };
        const dialogRef = this.dialog.open(EditAttributeDefinitionDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selection.clear();
                this.refreshEvent.emit();
            }
        });
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], AttrDefListComponent.prototype, "definitions", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttrDefListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], AttrDefListComponent.prototype, "hideColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], AttrDefListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttrDefListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AttrDefListComponent.prototype, "refreshEvent", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], AttrDefListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], AttrDefListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], AttrDefListComponent.prototype, "paginator", void 0);
AttrDefListComponent = __decorate([
    Component({
        selector: 'app-attr-def-list',
        templateUrl: './attr-def-list.component.html',
        styleUrls: ['./attr-def-list.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog])
], AttrDefListComponent);
export { AttrDefListComponent };
//# sourceMappingURL=attr-def-list.component.js.map