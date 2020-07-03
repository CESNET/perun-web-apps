import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAttributeDialogComponent } from '../../../../../shared/components/dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { DeleteAttributeDialogComponent } from '../../../../../shared/components/dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import { TABLE_ATTRIBUTES_SETTINGS, TableConfigService } from '@perun-web-apps/config/table-config';
let GroupSettingsAttributesComponent = class GroupSettingsAttributesComponent {
    constructor(route, attributesManager, notificator, dialog, translate, tableConfigService) {
        this.route = route;
        this.attributesManager = attributesManager;
        this.notificator = notificator;
        this.dialog = dialog;
        this.translate = translate;
        this.tableConfigService = tableConfigService;
        this.selection = new SelectionModel(true, []);
        this.attributes = [];
        this.filterValue = '';
        this.tableId = TABLE_ATTRIBUTES_SETTINGS;
        this.translate.get('GROUP_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
        this.translate.get('GROUP_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_DELETE').subscribe(value => this.deleteSuccessMessage = value);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(params => {
            this.groupId = params['groupId'];
            this.refreshTable();
        });
    }
    onCreate() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.groupId,
            entity: 'group',
            notEmptyAttributes: this.attributes,
            style: 'group-theme'
        };
        const dialogRef = this.dialog.open(CreateAttributeDialogComponent, config);
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
            entityId: this.groupId,
            entity: 'group',
            attributes: this.selection.selected
        };
        const dialogRef = this.dialog.open(EditAttributeDialogComponent, config);
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
            entityId: this.groupId,
            entity: 'group',
            attributes: this.selection.selected
        };
        const dialogRef = this.dialog.open(DeleteAttributeDialogComponent, config);
        dialogRef.afterClosed().subscribe(didConfirm => {
            if (didConfirm) {
                this.refreshTable();
            }
        });
    }
    refreshTable() {
        // TODO Does not apply filter on refresh.
        this.loading = true;
        this.attributesManager.getGroupAttributes(this.groupId).subscribe(attributes => {
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
], GroupSettingsAttributesComponent.prototype, "true", void 0);
__decorate([
    ViewChild('list'),
    __metadata("design:type", AttributesListComponent)
], GroupSettingsAttributesComponent.prototype, "list", void 0);
GroupSettingsAttributesComponent = __decorate([
    Component({
        selector: 'app-group-settings-attributes',
        templateUrl: './group-settings-attributes.component.html',
        styleUrls: ['./group-settings-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        AttributesManagerService,
        NotificatorService,
        MatDialog,
        TranslateService,
        TableConfigService])
], GroupSettingsAttributesComponent);
export { GroupSettingsAttributesComponent };
//# sourceMappingURL=group-settings-attributes.component.js.map