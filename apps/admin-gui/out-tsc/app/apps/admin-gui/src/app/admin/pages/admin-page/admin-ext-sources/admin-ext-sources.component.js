import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ExtSourcesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ADMIN_EXTSOURCES, TableConfigService } from '@perun-web-apps/config/table-config';
let AdminExtSourcesComponent = class AdminExtSourcesComponent {
    constructor(extSourceService, notificator, tableConfigService, translate) {
        this.extSourceService = extSourceService;
        this.notificator = notificator;
        this.tableConfigService = tableConfigService;
        this.translate = translate;
        this.extSources = [];
        this.filterValue = '';
        this.loading = false;
        this.tableId = TABLE_ADMIN_EXTSOURCES;
        this.translate.get('ADMIN.EXT_SOURCES.LOAD_SUCCESS').subscribe(result => this.loadSuccess = result);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.refreshTable();
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    onLoad() {
        this.extSourceService.loadExtSourcesDefinitions().subscribe(() => {
            this.notificator.showSuccess(this.loadSuccess);
            this.refreshTable();
        });
    }
    refreshTable() {
        this.loading = true;
        this.extSourceService.getExtSources().subscribe(result => {
            this.extSources = result;
            this.loading = false;
        });
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
AdminExtSourcesComponent = __decorate([
    Component({
        selector: 'app-admin-ext-sources',
        templateUrl: './admin-ext-sources.component.html',
        styleUrls: ['./admin-ext-sources.component.scss']
    }),
    __metadata("design:paramtypes", [ExtSourcesManagerService,
        NotificatorService,
        TableConfigService,
        TranslateService])
], AdminExtSourcesComponent);
export { AdminExtSourcesComponent };
//# sourceMappingURL=admin-ext-sources.component.js.map