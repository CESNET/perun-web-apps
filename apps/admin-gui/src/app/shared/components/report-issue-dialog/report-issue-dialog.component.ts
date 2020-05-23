import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { RtMessagesService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-perun-web-apps-report-issue-dialog',
  templateUrl: './report-issue-dialog.component.html',
  styleUrls: ['./report-issue-dialog.component.scss']
})
export class ReportIssueDialogComponent implements OnInit {

  message = '';
  subject = '';

  constructor(private dialogRef: MatDialogRef<ReportIssueDialogComponent>,
              private translate: TranslateService,
              private notificator: NotificatorService,
              private rtMessages: RtMessagesService) { }

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

  getFullEmailBody(): string {
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
}
