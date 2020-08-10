import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { RtMessagesService } from '@perun-web-apps/perun/services';
import { version } from '../../../../../../../package.json';

@Component({
  selector: 'app-perun-web-apps-report-issue-dialog',
  templateUrl: './report-issue-dialog.component.html',
  styleUrls: ['./report-issue-dialog.component.scss']
})
export class ReportIssueDialogComponent implements OnInit {

  message = '';
  subject = '';
  instanceName = '';

  constructor(private dialogRef: MatDialogRef<ReportIssueDialogComponent>,
              private translate: TranslateService,
              private notificator: NotificatorService,
              private rtMessages: RtMessagesService,
              private storeService: StoreService) { }

  ngOnInit() {
    this.instanceName = this.storeService.get('config');
  }

  sendBugReport() {
    this.rtMessages.sendMessageToRT('perun', this.subject, this.getFullEmailBody()).subscribe(message  => {
      this.dialogRef.afterClosed()
        .subscribe(() => this.notificator.showSuccess(this.translate.instant('DIALOGS.REPORT_ISSUE.SUCCESS') + message.ticketNumber));
      this.dialogRef.close();
    });
  }

  getFullEmailBody(): string {
    return this.message + '\n' +
      '------------------------\n' +
      'Perun instance: ' + this.instanceName + '\n' +
      'Sended from new gui version:' + version;

  }

  close() {
    this.dialogRef.close();
  }
}
