import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
let ApplicationListDetailsComponent = class ApplicationListDetailsComponent {
    constructor(router, registrarManager) {
        this.router = router;
        this.registrarManager = registrarManager;
        this.applications = [];
        this.pageSize = 10;
        this.page = new EventEmitter();
        this.displayedColumns = ['id', 'voId', 'voName', 'groupId', 'groupName', 'type',
            'state', 'extSourceName', 'extSourceType', 'extSourceLoa',
            'user', 'createdBy', 'createdAt', 'modifiedBy', 'modifiedAt', 'fedInfo'];
        this.loading = false;
        this.table = [];
        this.addedColumns = new Set();
        this.pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
    }
    ngOnChanges(changes) {
        this.loading = true;
        this.getApplicationsData(0);
    }
    getApplicationsData(index) {
        if (this.applications.length === index) {
            this.initialize();
            return;
        }
        const application = this.applications[index];
        const obj = {};
        obj['id'] = application.id;
        obj['vo'] = application.vo;
        obj['group'] = application.group;
        obj['type'] = application.type;
        obj['fedInfo'] = application.fedInfo;
        obj['state'] = application.state;
        obj['extSourceName'] = application.extSourceName;
        obj['extSourceType'] = application.extSourceType;
        obj['extSourceLoa'] = application.extSourceLoa;
        obj['user'] = application.user;
        obj['createdBy'] = application.createdBy;
        obj['createdAt'] = application.createdAt;
        obj['modifiedBy'] = application.modifiedBy;
        obj['modifiedAt'] = application.modifiedAt;
        this.registrarManager.getApplicationDataById(application.id).subscribe(data => {
            for (const item of data) {
                if (item.formItem.i18n['en'].label !== null && item.formItem.i18n['en'].label.length !== 0) {
                    obj[item.formItem.i18n['en'].label] = item.value;
                    this.addedColumns.add(item.formItem.i18n['en'].label);
                }
                else {
                    obj[item.shortname] = item.value;
                    this.addedColumns.add(item.shortname);
                }
            }
            this.table.push(obj);
            this.getApplicationsData(index + 1);
        });
    }
    initialize() {
        for (const val of this.addedColumns) {
            this.displayedColumns.push(val);
        }
        this.dataSource = new MatTableDataSource(this.table);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filter = this.filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
        this.loading = false;
    }
    getFriendlyName(modifiedBy) {
        const index = modifiedBy.lastIndexOf('/CN=');
        if (index !== -1) {
            const string = modifiedBy.slice(index + 4, modifiedBy.length)
                .replace('/unstructuredName=', ' ');
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
    Input(),
    __metadata("design:type", Array)
], ApplicationListDetailsComponent.prototype, "applications", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ApplicationListDetailsComponent.prototype, "group", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ApplicationListDetailsComponent.prototype, "filterValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ApplicationListDetailsComponent.prototype, "pageSize", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ApplicationListDetailsComponent.prototype, "page", void 0);
__decorate([
    ViewChild(MatPaginator),
    __metadata("design:type", MatPaginator)
], ApplicationListDetailsComponent.prototype, "paginator", void 0);
ApplicationListDetailsComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-application-list-details',
        templateUrl: './application-list-details.component.html',
        styleUrls: ['./application-list-details.component.scss']
    }),
    __metadata("design:paramtypes", [Router,
        RegistrarManagerService])
], ApplicationListDetailsComponent);
export { ApplicationListDetailsComponent };
//# sourceMappingURL=application-list-details.component.js.map