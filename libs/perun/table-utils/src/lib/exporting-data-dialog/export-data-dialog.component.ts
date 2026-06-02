import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AlertComponent } from '@perun-web-apps/ui/alerts';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    AlertComponent,
    CustomTranslatePipe,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-export-data-dialog',
  templateUrl: './export-data-dialog.component.html',
  styleUrls: ['./export-data-dialog.component.scss'],
})
export class ExportDataDialogComponent {
  constructor(private dialogRef: MatDialogRef<ExportDataDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
