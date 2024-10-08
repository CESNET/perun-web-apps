import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  ExportTableDialogComponent,
  InputData,
} from '../export-table-dialog/export-table-dialog.component';

interface DialogData {
  exportType: string;
  format: string;
}

@Component({
  selector: 'perun-web-apps-table-options',
  templateUrl: './table-options.component.html',
  styleUrls: ['./table-options.component.scss'],
})
export class TableOptionsComponent {
  @Input() dataLength: number;
  @Input() displayedLength: number;
  @Output() exportDisplayedData = new EventEmitter<string>();
  @Output() exportAllData = new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}
  openDialog(): void {
    const config = new MatDialogConfig<InputData>();
    config.disableClose = true;
    config.autoFocus = false;
    config.width = '500px';
    config.data = {
      dataLength: this.dataLength,
      displayedLength: this.displayedLength,
    };
    this.dialog
      .open(ExportTableDialogComponent, config)
      .afterClosed()
      .subscribe((result: DialogData) => {
        if (result) {
          if (result.exportType === 'all') {
            this.exportAllData.emit(result.format);
          } else {
            this.exportDisplayedData.emit(result.format);
          }
        }
      });
  }
}
