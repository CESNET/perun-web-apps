import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let ApplicationsListComponent = class ApplicationsListComponent {
    constructor(router) {
        this.router = router;
        this.applications = [];
        this.displayedColumns = [];
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.exporting = false;
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    set matSort(ms) {
        this.sort = ms;
        this.setDataSource();
    }
    ngAfterViewInit() {
        this.setDataSource();
    }
    ngOnChanges(changes) {
        this.dataSource = new MatTableDataSource(this.applications);
        this.setDataSource();
        this.dataSource.filter = this.filterValue;
    }
    setDataSource() {
        if (!!this.dataSource) {
            this.dataSource.sort = this.sort;
            this.dataSource.sortingDataAccessor = (item, property) => {
                switch (property) {
                    case 'user': {
                        if (item.user) {
                            return item.user.firstName + '' + item.user.lastName;
                        }
                        return item.createdBy.slice(item.createdBy.lastIndexOf('=') + 1, item.createdBy.length);
                    }
                    case 'group': {
                        if (item.group) {
                            return item.group.name;
                        }
                        return '-';
                    }
                    case 'modifiedBy': {
                        const index = item.modifiedBy.lastIndexOf('/CN=');
                        if (index !== -1) {
                            const string = item.modifiedBy.slice(index + 4, item.modifiedBy.length).replace('/unstructuredName=', ' ').toLowerCase();
                            if (string.lastIndexOf('\\') !== -1) {
                                return item.modifiedBy.slice(item.modifiedBy.lastIndexOf('=') + 1, item.modifiedBy.length);
                            }
                            return string;
                        }
                        return item.modifiedBy.toLowerCase();
                    }
                    default: return item[property];
                }
            };
            this.dataSource.paginator = this.paginator;
        }
    }
    getFriendlyName(modifiedBy) {
        const index = modifiedBy.lastIndexOf('/CN=');
        if (index !== -1) {
            const string = modifiedBy.slice(index + 4, modifiedBy.length).replace('/unstructuredName=', ' ');
            if (string.lastIndexOf('\\') !== -1) {
                return modifiedBy.slice(modifiedBy.lastIndexOf('=') + 1, modifiedBy.length);
            }
            return string;
        }
        return modifiedBy;
    }
    selectApplication(application) {
        if (this.group) {
            this.router.navigate(['/organizations', application.vo.id, 'groups', this.group.id, 'applications', application.id]);
        }
        else {
            this.router.navigate(['/organizations', application.vo.id, 'applications', application.id]);
        }
    }
    pageChanged(event) {
        this.page.emit(event);
    }
};
__decorate([
    ViewChild(MatSort),
    __metadata("design:type", MatSort),
    __metadata("design:paramtypes", [MatSort])
], ApplicationsListComponent.prototype, "matSort", null);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ApplicationsListComponent.prototype, "applications", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ApplicationsListComponent.prototype, "group", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], ApplicationsListComponent.prototype, "displayedColumns", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ApplicationsListComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ApplicationsListComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ApplicationsListComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], ApplicationsListComponent.prototype, "paginator", void 0);
ApplicationsListComponent = __decorate([
    Component({
        selector: 'app-applications-list',
        templateUrl: './applications-list.component.html',
        styleUrls: ['./applications-list.component.scss']
    }),
    __metadata("design:paramtypes", [Router])
], ApplicationsListComponent);
export { ApplicationsListComponent };
//# sourceMappingURL=applications-list.component.js.map