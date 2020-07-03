import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { RtMessagesService } from '@perun-web-apps/perun/services';
let BugReportDialogComponent = class BugReportDialogComponent {
    constructor(dialogRef, translate, notificator, rtMessages, data) {
        this.dialogRef = dialogRef;
        this.translate = translate;
        this.notificator = notificator;
        this.rtMessages = rtMessages;
        this.data = data;
        this.message = '';
        this.subject = '';
        this.methodRegexp = /(\w+\/\w+)$/g;
    }
    ngOnInit() {
        if (this.data.error && this.data.error.errorId) {
            this.subject = this.translate.instant('SHARED_LIB.PERUN.COMPONENTS.BUG_REPORT.SUBJECT_VALUE') +
                this.parseMethod(this.data.error.call) + ' (' + this.data.error.errorId + ')';
        }
    }
    sendBugReport() {
        this.rtMessages.sendMessageToRT('perun', this.subject, this.getFullEmailBody()).subscribe(() => {
            // TODO show ticket number and email
            this.dialogRef.afterClosed()
                .subscribe(() => this.notificator.showSuccess(this.translate.instant('SHARED_LIB.PERUN.COMPONENTS.BUG_REPORT.SUCCESS')));
            this.dialogRef.close();
        });
    }
    parseMethod(url) {
        if (!url) {
            return url;
        }
        return this.methodRegexp.exec(url)[1];
    }
    getFullEmailBody() {
        return this.message + '\n' +
            '------------------------\n' +
            'Technical details:\n\n' +
            this.data.error.errorId + ' ' + this.data.error.type + '\n' +
            this.data.error.message + '\n' +
            // TODO add instance
            'Perun instance: GENERIC\n' +
            'Request:\n' +
            this.data.error.call + '\n\n' +
            'Payload:\n' +
            this.data.error.payload + '\n\n' +
            // TODO add version
            'NEW GUI';
    }
};
BugReportDialogComponent = __decorate([
    Component({
        selector: 'perun-web-apps-bug-report-dialog',
        templateUrl: './bug-report-dialog.component.html',
        styleUrls: ['./bug-report-dialog.component.scss']
    }),
    __param(4, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef,
        TranslateService,
        NotificatorService,
        RtMessagesService, Object])
], BugReportDialogComponent);
export { BugReportDialogComponent };
//# sourceMappingURL=bug-report-dialog.component.js.map