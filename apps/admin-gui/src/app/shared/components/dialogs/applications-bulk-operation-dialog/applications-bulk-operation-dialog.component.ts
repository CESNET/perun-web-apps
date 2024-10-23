import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Application,
  ApplicationMail,
  AttributeDefinition,
  MailType,
  RegistrarManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  TABLE_GROUP_APPLICATIONS_NORMAL,
  TABLE_VO_APPLICATIONS_NORMAL,
} from '@perun-web-apps/config/table-config';

interface ApplicationsBulkOperationDialogData {
  theme: string;
  title: string;
  description: string;
  confirmButtonLabel: string;
  action: 'APPROVE' | 'REJECT' | 'DELETE' | 'RESEND';
  displayedColumns: string[];
  selectedApplications: Application[];
  allowGroupMailType: boolean;
  fedColumnsFriendly: string[];
  fedAttrs: AttributeDefinition[];
  voId?: number;
  groupId?: number;
}

@Component({
  selector: 'app-applications-bulk-operation-dialog',
  templateUrl: './applications-bulk-operation-dialog.component.html',
  styleUrls: ['./applications-bulk-operation-dialog.component.scss'],
})
export class ApplicationsBulkOperationDialogComponent implements OnInit {
  loading = false;
  mailType: MailType = 'APP_CREATED_USER';
  reason = '';
  tableId = TABLE_VO_APPLICATIONS_NORMAL;
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
  appMails: ApplicationMail[] = [];
  constructor(
    private dialogRef: MatDialogRef<ApplicationsBulkOperationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationsBulkOperationDialogData,
    private registrarManager: RegistrarManagerService,
  ) {}

  ngOnInit(): void {
    if (this.data.theme === 'group') {
      this.tableId = TABLE_GROUP_APPLICATIONS_NORMAL;
    }

    if (this.data.action === 'RESEND') {
      this.loading = true;
      if (this.data.groupId) {
        this.registrarManager.getApplicationMailsForGroup(this.data.groupId).subscribe({
          next: (appMails) => {
            appMails.map((appMail) => {
              if (appMail.send && this.availableMailTypes.includes(appMail.mailType)) {
                this.appMails.push(appMail);
                if (!this.displayedMailTypes.includes(appMail.mailType)) {
                  this.displayedMailTypes.push(appMail.mailType);
                }
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
              if (appMail.send && this.availableMailTypes.includes(appMail.mailType)) {
                this.appMails.push(appMail);
                if (!this.displayedMailTypes.includes(appMail.mailType)) {
                  this.displayedMailTypes.push(appMail.mailType);
                }
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
  }

  onConfirm(): void {
    if (this.data.action === 'RESEND') {
      this.dialogRef.close({ type: this.mailType, reason: this.reason });
    } else {
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
