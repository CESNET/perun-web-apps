import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { RtMessagesService } from '@perun-web-apps/perun/services';
let ReportIssueDialogComponent = class ReportIssueDialogComponent {
    constructor(dialogRef, translate, notificator, rtMessages) {
        this.dialogRef = dialogRef;
        this.translate = translate;
        this.notificator = notificator;
        this.rtMessages = rtMessages;
        this.message = '';
        this.subject = '';
    }
    ngOnInit() {
    }
    sendBugReport() {
        this.rtMessages.sendMessageToRT('perun', this.subject, this.getFullEmailBody()).subscribe(() => {
            // TODO show ticket number and email
            this.dialogRef.afterClosed()
                .subscribe(() => this.notificator.showSuccess(this.translate.instant('DIALOGS.REPORT_ISSUE.SUCCESS')));
            this.dialogRef.close();
        });
    }
    getFullEmailBody() {
        return this.message + '\n' +
            '------------------------\n' +
            // TODO add instance
            'Perun instance: GENERIC\n' +
            // TODO add version
            'NEW GUI';
    }
    close() {
        this.dialogRef.close();
    }
};
ReportIssueDialogComponent = __decorate([
    Component({
        selector: 'app-perun-web-apps-report-issue-dialog',
        templateUrl: './report-issue-dialog.component.html',
        styleUrls: ['./report-issue-dialog.component.scss']
    }),
    __metadata("design:paramtypes", [MatDialogRef,
        TranslateService,
        NotificatorService,
        RtMessagesService])
], ReportIssueDialogComponent);
export { ReportIssueDialogComponent };
//# sourceMappingURL=report-issue-dialog.component.js.map