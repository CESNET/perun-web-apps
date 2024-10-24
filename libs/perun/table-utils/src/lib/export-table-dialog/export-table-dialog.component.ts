import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreService } from '@perun-web-apps/perun/services';

interface Format {
  value: string;
  viewValue: string;
}

export interface InputData {
  displayedLength: number;
  dataLength: number;
}

@Component({
  selector: 'perun-web-apps-export-table-dialog',
  templateUrl: './export-table-dialog.component.html',
  styleUrls: ['./export-table-dialog.component.scss'],
})
export class ExportTableDialogComponent {
  formats: Format[] = [{ value: 'csv', viewValue: 'CSV' }];
  selectedFormat = new FormControl<string>('csv', Validators.required);
  selectedExportType = new FormControl<string>('current', Validators.required);
  exportLimit = this.storeService.getProperty('export_limit');
  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: InputData,
    private storeService: StoreService,
  ) {}

  export(): { exportType: string; format: string } {
    return {
      exportType: this.selectedExportType.value,
      format: this.selectedFormat.value,
    };
  }
}
