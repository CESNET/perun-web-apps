import { __decorate, __metadata } from "tslib";
import { Component, HostBinding } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
// tslint:disable-next-line:max-line-length
import { DeleteAttributeDefinitionDialogComponent } from '../../../../shared/components/dialogs/delete-attribute-definition-dialog/delete-attribute-definition-dialog.component';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line:max-line-length
import { CreateAttributeDefinitionDialogComponent } from '../../../../shared/components/dialogs/create-attribute-definition-dialog/create-attribute-definition-dialog.component';
import { filterCoreAttributesDefinitions, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TABLE_ADMIN_ATTRIBUTES, TableConfigService } from '@perun-web-apps/config/table-config';
import { AttributeImportDialogComponent } from '../../../../shared/components/dialogs/attribute-import-dialog/attribute-import-dialog.component';
let AdminAttributesComponent = class AdminAttributesComponent {
    constructor(dialog, attributesManager, tableConfigService) {
        this.dialog = dialog;
        this.attributesManager = attributesManager;
        this.tableConfigService = tableConfigService;
        this.attrDefinitions = [];
        this.selected = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_ADMIN_ATTRIBUTES;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.refreshTable();
    }
    onCreate() {
        const config = getDefaultDialogConfig();
        config.width = '500px';
        const dialogRef = this.dialog.open(CreateAttributeDefinitionDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    onDelete() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            attributes: this.selected.selected
        };
        const dialogRef = this.dialog.open(DeleteAttributeDefinitionDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
                this.selected.clear();
            }
        });
    }
    refreshTable() {
        this.loading = true;
        this.attributesManager.getAllAttributeDefinitions().subscribe(attrDefs => {
            this.attrDefinitions = filterCoreAttributesDefinitions(attrDefs);
            this.loading = false;
        });
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
    onImport() {
        const config = getDefaultDialogConfig();
        config.width = '700px';
        const dialogRef = this.dialog.open(AttributeImportDialogComponent, config);
        dialogRef.afterClosed().subscribe(value => {
            if (value === true) {
                this.refreshTable();
            }
        });
    }
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], AdminAttributesComponent.prototype, "true", void 0);
AdminAttributesComponent = __decorate([
    Component({
        selector: 'app-admin-attributes',
        templateUrl: './admin-attributes.component.html',
        styleUrls: ['./admin-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialog,
        AttributesManagerService,
        TableConfigService])
], AdminAttributesComponent);
export { AdminAttributesComponent };
//# sourceMappingURL=admin-attributes.component.js.map