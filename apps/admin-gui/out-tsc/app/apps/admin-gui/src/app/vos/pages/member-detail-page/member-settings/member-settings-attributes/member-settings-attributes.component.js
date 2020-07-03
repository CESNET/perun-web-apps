import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateAttributeDialogComponent } from '../../../../../shared/components/dialogs/create-attribute-dialog/create-attribute-dialog.component';
import { DeleteAttributeDialogComponent } from '../../../../../shared/components/dialogs/delete-attribute-dialog/delete-attribute-dialog.component';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { EditAttributeDialogComponent } from '@perun-web-apps/perun/components';
import { TABLE_ATTRIBUTES_SETTINGS, TableConfigService } from '@perun-web-apps/config/table-config';
let MemberSettingsAttributesComponent = class MemberSettingsAttributesComponent {
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
        this.translate.get('MEMBER_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
        this.translate.get('MEMBER_DETAIL.SETTINGS.ATTRIBUTES.SUCCESS_DELETE').subscribe(value => this.deleteSuccessMessage = value);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.route.parent.parent.params.subscribe(params => {
            this.memberId = params['memberId'];
            this.refreshTable();
        });
    }
    onCreate() {
        const config = getDefaultDialogConfig();
        config.width = '1050px';
        config.data = {
            entityId: this.memberId,
            entity: 'member',
            notEmptyAttributes: this.attributes,
            style: 'member-theme'
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
            entityId: this.memberId,
            entity: 'member',
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
            entityId: this.memberId,
            entity: 'member',
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
        this.loading = true;
        this.attributesManager.getMemberAttributes(this.memberId).subscribe(attributes => {
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
], MemberSettingsAttributesComponent.prototype, "true", void 0);
__decorate([
    ViewChild('list'),
    __metadata("design:type", AttributesListComponent)
], MemberSettingsAttributesComponent.prototype, "list", void 0);
MemberSettingsAttributesComponent = __decorate([
    Component({
        selector: 'app-member-settings-attributes',
        templateUrl: './member-settings-attributes.component.html',
        styleUrls: ['./member-settings-attributes.component.scss']
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        AttributesManagerService,
        NotificatorService,
        MatDialog,
        TranslateService,
        TableConfigService])
], MemberSettingsAttributesComponent);
export { MemberSettingsAttributesComponent };
//# sourceMappingURL=member-settings-attributes.component.js.map