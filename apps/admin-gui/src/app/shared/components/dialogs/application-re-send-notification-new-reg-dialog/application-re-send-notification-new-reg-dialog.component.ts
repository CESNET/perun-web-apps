import { MatTooltip } from '@angular/material/tooltip';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { AlertComponent } from '@perun-web-apps/ui/alerts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { InputSendMessage, MailType, RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { FormTypeConfig } from '@perun-web-apps/perun/registrar-openapi';

export interface DialogData {
  applicationId: string;
  appType: FormTypeConfig.FormTypeEnum;
  theme: string;
  voId: number;
  groupId: number;
  userId?: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    AlertComponent,
    LoadingDialogComponent,
    TranslateModule,
    MatTooltip,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-application-re-send-notification-new-reg-dialog',
  templateUrl: './application-re-send-notification-new-reg-dialog.component.html',
  styleUrls: ['./application-re-send-notification-new-reg-dialog.component.scss'],
})
export class ApplicationReSendNotificationNewRegDialogComponent implements OnInit {
  mailType: MailType;
  reason = '';
  loading = false;
  theme: string;
  availableMailTypes: MailType[] = [
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
    public dialogRef: MatDialogRef<ApplicationReSendNotificationNewRegDialogComponent>,
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
    const sendMessageInput: InputSendMessage = {
      appId: null,
      mailType: this.mailType,
      newRegAppId: this.data.applicationId,
      newRegAppType: this.data.appType === 'INITIAL' ? 'INITIAL' : 'EXTENSION',
    };
    if (this.data.userId) {
      sendMessageInput.user = this.data.userId;
    }
    if (this.data.groupId) {
      sendMessageInput.group = this.data.groupId;
    } else {
      sendMessageInput.vo = this.data.voId;
    }
    if (this.mailType === MailType.APP_REJECTED_USER) {
      sendMessageInput.reason = this.reason;
    }
    this.registrarManager.sendMessage(sendMessageInput).subscribe({
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
