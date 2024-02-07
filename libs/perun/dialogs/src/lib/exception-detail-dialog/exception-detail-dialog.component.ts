import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { BugReportDialogComponent } from '../bug-report-dialog/bug-report-dialog.component';
import { PerunException } from '@perun-web-apps/perun/openapi';

export interface ExceptionDetailData {
  error: PerunException;
  theme: string;
}

@Component({
  selector: 'perun-web-apps-exception-detail-dialog',
  templateUrl: './exception-detail-dialog.component.html',
  styleUrls: ['./exception-detail-dialog.component.scss'],
})
export class ExceptionDetailDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ExceptionDetailDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ExceptionDetailData,
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onBugReport(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      const config = getDefaultDialogConfig();
      config.width = '550px';
      config.data = { error: this.data.error };
      config.autoFocus = false;

      this.dialog.open(BugReportDialogComponent, config);
    });
    this.dialogRef.close();
  }
}
