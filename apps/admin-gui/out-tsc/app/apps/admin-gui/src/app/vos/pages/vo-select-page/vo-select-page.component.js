import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig, getRecentlyVisited, getRecentlyVisitedIds } from '@perun-web-apps/perun/utils';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { RemoveVoDialogComponent } from '../../../shared/components/dialogs/remove-vo-dialog/remove-vo-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateVoDialogComponent } from '../../../shared/components/dialogs/create-vo-dialog/create-vo-dialog.component';
import { TABLE_VO_SELECT, TableConfigService } from '@perun-web-apps/config/table-config';
let VoSelectPageComponent = class VoSelectPageComponent {
    constructor(sideMenuService, voService, authzService, tableConfigService, dialog) {
        this.sideMenuService = sideMenuService;
        this.voService = voService;
        this.authzService = authzService;
        this.tableConfigService = tableConfigService;
        this.dialog = dialog;
        this.vos = [];
        this.recentIds = [];
        this.filterValue = '';
        this.tableId = TABLE_VO_SELECT;
    }
    ngOnInit() {
        this.loading = true;
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.selection = new SelectionModel(false, []);
        this.isVoAdmin = this.authzService.isVoAdmin();
        this.displayedColumns = this.isVoAdmin ? ['checkbox', 'id', 'recent', 'shortName', 'name'] : ['id', 'recent', 'shortName', 'name'];
        this.sideMenuService.setAccessMenuItems([]);
        this.refreshTable();
    }
    refreshTable() {
        this.loading = true;
        this.selection.clear();
        this.voService.getMyVos().subscribe(vos => {
            this.vos = getRecentlyVisited('vos', vos);
            this.recentIds = getRecentlyVisitedIds('vos');
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    onCreateVo() {
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = { theme: 'vo-theme' };
        const dialogRef = this.dialog.open(CreateVoDialogComponent, config);
        dialogRef.afterClosed().subscribe(isVoCreated => {
            if (isVoCreated) {
                this.refreshTable();
            }
        });
    }
    onRemoveVo() {
        const config = getDefaultDialogConfig();
        config.width = '600px';
        config.data = { theme: 'vo-theme', vos: this.selection.selected };
        const dialogRef = this.dialog.open(RemoveVoDialogComponent, config);
        dialogRef.afterClosed().subscribe(isVoRemoved => {
            if (isVoRemoved) {
                this.refreshTable();
            }
        });
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
VoSelectPageComponent = __decorate([
    Component({
        selector: 'app-vo-select-page',
        templateUrl: './vo-select-page.component.html',
        styleUrls: ['./vo-select-page.component.scss']
    }),
    __metadata("design:paramtypes", [SideMenuService,
        VosManagerService,
        GuiAuthResolver,
        TableConfigService,
        MatDialog])
], VoSelectPageComponent);
export { VoSelectPageComponent };
//# sourceMappingURL=vo-select-page.component.js.map