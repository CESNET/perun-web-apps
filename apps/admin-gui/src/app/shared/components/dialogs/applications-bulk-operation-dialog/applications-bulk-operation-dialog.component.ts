import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Application, AttributeDefinition, MailType } from '@perun-web-apps/perun/openapi';
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
}

@Component({
  selector: 'app-applications-bulk-operation-dialog',
  templateUrl: './applications-bulk-operation-dialog.component.html',
  styleUrls: ['./applications-bulk-operation-dialog.component.scss'],
})
export class ApplicationsBulkOperationDialogComponent implements OnInit {
  mailType: MailType = 'APP_CREATED_USER';
  reason = '';
  tableId = TABLE_VO_APPLICATIONS_NORMAL;
  constructor(
    private dialogRef: MatDialogRef<ApplicationsBulkOperationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationsBulkOperationDialogData,
  ) {}

  ngOnInit(): void {
    if (this.data.theme === 'group') {
      this.tableId = TABLE_GROUP_APPLICATIONS_NORMAL;
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
