import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { openClose, tagsOpenClose } from '@perun-web-apps/perun/animations';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
let AddEditNotificationDialogComponent = class AddEditNotificationDialogComponent {
    constructor(dialogRef, registrarService, data) {
        this.dialogRef = dialogRef;
        this.registrarService = registrarService;
        this.data = data;
        this.showTags = false;
        this.isTextFocused = true;
        this.invalidNotification = false;
        this.language = 'en';
    }
    ngOnInit() {
        this.applicationMail = this.data.applicationMail;
    }
    cancel() {
        this.dialogRef.close();
    }
    create() {
        this.notificationExist();
        if (this.invalidNotification) {
            return;
        }
        if (this.data.groupId) {
            this.registrarService.addApplicationMailForGroup({ group: this.data.groupId, mail: this.applicationMail }).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
        else {
            this.registrarService.addApplicationMailForVo({ vo: this.data.voId, mail: this.applicationMail }).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }
    save() {
        this.registrarService.updateApplicationMail({ mail: this.applicationMail }).subscribe(() => {
            this.dialogRef.close(true);
        });
    }
    addTag(input, textarea, language, tag) {
        let place;
        if (!this.isTextFocused) {
            place = input;
        }
        else {
            place = textarea;
        }
        const position = place.selectionStart;
        if (this.isTextFocused) {
            this.applicationMail.message[language].text =
                this.applicationMail.message[language].text.substring(0, position) +
                    tag +
                    this.applicationMail.message[language].text.substring(position);
        }
        else {
            this.applicationMail.message[language].subject =
                this.applicationMail.message[language].subject.substring(0, position)
                    + tag +
                    this.applicationMail.message[language].subject.substring(position);
        }
        place.focus();
    }
    notificationExist() {
        for (const mail of this.data.applicationMails) {
            if (mail.mailType === this.applicationMail.mailType && mail.appType === this.applicationMail.appType) {
                this.invalidNotification = true;
                return;
            }
        }
        this.invalidNotification = false;
    }
};
AddEditNotificationDialogComponent = __decorate([
    Component({
        selector: 'app-add-edit-notification-dialog',
        templateUrl: './add-edit-notification-dialog.component.html',
        styleUrls: ['./add-edit-notification-dialog.component.scss'],
        animations: [
            tagsOpenClose,
            openClose
        ]
    }),
    __param(2, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef,
        RegistrarManagerService, Object])
], AddEditNotificationDialogComponent);
export { AddEditNotificationDialogComponent };
//# sourceMappingURL=add-edit-notification-dialog.component.js.map