import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {NotificatorService} from '@perun-web-apps/perun/services';
import { MailType, RegistrarManagerService } from '@perun-web-apps/perun/openapi';

export interface DialogData {
  applicationId: number;
}

@Component({
  selector: 'app-application-re-send-notification-dialog',
  templateUrl: './application-re-send-notification-dialog.component.html',
  styleUrls: ['./application-re-send-notification-dialog.component.scss']
})
export class ApplicationReSendNotificationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ApplicationReSendNotificationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private translate: TranslateService,
              private notificator: NotificatorService,
              private registrarManager: RegistrarManagerService) { }

  mailType: MailType = 'APP_CREATED_USER';
  reason = '';

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.mailType === 'APP_REJECTED_USER') {
      this.registrarManager.sendMessage(
        {applicationId: this.data.applicationId, mailType: this.mailType, reason: this.reason}).subscribe( () => {
        this.translate.get('DIALOGS.RE_SEND_NOTIFICATION.SUCCESS').subscribe(successMessage => {
          this.notificator.showSuccess(successMessage);
          this.dialogRef.close();
        });
      });
    } else {
      this.registrarManager.sendMessage(
        {applicationId: this.data.applicationId, mailType: this.mailType}).subscribe( () => {
        this.translate.get('DIALOGS.RE_SEND_NOTIFICATION.SUCCESS').subscribe(successMessage => {
          this.notificator.showSuccess(successMessage);
          this.dialogRef.close();
        });
      });
    }
  }
}
