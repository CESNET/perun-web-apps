import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  standalone: true,
  selector: 'app-new-version-dialog',
  templateUrl: './new-version-dialog.component.html',
  styleUrls: ['./new-version-dialog.component.scss'],
})
export class NewVersionDialogComponent {
  constructor(private dialogRef: MatDialogRef<NewVersionDialogComponent>) {}

  onReload(): void {
    location.reload();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
