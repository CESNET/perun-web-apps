import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteAttributeDialogComponent } from '../../../../../shared/components/dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { CreateAttributeDialogComponent } from '../../../../../shared/components/dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import { TABLE_ATTRIBUTES_SETTINGS, TableConfigService } from '@perun-web-apps/config/table-config';
let ResourceSettingsAttributesComponent = class ResourceSettingsAttributesComponent {
    constructor(attributesManager, route, dialog, notificator, tableConfigService, translate) {
        this.attributesManager = attributesManager;
        this.route = route;
        this.dialog = dialog;
        this.notificator = notificator;
        this.tableConfigService = tableConfigService;
        this.translate = translate;
        this.attributes = [];
        this.selection = new SelectionModel(true, []);
        this.filterValue = '';
        this.tableId = TABLE_ATTRIBUTES_SETTINGS;
        this.translate.get('RESOURCE_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
        this.translate.get('RESOURCE_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_DELETE').subscribe(value => this.deleteSuccessMessage = value);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(params => {
            this.resourceId = params['resourceId'];
            this.refreshTable();
        });
    }
    onDelete() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            entityId: this.resourceId,
            entity: 'resource',
            attributes: this.selection.selected
        };
        const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    onSave() {
        // have to use this to update attribute with map in it, before saving it
        this.list.updateMapAttributes();
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            entityId: this.resourceId,
            entity: 'resource',
            attributes: this.selection.selected
        };
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    onCreate() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.resourceId,
            entity: 'resource',
            notEmptyAttributes: this.attributes,
            style: 'resource-theme'
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'saved') {
                this.refreshTable();
            }
        });
    }
    refreshTable() {
        this.loading = true;
        this.attributesManager.getResourceAttributes(this.resourceId).subscribe(attributes => {
            this.attributes = attributes;
            this.selection.clear();
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
};
__decorate([
    HostBinding('class.router-component'),
    __metadata("design:type", Object)
], ResourceSettingsAttributesComponent.prototype, "true", void 0);
__decorate([
    ViewChild('list'),
    __metadata("design:type", AttributesListComponent)
], ResourceSettingsAttributesComponent.prototype, "list", void 0);
ResourceSettingsAttributesComponent = __decorate([
    Component({
        selector: 'app-resource-settings-attributes',
        templateUrl: './resource-settings-attributes.component.html',
        styleUrls: ['./resource-settings-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [AttributesManagerService,
        ActivatedRoute,
        MatDialog,
        NotificatorService,
        TableConfigService,
        TranslateService])
], ResourceSettingsAttributesComponent);
export { ResourceSettingsAttributesComponent };
//# sourceMappingURL=resource-settings-attributes.component.js.map