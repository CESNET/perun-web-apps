import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
let DeleteAttributeDefinitionDialogComponent = class DeleteAttributeDefinitionDialogComponent {
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
        this.attributesManager.deleteAttributeDefinitions(ids).subscribe(() => {
            this.translate.get('DIALOGS.DELETE_ATTRIBUTE_DEFINITION.SUCCESS').subscribe(successMessage => {
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close(true);
            });
        });
    }
};
DeleteAttributeDefinitionDialogComponent = __decorate([
    Component({
        selector: 'app-delete-attribute-definition-dialog',
        templateUrl: './delete-attribute-definition-dialog.component.html',
        styleUrls: ['./delete-attribute-definition-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, NotificatorService,
        TranslateService,
        AttributesManagerService])
], DeleteAttributeDefinitionDialogComponent);
export { DeleteAttributeDefinitionDialogComponent };
//# sourceMappingURL=delete-attribute-definition-dialog.component.js.map