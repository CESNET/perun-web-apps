import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AttributeValueComponent } from './attribute-value/attribute-value.component';
import { IsVirtualAttributePipe } from '@perun-web-apps/perun/pipes';
import { filterCoreAttributes, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let AttributesListComponent = class AttributesListComponent {
    constructor() {
        this.attributes = [];
        this.selection = new SelectionModel(true, []);
        this.displayedColumns = ['select', 'id', 'displayName', 'value', 'description'];
        // set this true when used in dialog window
        this.inDialog = false;
        this.filterValue = '';
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.readonly = false;
        this.hiddenColumns = [];
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
        this.isVirtualPipe = new IsVirtualAttributePipe();
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(filterCoreAttributes(this.attributes));
        this.setDataSource();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    setDataSource() {
        this.displayedColumns = this.displayedColumns.filter(x => !this.hiddenColumns.includes(x));
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.filter = this.filterValue;
        }
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.filter(attribute => !this.isVirtualPipe.transform(attribute)).length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => {
                if (!this.isVirtualPipe.transform(row))
                    this.selection.select(row);
            });
    }
    checkboxLabel(row) {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }
    updateMapAttributes() {
        for (const item of this.items.toArray()) {
            if (item.attribute.type === 'java.util.LinkedHashMap') {
                item.updateMapAttribute();
            }
        }
    }
    onValueChange(attribute) {
        if (!this.isVirtualPipe.transform(attribute)) {
            this.selection.select(attribute);
        }
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], AttributesListComponent.prototype, "matSort", null);
__decorate([
    ViewChildren(AttributeValueComponent),
    __metadata("design:type", QueryList)
], AttributesListComponent.prototype, "items", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], AttributesListComponent.prototype, "paginator", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], AttributesListComponent.prototype, "attributes", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributesListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributesListComponent.prototype, "inDialog", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributesListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributesListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AttributesListComponent.prototype, "page", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributesListComponent.prototype, "readonly", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], AttributesListComponent.prototype, "hiddenColumns", void 0);
AttributesListComponent = __decorate([
    Component({
        selector: 'perun-web-apps-attributes-list',
        templateUrl: './attributes-list.component.html',
        styleUrls: ['./attributes-list.component.scss']
    }),
    __metadata("design:paramtypes", [])
], AttributesListComponent);
export { AttributesListComponent };
//# sourceMappingURL=attributes-list.component.js.map