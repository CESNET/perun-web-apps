import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource } from '@angular/material/table';
let EditAttributeDialogComponent = class EditAttributeDialogComponent {
    constructor(dialogRef, data, notificator, translate, attributesManager) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.notificator = notificator;
        this.translate = translate;
        this.attributesManager = attributesManager;
        this.displayedColumns = ['name'];
    }
    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data.attributes);
    }
    onCancel() {
        this.dialogRef.close(false);
    }
    onSubmit() {
        const ids = [];
        for (const attr of this.data.attributes) {
            ids.push(attr.id);
        }
        const payload = {};
        payload[this.data.entity] = this.data.entityId;
        payload['attributes'] = ids;
        if (this.data.secondEntity !== undefined) {
            payload[this.data.secondEntity] = this.data.secondEntityId;
        }
        switch (this.data.entity) {
            case 'vo':
                this.attributesManager.setVoAttributes({
                    vo: this.data.entityId,
                    attributes: this.data.attributes
                }).subscribe(() => {
                    this.onSuccess();
                });
                break;
            case 'group':
                switch (this.data.secondEntity) {
                    case 'resource':
                        this.attributesManager.setGroupResourceAttributes({
                            group: this.data.entityId,
                            resource: this.data.secondEntityId,
                            attributes: this.data.attributes
                        }).subscribe(() => this.onSuccess());
                        break;
                    default:
                        this.attributesManager.setGroupAttributes({
                            group: this.data.entityId,
                            attributes: this.data.attributes
                        }).subscribe(() => {
                            this.onSuccess();
                        });
                }
                break;
            case 'user':
                switch (this.data.secondEntity) {
                    case 'facility':
                        this.attributesManager.setUserFacilityAttributes({
                            user: this.data.entityId,
                            facility: this.data.secondEntityId,
                            attributes: this.data.attributes
                        }).subscribe(() => this.onSuccess());
                        break;
                    default:
                        this.attributesManager.setUserAttributes({
                            user: this.data.entityId,
                            attributes: this.data.attributes
                        }).subscribe(() => {
                            this.onSuccess();
                        });
                }
                break;
            case 'member':
                switch (this.data.secondEntity) {
                    case 'resource':
                        this.attributesManager.setMemberResourceAttributes({
                            member: this.data.entityId,
                            resource: this.data.secondEntityId,
                            attributes: this.data.attributes
                        }).subscribe(() => this.onSuccess());
                        break;
                    case 'group':
                        this.attributesManager.setMemberGroupAttributes({
                            member: this.data.entityId,
                            group: this.data.secondEntityId,
                            attributes: this.data.attributes
                        }).subscribe(() => this.onSuccess());
                        break;
                    default:
                        this.attributesManager.setMemberAttributes({
                            member: this.data.entityId,
                            attributes: this.data.attributes
                        }).subscribe(() => {
                            this.onSuccess();
                        });
                }
                break;
            case 'facility':
                this.attributesManager.setFacilityAttributes({
                    facility: this.data.entityId,
                    attributes: this.data.attributes
                }).subscribe(() => {
                    this.onSuccess();
                });
                break;
            case 'host':
                this.attributesManager.setHostAttributes({
                    host: this.data.entityId,
                    attributes: this.data.attributes
                }).subscribe(() => {
                    this.onSuccess();
                });
                break;
        }
    }
    onSuccess() {
        this.translate.get('DIALOGS.EDIT_ATTRIBUTES.SUCCESS').subscribe(successMessage => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close(true);
        });
    }
};
EditAttributeDialogComponent = __decorate([
    Component({
        selector: 'perun-web-apps-edit-attribute-dialog',
        templateUrl: './edit-attribute-dialog.component.html',
        styleUrls: ['./edit-attribute-dialog.component.css']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        AttributesManagerService])
], EditAttributeDialogComponent);
export { EditAttributeDialogComponent };
//# sourceMappingURL=edit-attribute-dialog.component.js.map