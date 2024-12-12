import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Application, PerunException } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { BugReportDialogComponent } from '@perun-web-apps/perun/dialogs';
import { RPCError } from '@perun-web-apps/perun/models';

interface ApplicationsBulkOperationFailureDialogData {
  theme: string;
  action: 'APPROVE' | 'REJECT' | 'DELETE';
  applicationsResults: [Application, PerunException][];
  displayedColumns: string[];
}

@Component({
  selector: 'app-applications-bulk-operation-failure-dialog',
  templateUrl: './applications-bulk-operation-failure-dialog.component.html',
  styleUrls: ['./applications-bulk-operation-failure-dialog.component.scss'],
})
export class ApplicationsBulkOperationFailureDialogComponent implements OnInit {
  applicationFailures: [Application, PerunException][];
  applicationSuccesses: [Application, PerunException][];
  displaySuccess = false;
  displayedColumns: string[];
  displayedColumnsSuccess: string[];
  selectedApplicationResults: [Application, PerunException][] = [];
  cantBeApprovedPresent: boolean = false;
  updated: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ApplicationsBulkOperationFailureDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationsBulkOperationFailureDialogData,
  ) {}

  ngOnInit(): void {
    this.applicationFailures = this.data.applicationsResults.filter(([, error]) => error !== null);
    this.applicationSuccesses = this.data.applicationsResults.filter(([, error]) => error === null);
    this.displayedColumns = this.data.displayedColumns;
    this.displayedColumnsSuccess = this.displayedColumns.filter((column) => column !== 'error');
    this.cantBeApprovedPresent = this.data.applicationsResults.some(
      (result) => result[1].name === 'CantBeApprovedException',
    );
  }

  onClose(): void {
    this.dialogRef.close(this.updated);
  }

  onSelectedApplicationResultsChange(applicationResults: [Application, PerunException][]): void {
    this.selectedApplicationResults = applicationResults;
  }

  reportBugs(): void {
    const config = getDefaultDialogConfig();
    config.width = '550px';

    config.data =
      this.selectedApplicationResults.length !== 1
        ? {
            bulkIdErrorPairs: this.selectedApplicationResults.map(([application, exception]) => [
              application.id,
              exception,
            ]),
            bulkCall: (this.applicationFailures[0][1] as RPCError).call,
            bulkMessage:
              'Failed to ' +
              this.data.action.toLowerCase() +
              ' ' +
              this.selectedApplicationResults.length.toString() +
              ' applications with these errors:',
          }
        : { error: this.selectedApplicationResults[0][1] };
    config.autoFocus = false;

    this.dialog.open(BugReportDialogComponent, config);
  }
}
