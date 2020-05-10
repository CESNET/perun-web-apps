import { Component, Inject, OnInit } from '@angular/core';
import { RichDestination } from '@perun-web-apps/perun/openapi';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TABLE_FACILITY_SERVICES_DESTINATION_LIST, TableConfigService } from '@perun-web-apps/config/table-config';

export interface RemoveDestinationDialogData {
  destinations: RichDestination[];
  theme: string;
}

@Component({
  selector: 'app-perun-web-apps-remove-destination-dialog',
  templateUrl: './remove-destination-dialog.component.html',
  styleUrls: ['./remove-destination-dialog.component.scss']
})
export class RemoveDestinationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveDestinationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: RemoveDestinationDialogData,
              private tableConfigService: TableConfigService) { }

  displayedColumns: string[] = ['destinationId', 'service', 'destination', 'type', 'propagationType'];

  pageSize: number;
  tableId = TABLE_FACILITY_SERVICES_DESTINATION_LIST;

  ngOnInit() {
    this.pageSize = this.tableConfigService.getTablePageSize(this.tableId);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    this.dialogRef.close(true);
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.tableConfigService.setTablePageSize(this.tableId, event.pageSize);
  }
}
