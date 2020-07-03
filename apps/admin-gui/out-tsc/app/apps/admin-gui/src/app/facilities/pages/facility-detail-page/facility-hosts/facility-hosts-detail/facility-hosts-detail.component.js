import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AttributesManagerService, FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { TABLE_ATTRIBUTES_SETTINGS, TableConfigService } from '@perun-web-apps/config/table-config';
import { ActivatedRoute } from '@angular/router';
import { filterCoreAttributes, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AttributesListComponent, EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import { DeleteAttributeDialogComponent } from '../../../../../shared/components/dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { CreateAttributeDialogComponent } from '../../../../../shared/components/dialogs/create-attribute-dialog/create-attribute-dialog.component';
let FacilityHostsDetailComponent = class FacilityHostsDetailComponent {
    constructor(dialog, attributesManager, facilityManager, tableConfigService, route) {
        this.dialog = dialog;
        this.attributesManager = attributesManager;
        this.facilityManager = facilityManager;
        this.tableConfigService = tableConfigService;
        this.route = route;
        this.attributes = [];
        this.selected = new SelectionModel(true, []);
        this.tableId = TABLE_ATTRIBUTES_SETTINGS;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.params.subscribe(params => {
            this.hostId = params['hostId'];
            this.facilityManager.getHostById(this.hostId).subscribe(host => {
                this.host = host;
            });
            this.refreshTable();
        });
    }
    refreshTable() {
        this.loading = true;
        this.attributesManager.getHostAttributes(this.hostId).subscribe(attributes => {
            this.attributes = filterCoreAttributes(attributes);
            this.selected.clear();
            this.loading = false;
        });
    }
    onSave() {
        this.list.updateMapAttributes();
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            entityId: this.hostId,
            entity: 'host',
            attributes: this.selected.selected
        };
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    addAttribute() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.hostId,
            entity: 'host',
            notEmptyAttributes: this.attributes,
            style: 'facility-theme'
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'saved') {
                this.refreshTable();
            }
        });
    }
    removeAttribute() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            entityId: this.hostId,
            entity: 'host',
            attributes: this.selected.selected
        };
        const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, config);
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
__decorate([
    ViewChild('list'),
    __metadata("design:type", AttributesListComponent)
], FacilityHostsDetailComponent.prototype, "list", void 0);
FacilityHostsDetailComponent = __decorate([
    Component({
        selector: 'app-facility-hosts-detail',
        templateUrl: './facility-hosts-detail.component.html',
        styleUrls: ['./facility-hosts-detail.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        AttributesManagerService,
        FacilitiesManagerService,
        TableConfigService,
        ActivatedRoute])
], FacilityHostsDetailComponent);
export { FacilityHostsDetailComponent };
//# sourceMappingURL=facility-hosts-detail.component.js.map