import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
let DeleteAttributeDialogComponent = class DeleteAttributeDialogComponent {
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
                this.attributesManager.removeVoAttributes(this.data.entityId, ids).subscribe(() => {
                    this.onSuccess();
                });
                break;
            case 'group':
                switch (this.data.secondEntity) {
                    case 'resource':
                        this.attributesManager.removeGroupResourceAttributes(this.data.entityId, this.data.secondEntityId, ids).subscribe(() => this.onSuccess());
                        break;
                    default:
                        this.attributesManager.removeGroupAttributes(this.data.entityId, ids).subscribe(() => this.onSuccess());
                }
                break;
            case 'user':
                switch (this.data.secondEntity) {
                    case 'facility':
                        this.attributesManager.removeUserFacilityAttributes(this.data.entityId, this.data.secondEntityId, ids).subscribe(() => this.onSuccess());
                        break;
                    default:
                        this.attributesManager.removeUserAttributes(this.data.entityId, ids).subscribe(() => this.onSuccess());
                }
                break;
            case 'member':
                switch (this.data.secondEntity) {
                    case 'resource':
                        this.attributesManager.removeMemberResourceAttributes(this.data.entityId, this.data.secondEntityId, ids).subscribe(() => this.onSuccess());
                        break;
                    case 'group':
                        this.attributesManager.removeMemberGroupAttributes(this.data.entityId, this.data.secondEntityId, ids).subscribe(() => this.onSuccess());
                        break;
                    default:
                        this.attributesManager.removeMemberAttributes(this.data.entityId, ids).subscribe(() => this.onSuccess());
                }
                break;
            case 'facility':
                this.attributesManager.removeFacilityAttributes(this.data.entityId, ids).subscribe(() => {
                    this.onSuccess();
                });
                break;
            case 'host':
                this.attributesManager.removeHostAttributes(this.data.entityId, ids).subscribe(() => {
                    this.onSuccess();
                });
                break;
        }
    }
    onSuccess() {
        this.translate.get('DIALOGS.DELETE_ATTRIBUTES.SUCCESS').subscribe(successMessage => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close(true);
        });
    }
};
DeleteAttributeDialogComponent = __decorate([
    Component({
        selector: 'app-delete-attribute-dialog',
        templateUrl: './delete-attribute-dialog.component.html',
        styleUrls: ['./delete-attribute-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        AttributesManagerService])
], DeleteAttributeDialogComponent);
export { DeleteAttributeDialogComponent };
//# sourceMappingURL=delete-attribute-dialog.component.js.map