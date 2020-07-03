import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { ResourcesManagerService, VosManagerService } from '@perun-web-apps/perun/openapi';
import { RemoveResourceDialogComponent } from '../../../../../shared/components/dialogs/remove-resource-dialog/remove-resource-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TABLE_VO_RESOURCES_LIST, TableConfigService } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
let VoResourcesPreviewComponent = class VoResourcesPreviewComponent {
    constructor(resourcesManager, voService, route, tableConfigService, dialog) {
        this.resourcesManager = resourcesManager;
        this.voService = voService;
        this.route = route;
        this.tableConfigService = tableConfigService;
        this.dialog = dialog;
        this.resources = [];
        this.selected = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_VO_RESOURCES_LIST;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(parentParams => {
            const voId = parentParams['voId'];
            this.voService.getVoById(voId).subscribe(vo => {
                this.vo = vo;
                this.refreshTable();
            });
        });
    }
    refreshTable() {
        this.loading = true;
        this.resourcesManager.getRichResources(this.vo.id).subscribe(resources => {
            this.resources = resources;
            this.selected.clear();
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    deleteSelectedResources() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = { theme: 'vo-theme', resources: this.selected.selected };
        const dialogRef = this.dialog.open(RemoveResourceDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
VoResourcesPreviewComponent.id = 'VoResourcesPreviewComponent';
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], VoResourcesPreviewComponent.prototype, "true", void 0);
VoResourcesPreviewComponent = __decorate([
    Component({
        selector: 'app-vo-resources-preview',
        templateUrl: './vo-resources-preview.component.html',
        styleUrls: ['./vo-resources-preview.component.scss']
    }),
    __metadata("design:paramtypes", [ResourcesManagerService,
        VosManagerService,
        ActivatedRoute,
        TableConfigService,
        MatDialog])
], VoResourcesPreviewComponent);
export { VoResourcesPreviewComponent };
//# sourceMappingURL=vo-resources-preview.component.js.map