import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { AppType, MailType, RegistrarManagerService } from '@perun-web-apps/perun/openapi';

export interface DialogData {
  applicationId: number;
  appType: AppType;
  theme: string;
  voId: number;
  groupId: number;
}

@Component({
  selector: 'app-application-re-send-notification-dialog',
  templateUrl: './application-re-send-notification-dialog.component.html',
  styleUrls: ['./application-re-send-notification-dialog.component.scss'],
})
export class ApplicationReSendNotificationDialogComponent implements OnInit {
  mailType: MailType;
  reason = '';
  loading = false;
  theme: string;
  availableMailTypes = [
    MailType.APP_CREATED_USER,
    MailType.APPROVABLE_GROUP_APP_USER,
    MailType.APP_CREATED_VO_ADMIN,
    MailType.MAIL_VALIDATION,
    MailType.APP_APPROVED_USER,
    MailType.APP_REJECTED_USER,
    MailType.APP_ERROR_VO_ADMIN,
  ];
  displayedMailTypes: MailType[] = [];

  constructor(
    public dialogRef: MatDialogRef<ApplicationReSendNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private registrarManager: RegistrarManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;
    if (this.data.groupId) {
      this.registrarManager.getApplicationMailsForGroup(this.data.groupId).subscribe({
        next: (appMails) => {
          appMails.map((appMail) => {
            if (
              appMail.send &&
              appMail.appType === this.data.appType &&
              this.availableMailTypes.includes(appMail.mailType)
            ) {
              this.displayedMailTypes.push(appMail.mailType);
            }
          });
          if (this.displayedMailTypes.length > 0) {
            this.mailType = this.displayedMailTypes.sort()[0];
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      this.registrarManager.getApplicationMailsForVo(this.data.voId).subscribe({
        next: (appMails) => {
          appMails.map((appMail) => {
            if (
              appMail.send &&
              appMail.appType === this.data.appType &&
              this.availableMailTypes.includes(appMail.mailType)
            ) {
              this.displayedMailTypes.push(appMail.mailType);
            }
          });
          if (this.displayedMailTypes.length > 0) {
            this.mailType = this.displayedMailTypes.sort()[0];
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;
    if (this.mailType === MailType.APP_REJECTED_USER) {
      this.registrarManager
        .sendMessage({
          appId: this.data.applicationId,
          mailType: this.mailType,
          reason: this.reason,
        })
        .subscribe({
          next: () => {
            this.translate
              .get('DIALOGS.RE_SEND_NOTIFICATION.SUCCESS')
              .subscribe((successMessage: string) => {
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close();
              });
          },
          error: () => (this.loading = false),
        });
    } else {
      this.registrarManager
        .sendMessage({ appId: this.data.applicationId, mailType: this.mailType })
        .subscribe({
          next: () => {
            this.translate
              .get('DIALOGS.RE_SEND_NOTIFICATION.SUCCESS')
              .subscribe((successMessage: string) => {
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close();
              });
          },
          error: () => (this.loading = false),
        });
    }
  }
}
