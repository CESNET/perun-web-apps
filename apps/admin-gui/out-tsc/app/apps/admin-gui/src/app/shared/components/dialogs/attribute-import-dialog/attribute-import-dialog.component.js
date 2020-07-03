import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
let AttributeImportDialogComponent = class AttributeImportDialogComponent {
    constructor(dialogRef, notificator, translate, attributesManager) {
        this.dialogRef = dialogRef;
        this.notificator = notificator;
        this.translate = translate;
        this.attributesManager = attributesManager;
        this.value = "";
    }
    ngOnInit() {
    }
    create() {
        try {
            this.attributeData = JSON.parse(this.value);
            this.attributesManager.createAttributeDefinition({ attribute: this.attributeData.attributeDefinition })
                .subscribe(attrDef => {
                // we have to update the attribute id of the attribute rights
                for (let i = 0; i < this.attributeData.attributeRights.length; i++) {
                    this.attributeData.attributeRights[i].attributeId = attrDef.id;
                }
                this.attributesManager.setAttributeRights({ rights: this.attributeData.attributeRights }).subscribe(() => {
                    this.notificator.showSuccess(this.translate.instant('DIALOGS.IMPORT_ATTRIBUTE_DEFINITION.SUCCESS'));
                    this.dialogRef.close(true);
                });
            });
        }
        catch (e) {
            console.log(e);
            this.notificator.showError(e);
        }
    }
};
AttributeImportDialogComponent = __decorate([
    Component({
        selector: 'app-attribute-import-dialog',
        templateUrl: './attribute-import-dialog.component.html',
        styleUrls: ['./attribute-import-dialog.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialogRef,
        NotificatorService,
        TranslateService,
        AttributesManagerService])
], AttributeImportDialogComponent);
export { AttributeImportDialogComponent };
//# sourceMappingURL=attribute-import-dialog.component.js.map