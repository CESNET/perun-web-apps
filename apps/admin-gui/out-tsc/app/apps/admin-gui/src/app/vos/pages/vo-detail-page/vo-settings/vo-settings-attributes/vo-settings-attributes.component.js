import { __decorate, __metadata } from "tslib";
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteAttributeDialogComponent } from '../../../../../shared/components/dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateAttributeDialogComponent } from '../../../../../shared/components/dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { Component, HostBinding, ViewChild } from '@angular/core';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import { TABLE_ATTRIBUTES_SETTINGS, TableConfigService } from '@perun-web-apps/config/table-config';
let VoSettingsAttributesComponent = class VoSettingsAttributesComponent {
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
        this.translate.get('VO_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
        this.translate.get('VO_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_DELETE').subscribe(value => this.deleteSuccessMessage = value);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(parentParams => {
            this.voId = parentParams['voId'];
            this.refreshTable();
        });
    }
    onDelete() {
        const config = getDefaultDialogConfig();
        config.width = '450px';
        config.data = {
            entityId: this.voId,
            entity: 'vo',
            attributes: this.selection.selected
        };
        const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, config);
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
            entityId: this.voId,
            entity: 'vo',
            notEmptyAttributes: this.attributes,
            style: 'vo-theme'
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'saved') {
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
            entityId: this.voId,
            entity: 'vo',
            attributes: this.selection.selected
        };
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshTable();
            }
        });
    }
    refreshTable() {
        this.loading = true;
        this.attributesManager.getVoAttributes(this.voId).subscribe(attributes => {
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
], VoSettingsAttributesComponent.prototype, "true", void 0);
__decorate([
    ViewChild('list'),
    __metadata("design:type", AttributesListComponent)
], VoSettingsAttributesComponent.prototype, "list", void 0);
VoSettingsAttributesComponent = __decorate([
    Component({
        selector: 'app-vo-settings-attributes',
        templateUrl: './vo-settings-attributes.component.html',
        styleUrls: ['./vo-settings-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [AttributesManagerService,
        ActivatedRoute,
        MatDialog,
        NotificatorService,
        TableConfigService,
        TranslateService])
], VoSettingsAttributesComponent);
export { VoSettingsAttributesComponent };
//# sourceMappingURL=vo-settings-attributes.component.js.map