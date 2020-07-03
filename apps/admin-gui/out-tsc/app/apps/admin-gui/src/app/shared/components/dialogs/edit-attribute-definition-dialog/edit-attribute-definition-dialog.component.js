import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { ActionType, AttributesManagerService, ServicesManagerService } from '@perun-web-apps/perun/openapi';
import { slideInOutLeft, slideInOutRight, switchAnimation } from '@perun-web-apps/perun/animations';
import { Role } from '@perun-web-apps/perun/models';
import { TABLE_ENTITYLESS_ATTRIBUTE_KEYS, TableConfigService } from '@perun-web-apps/config/table-config';
import { MatTooltip } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
let EditAttributeDefinitionDialogComponent = class EditAttributeDefinitionDialogComponent {
    constructor(dialog, dialogRef, data, notificator, translate, clipboard, attributesManager, tableConfigService, serviceService) {
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.clipboard = clipboard;
        this.attributesManager = attributesManager;
        this.tableConfigService = tableConfigService;
        this.serviceService = serviceService;
        this.showKeys = false;
        this.activatedComponent = 'Edit';
        this.readSelf = false;
        this.readSelfPublic = false;
        this.readSelfVo = false;
        this.readVo = false;
        this.readGroup = false;
        this.readFacility = false;
        this.writeSelf = false;
        this.writeSelfPublic = false;
        this.writeSelfVo = false;
        this.writeVo = false;
        this.writeGroup = false;
        this.writeFacility = false;
        this.tableId = TABLE_ENTITYLESS_ATTRIBUTE_KEYS;
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        this.dialogRef.addPanelClass('mat-dialog-height-transition');
        this.attDef = this.data.attDef;
        this.serviceService.getServicesByAttributeDefinition(this.attDef.id).subscribe(response => {
            this.services = response;
        });
        this.attributesManager.getAttributeRights(this.attDef.id).subscribe(response => {
            this.fromRightsToCheckboxes(response);
        });
    }
    disableConfirmButton() {
        return (this.attDef.displayName === '' || this.attDef.description === '');
    }
    disableUniqueToggle() {
        return (this.attDef.namespace.includes('virt') || this.attDef.namespace.includes('core') || this.attDef.entity === 'entityless');
    }
    onSubmit() {
        this.attributesManager.updateAttributeDefinition({ attributeDefinition: this.attDef }).subscribe(attDef => {
            this.attDef = attDef;
            this.attributesManager.setAttributeRights({ rights: this.fromCheckboxesToRights() }).subscribe(() => {
                this.translate.get('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.SUCCESS').subscribe(successMessage => {
                    this.notificator.showSuccess(successMessage);
                    this.dialogRef.close(true);
                });
            });
        });
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    fromCheckboxesToRights() {
        const list = [];
        const rightsSELF = {};
        rightsSELF.attributeId = this.attDef.id;
        rightsSELF.role = Role.SELF;
        rightsSELF.rights = [];
        if (this.readSelf) {
            rightsSELF.rights.push('READ');
        }
        if (this.readSelfPublic) {
            rightsSELF.rights.push('READ_PUBLIC');
        }
        if (this.readSelfVo) {
            rightsSELF.rights.push('READ_VO');
        }
        if (this.writeSelf) {
            rightsSELF.rights.push('WRITE');
        }
        if (this.writeSelfPublic) {
            rightsSELF.rights.push('WRITE_PUBLIC');
        }
        if (this.writeSelfVo) {
            rightsSELF.rights.push('WRITE_VO');
        }
        list.push(rightsSELF);
        const rightsVO = {};
        rightsVO.attributeId = this.attDef.id;
        rightsVO.role = Role.VOADMIN;
        rightsVO.rights = [];
        if (this.readVo) {
            rightsVO.rights.push('READ');
        }
        if (this.writeVo) {
            rightsVO.rights.push('WRITE');
        }
        list.push(rightsVO);
        const rightsGROUP = {};
        rightsGROUP.attributeId = this.attDef.id;
        rightsGROUP.role = Role.GROUPADMIN;
        rightsGROUP.rights = [];
        if (this.readGroup) {
            rightsGROUP.rights.push(ActionType.READ);
        }
        if (this.writeGroup) {
            rightsGROUP.rights.push('WRITE');
        }
        list.push(rightsGROUP);
        const rightsFACILITY = {};
        rightsFACILITY.attributeId = this.attDef.id;
        rightsFACILITY.role = Role.FACILITYADMIN;
        rightsFACILITY.rights = [];
        if (this.readFacility) {
            rightsFACILITY.rights.push('READ');
        }
        if (this.writeFacility) {
            rightsFACILITY.rights.push('WRITE');
        }
        list.push(rightsFACILITY);
        return list;
    }
    fromRightsToCheckboxes(rights) {
        for (const right of rights) {
            switch (right.role) {
                case Role.SELF: {
                    if (right.rights.includes('READ')) {
                        this.readSelf = true;
                    }
                    if (right.rights.includes('READ_PUBLIC')) {
                        this.readSelfPublic = true;
                    }
                    if (right.rights.includes('READ_VO')) {
                        this.readSelfVo = true;
                    }
                    if (right.rights.includes('WRITE')) {
                        this.writeSelf = true;
                    }
                    if (right.rights.includes('WRITE_PUBLIC')) {
                        this.writeSelfPublic = true;
                    }
                    if (right.rights.includes('WRITE_VO')) {
                        this.writeSelfVo = true;
                    }
                    break;
                }
                case Role.GROUPADMIN: {
                    if (right.rights.includes('READ')) {
                        this.readGroup = true;
                    }
                    if (right.rights.includes('WRITE')) {
                        this.writeGroup = true;
                    }
                    break;
                }
                case Role.FACILITYADMIN: {
                    if (right.rights.includes('READ')) {
                        this.readFacility = true;
                    }
                    if (right.rights.includes('WRITE')) {
                        this.writeFacility = true;
                    }
                    break;
                }
                case Role.VOADMIN: {
                    if (right.rights.includes('READ')) {
                        this.readVo = true;
                    }
                    if (right.rights.includes('WRITE')) {
                        this.writeVo = true;
                    }
                    break;
                }
            }
        }
    }
    switchShowKeys() {
        this.showKeys = !this.showKeys;
        if (this.showKeys) {
            this.dialogRef.updateSize('800px');
            this.activatedComponent = 'Entityless';
        }
        else {
            this.dialogRef.updateSize('700px');
            this.activatedComponent = 'Edit';
        }
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
    onCopy() {
        const data = {
            attributeDefinition: this.attDef,
            attributeRights: this.fromCheckboxesToRights()
        };
        const success = this.clipboard.copy(JSON.stringify(data));
        if (success) {
            this.notificator.showSuccess(this.translate.instant('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.COPIED'));
        }
        else {
            this.notificator.showError(this.translate.instant('DIALOGS.EDIT_ATTRIBUTE_DEFINITION.COPY_FAILED'));
        }
    }
};
__decorate([
    ViewChild("copiedTooltip"),
    __metadata("design:type", MatTooltip)
], EditAttributeDefinitionDialogComponent.prototype, "copiedToolTip", void 0);
EditAttributeDefinitionDialogComponent = __decorate([
    Component({
        selector: 'app-edit-attribute-definition-dialog',
        templateUrl: './edit-attribute-definition-dialog.component.html',
        styleUrls: ['./edit-attribute-definition-dialog.component.scss'],
        animations: [switchAnimation, slideInOutLeft, slideInOutRight]
    }),
    __param(2, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialog,
        MatDialogRef, Object, NotificatorService,
        TranslateService,
        Clipboard,
        AttributesManagerService,
        TableConfigService,
        ServicesManagerService])
], EditAttributeDefinitionDialogComponent);
export { EditAttributeDefinitionDialogComponent };
//# sourceMappingURL=edit-attribute-definition-dialog.component.js.map