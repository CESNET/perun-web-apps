import { __decorate, __metadata, __param } from "tslib";
import { Component, EventEmitter, Inject, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AttributeValueComponent } from '@perun-web-apps/perun/components';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let EntitylessAttributeKeysListComponent = class EntitylessAttributeKeysListComponent {
    constructor(dialogRef, data, notificator, translate, attributesManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.attributesManager = attributesManager;
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.switchView = new EventEmitter();
        this.records = [];
        this.displayedColumns = ['select', 'key', 'value'];
        this.dataSource = new MatTableDataSource();
        this.selection = new SelectionModel(true, []);
        this.isAddButtonDisabled = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.ngOnInit();
    }
    ngOnInit() {
        this.attDef = this.data.attDef;
        this.attributesManager.getEntitylessKeys(this.attDef.id).subscribe(keys => {
            this.attributesManager.getEntitylessAttributesByName(`${this.attDef.namespace}:${this.attDef.friendlyName}`).subscribe(att => {
                let i = 0;
                this.records = [];
                for (const key of keys) {
                    this.records.push([key, att[i]]);
                    i++;
                }
                this.dataSource = new MatTableDataSource(this.records);
                this.setDataSource();
            });
        });
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }
    }
    onSave() {
        this.updateMapAttributes();
        for (const rec of this.selection.selected) {
            this.attributesManager.setEntitylessAttribute({ key: rec[0], attribute: rec[1] }).subscribe(() => {
                this.translate.get('SHARED.COMPONENTS.ENTITYLESS_ATTRIBUTES_LIST.SAVE_SUCCESS').subscribe(message => {
                    this.notificator.showSuccess(message);
                    this.ngOnInit();
                });
            });
        }
        this.selection.clear();
        this.isAddButtonDisabled = false;
    }
    onRemove() {
        for (const rec of this.selection.selected) {
            this.attributesManager.removeEntitylessAttribute(rec[0], rec[1].id).subscribe(() => {
                this.translate.get('SHARED.COMPONENTS.ENTITYLESS_ATTRIBUTES_LIST.REMOVE_SUCCESS').subscribe(message => {
                    this.notificator.showSuccess(message);
                    this.ngOnInit();
                });
            });
        }
        this.ngOnInit();
        this.selection.clear();
        this.isAddButtonDisabled = false;
    }
    onAdd() {
        const rec = ['', this.attDef];
        rec[1].value = undefined;
        this.records.unshift(rec);
        this.dataSource.data = this.records;
        this.setDataSource();
        this.selection.clear();
        this.selection.select(rec);
        this.isAddButtonDisabled = true;
    }
    onCancel() {
        this.dialogRef.close(false);
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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row[1].id + 1}`;
    }
    onValueChange(record) {
        this.selection.select(record);
    }
    updateMapAttributes() {
        for (const item of this.items.toArray()) {
            if (item.attribute.type === 'java.util.LinkedHashMap') {
                item.updateMapAttribute();
            }
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
], EntitylessAttributeKeysListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], EntitylessAttributeKeysListComponent.prototype, "paginator", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], EntitylessAttributeKeysListComponent.prototype, "attDef", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], EntitylessAttributeKeysListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], EntitylessAttributeKeysListComponent.prototype, "page", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], EntitylessAttributeKeysListComponent.prototype, "switchView", void 0);
__decorate([
    ViewChildren(AttributeValueComponent),
    __metadata("design:type", QueryList)
], EntitylessAttributeKeysListComponent.prototype, "items", void 0);
EntitylessAttributeKeysListComponent = __decorate([
    Component({
        selector: 'app-entityless-attribute-keys-list',
        templateUrl: './entityless-attribute-keys-list.component.html',
        styleUrls: ['./entityless-attribute-keys-list.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        AttributesManagerService])
], EntitylessAttributeKeysListComponent);
export { EntitylessAttributeKeysListComponent };
//# sourceMappingURL=entityless-attribute-keys-list.component.js.map