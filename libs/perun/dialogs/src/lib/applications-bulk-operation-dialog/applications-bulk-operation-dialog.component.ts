import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { MatSort } from '@angular/material/sort';
import { Application } from '@perun-web-apps/perun/openapi';

interface ApplicationsBulkOperationDialogData {
  displayedColumns: string[];
  selectedApplications: Application[];
  action: 'APPROVE' | 'REJECT' | 'DELETE' | 'RESEND';
  title: string;
  description: string;
  groupId: number;
  confirmButtonLabel: string;
}

@Component({
  selector: 'perun-web-apps-applications-bulk-operation-dialog',
  templateUrl: './applications-bulk-operation-dialog.component.html',
  styleUrls: ['./applications-bulk-operation-dialog.component.scss'],
})
export class ApplicationsBulkOperationDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Application>;
  description: string;
  action: 'APPROVE' | 'REJECT' | 'DELETE' | 'RESEND';
  title: string;
  confirmButtonLabel: string;

  constructor(
    private dialogRef: MatDialogRef<ApplicationsBulkOperationDialogComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: ApplicationsBulkOperationDialogData
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.data.displayedColumns;
    this.dataSource = new MatTableDataSource(this.data.selectedApplications);
    this.description = this.data.description || '';
    this.title = this.data.title || '';
    this.action = this.data.action || 'APPROVE';
    this.confirmButtonLabel =
      this.data.confirmButtonLabel || 'VO_DETAIL.APPLICATION.DIALOG.CONFIRM';
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  onConfirm(): void {
    // TODO? Maybe nothing more needed
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
