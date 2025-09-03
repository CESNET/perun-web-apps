import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface ServerDownDialogData {
  title: string;
  message: string;
  action: string;
}

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-server-down-dialog',
  templateUrl: './server-down-dialog.component.html',
  styleUrls: ['./server-down-dialog.component.scss'],
})
export class ServerDownDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ServerDownDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServerDownDialogData,
  ) {}

  refresh(): void {
    location.reload();
  }
}
