import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AttributesListComponent } from '@perun-web-apps/perun/components';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { TableConfigService, TABLE_ATTRIBUTES_SETTINGS } from '@perun-web-apps/config/table-config';
let CreateAttributeDialogComponent = class CreateAttributeDialogComponent {
    constructor(dialogRef, data, attributesManager, notificator, tableConfigService, translate) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.attributesManager = attributesManager;
        this.notificator = notificator;
        this.tableConfigService = tableConfigService;
        this.translate = translate;
        this.selected = new SelectionModel(true, []);
        this.showError = false;
        this.filterValue = '';
        this.tableId = TABLE_ATTRIBUTES_SETTINGS;
        this.translate.get('DIALOGS.CREATE_ATTRIBUTE.SUCCESS_SAVE').subscribe(value => this.saveSuccessMessage = value);
    }
    ngOnInit() {
        this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
        const unWanted = new Array();
        this.data.notEmptyAttributes.forEach(attribute => {
            unWanted.push(attribute.id);
        });
        let memberId;
        let userId;
        let voId;
        let groupId;
        let resourceId;
        let facilityId;
        let hostId;
        let uesId;
        switch (this.data.entity) {
            case 'member':
                memberId = this.data.entityId;
                break;
            case 'user':
                userId = this.data.entityId;
                break;
            case 'vo':
                voId = this.data.entityId;
                break;
            case 'group':
                groupId = this.data.entityId;
                break;
            case 'resource':
                resourceId = this.data.entityId;
                break;
            case 'facility':
                facilityId = this.data.entityId;
                break;
            case 'host':
                hostId = this.data.entityId;
                break;
            case 'ues':
                uesId = this.data.entityId;
                break;
        }
        switch (this.data.secondEntity) {
            case 'member':
                memberId = this.data.secondEntityId;
                break;
            case 'user':
                userId = this.data.secondEntityId;
                break;
            case 'vo':
                voId = this.data.secondEntityId;
                break;
            case 'group':
                groupId = this.data.secondEntityId;
                break;
            case 'resource':
                resourceId = this.data.secondEntityId;
                break;
            case 'facility':
                facilityId = this.data.secondEntityId;
                break;
            case 'host':
                hostId = this.data.secondEntityId;
                break;
            case 'ues':
                uesId = this.data.secondEntityId;
                break;
        }
        this.loading = true;
        this.attributesManager.getAttributesDefinitionWithRights(memberId, userId, voId, groupId, resourceId, facilityId, hostId, uesId).subscribe(attributes => {
            this.attributes = attributes;
            this.attributes = this.attributes.filter(attribute => {
                return !unWanted.includes(attribute.id) && this.twoEntityValid(attribute);
            });
            this.loading = false;
        });
    }
    twoEntityValid(attribute) {
        if (!this.data.secondEntity) {
            return true;
        }
        return attribute.entity === `${this.data.entity}_${this.data.secondEntity}`;
    }
    onCancel() {
        this.dialogRef.close();
    }
    onSave() {
        this.list.updateMapAttributes();
        let containsEmpty = false;
        for (const attribute of this.selected.selected) {
            if (attribute.type === 'java.util.ArrayList' && attribute.value.length === 0) {
                containsEmpty = true;
            }
            if (attribute.value === undefined) {
                containsEmpty = true;
            }
        }
        if (containsEmpty) {
            this.showError = true;
            setTimeout(() => {
                this.showError = false;
            }, 5000);
            return;
        }
        switch (this.data.entity) {
            case 'facility':
                this.attributesManager.setFacilityAttributes({
                    facility: this.data.entityId,
                    attributes: this.selected.selected
                }).subscribe(() => {
                    this.handleSuccess();
                });
                break;
            case 'group':
                switch (this.data.secondEntity) {
                    case 'resource':
                        this.attributesManager.setGroupResourceAttributes({
                            group: this.data.entityId,
                            resource: this.data.secondEntityId,
                            attributes: this.selected.selected
                        }).subscribe(() => {
                            this.handleSuccess();
                        });
                        break;
                    default:
                        this.attributesManager.setGroupAttributes({
                            group: this.data.entityId,
                            attributes: this.selected.selected
                        }).subscribe(() => {
                            this.handleSuccess();
                        });
                }
                break;
            case 'member':
                switch (this.data.secondEntity) {
                    case 'resource':
                        this.attributesManager.setMemberResourceAttributes({
                            member: this.data.entityId,
                            resource: this.data.secondEntityId,
                            attributes: this.selected.selected
                        }).subscribe(() => {
                            this.handleSuccess();
                        });
                        break;
                    case 'group':
                        this.attributesManager.setMemberGroupAttributes({
                            member: this.data.entityId,
                            group: this.data.secondEntityId,
                            attributes: this.selected.selected
                        }).subscribe(() => {
                            this.handleSuccess();
                        });
                        break;
                    default:
                        this.attributesManager.setMemberAttributes({
                            member: this.data.entityId,
                            attributes: this.selected.selected
                        }).subscribe(() => {
                            this.handleSuccess();
                        });
                }
                break;
            case 'resource':
                this.attributesManager.setResourceAttributes({
                    resource: this.data.entityId,
                    attributes: this.selected.selected
                }).subscribe(() => {
                    this.handleSuccess();
                });
                break;
            case 'user':
                switch (this.data.secondEntity) {
                    case 'facility':
                        this.attributesManager.setUserFacilityAttributes({
                            user: this.data.entityId,
                            facility: this.data.secondEntityId,
                            attributes: this.selected.selected
                        }).subscribe(() => {
                            this.handleSuccess();
                        });
                        break;
                    default:
                        this.attributesManager.setUserAttributes({
                            user: this.data.entityId,
                            attributes: this.selected.selected
                        }).subscribe(() => {
                            this.handleSuccess();
                        });
                }
                break;
            case 'vo':
                this.attributesManager.setVoAttributes({
                    vo: this.data.entityId,
                    attributes: this.selected.selected
                }).subscribe(() => {
                    this.handleSuccess();
                });
                break;
            case 'host':
                this.attributesManager.setHostAttributes({
                    host: this.data.entityId,
                    attributes: this.selected.selected
                }).subscribe(() => {
                    this.handleSuccess();
                });
                break;
        }
    }
    applyFilter(filterValue) {
        this.filterValue = filterValue;
    }
    handleSuccess() {
        this.notificator.showSuccess(this.saveSuccessMessage);
        this.selected.clear();
        this.dialogRef.close('saved');
    }
    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
    }
};
__decorate([
    ViewChild('list'),
    __metadata("design:type", AttributesListComponent)
], CreateAttributeDialogComponent.prototype, "list", void 0);
CreateAttributeDialogComponent = __decorate([
    Component({
        selector: 'app-create-attribute-dialog',
        templateUrl: './create-attribute-dialog.component.html',
        styleUrls: ['./create-attribute-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, AttributesManagerService,
        NotificatorService,
        TableConfigService,
        TranslateService])
], CreateAttributeDialogComponent);
export { CreateAttributeDialogComponent };
//# sourceMappingURL=create-attribute-dialog.component.js.map