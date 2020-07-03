import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import { AttributesManagerService } from '@perun-web-apps/perun/openapi';
let EditEmailFooterDialogComponent = class EditEmailFooterDialogComponent {
    constructor(dialogRef, attributesManager, translateService, notificator, data) {
        this.dialogRef = dialogRef;
        this.attributesManager = attributesManager;
        this.translateService = translateService;
        this.notificator = notificator;
        this.data = data;
        this.mailFooter = '';
    }
    ngOnInit() {
        this.data.groupId ? this.getFooterForGroup() : this.getFooterForVo();
    }
    submit() {
        // @ts-ignore
        this.mailAttribute.value = this.mailFooter;
        if (this.data.groupId) {
            this.attributesManager.setGroupAttribute({ group: this.data.groupId, attribute: this.mailAttribute }).subscribe(() => {
                this.notificateSuccess();
            });
        }
        else {
            this.attributesManager.setVoAttribute({ vo: this.data.voId, attribute: this.mailAttribute }).subscribe(() => {
                this.notificateSuccess();
            });
        }
        this.dialogRef.close();
    }
    cancel() {
        this.dialogRef.close();
    }
    getFooterForVo() {
        this.attributesManager.getVoAttributeByName(this.data.voId, Urns.VO_DEF_MAIL_FOOTER).subscribe(footer => {
            this.mailAttribute = footer;
            if (footer.value) {
                // @ts-ignore
                this.mailFooter = footer.value;
            }
            else {
                this.mailFooter = '';
            }
        });
    }
    getFooterForGroup() {
        this.attributesManager.getGroupAttributeByName(this.data.groupId, Urns.GROUP_DEF_MAIL_FOOTER).subscribe(footer => {
            this.mailAttribute = footer;
            if (footer.value) {
                // @ts-ignore
                this.mailFooter = footer.value;
            }
            else {
                this.mailFooter = '';
            }
        });
    }
    notificateSuccess() {
        this.translateService.get('DIALOGS.NOTIFICATIONS_EDIT_FOOTER.SUCCESS').subscribe(text => {
            this.notificator.showSuccess(text);
        });
    }
};
EditEmailFooterDialogComponent = __decorate([
    Component({
        selector: 'app-edit-email-footer-dialog',
        templateUrl: './edit-email-footer-dialog.component.html',
        styleUrls: ['./edit-email-footer-dialog.component.scss']
    }),
    __param(4, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef,
        AttributesManagerService,
        TranslateService,
        NotificatorService, Object])
], EditEmailFooterDialogComponent);
export { EditEmailFooterDialogComponent };
//# sourceMappingURL=edit-email-footer-dialog.component.js.map