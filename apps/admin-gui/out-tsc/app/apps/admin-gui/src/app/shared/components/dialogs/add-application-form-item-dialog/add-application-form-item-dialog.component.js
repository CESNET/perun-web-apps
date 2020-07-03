import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { createNewApplicationFormItem } from '@perun-web-apps/perun/utils';
let AddApplicationFormItemDialogComponent = class AddApplicationFormItemDialogComponent {
    constructor(dialogRef, data, translateService, notificationService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.translateService = translateService;
        this.notificationService = notificationService;
        this.shortName = '';
        this.items = [];
        this.selectedWidget = 'HEADING';
        this.widgets = ['HEADING', 'FROM_FEDERATION_HIDDEN', 'HTML_COMMENT', 'TEXTFIELD', 'FROM_FEDERATION_SHOW', 'VALIDATED_EMAIL', 'USERNAME',
            'PASSWORD', 'SELECTIONBOX', 'TEXTAREA', 'COMBOBOX', 'CHECKBOX', 'SUBMIT_BUTTON', 'RADIO', 'TIMEZONE', 'AUTO_SUBMIT_BUTTON'];
    }
    ngOnInit() {
        this.translateService.get('DIALOGS.APPLICATION_FORM_ADD_ITEM.INSERT_TO_BEGINNING').subscribe(text => {
            this.items.push(text);
            for (const item of this.data.applicationFormItems) {
                this.items.push(item.shortname);
            }
            this.selectedItem = text;
        });
    }
    cancel() {
        this.dialogRef.close(false);
    }
    submit() {
        if (this.shortName === '') {
            this.translateService.get('DIALOGS.APPLICATION_FORM_ADD_ITEM.NO_SHORTNAME_ERROR').subscribe(text => {
                this.notificationService.showError(text);
                return;
            });
        }
        else {
            const item = this.createApplicationItem();
            this.dialogRef.close([this.data.applicationFormItems, item]);
        }
    }
    createApplicationItem() {
        const newApplicationItem = createNewApplicationFormItem();
        newApplicationItem.shortname = this.shortName;
        newApplicationItem.type = this.selectedWidget;
        for (let i = 0; i < this.items.length; i++) {
            if (this.selectedItem === this.items[i]) {
                this.data.applicationFormItems.splice(i, 0, newApplicationItem);
                return newApplicationItem;
            }
        }
    }
};
AddApplicationFormItemDialogComponent = __decorate([
    Component({
        selector: 'app-add-application-form-item-dialog',
        templateUrl: './add-application-form-item-dialog.component.html',
        styleUrls: ['./add-application-form-item-dialog.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, TranslateService,
        NotificatorService])
], AddApplicationFormItemDialogComponent);
export { AddApplicationFormItemDialogComponent };
//# sourceMappingURL=add-application-form-item-dialog.component.js.map