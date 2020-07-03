import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ResourcesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let ResourcesTagsListComponent = class ResourcesTagsListComponent {
    constructor(resourceManager, notificator, translator) {
        this.resourceManager = resourceManager;
        this.notificator = notificator;
        this.translator = translator;
        this.resourceTags = [];
        this.selection = new SelectionModel(true, []);
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.displayedColumns = ['select', 'id', 'name', 'edit'];
        this.isChanging = new SelectionModel(true, []);
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.resourceTags);
        this.setDataSource();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
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
    save(tag) {
        this.resourceManager.updateResourceTag({ resourceTag: tag }).subscribe(() => {
            this.translator.get('SHARED.COMPONENTS.RESOURCES_TAGS_LIST.EDIT_SUCCESS').subscribe(text => {
                this.notificator.showSuccess(text);
            });
            this.isChanging.deselect(tag);
        });
    }
    edit(row) {
        this.isChanging.select(row);
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.page.emit(event);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Array)
], ResourcesTagsListComponent.prototype, "resourceTags", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ResourcesTagsListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ResourcesTagsListComponent.prototype, "selection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ResourcesTagsListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ResourcesTagsListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatSort, { static: true }),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], ResourcesTagsListComponent.prototype, "matSort", null);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], ResourcesTagsListComponent.prototype, "paginator", void 0);
ResourcesTagsListComponent = __decorate([
    Component({
        selector: 'app-resources-tags-list',
        templateUrl: './resources-tags-list.component.html',
        styleUrls: ['./resources-tags-list.component.scss']
    }),
    __metadata("design:paramtypes", [ResourcesManagerService,
        NotificatorService,
        TranslateService])
], ResourcesTagsListComponent);
export { ResourcesTagsListComponent };
//# sourceMappingURL=resources-tags-list.component.js.map