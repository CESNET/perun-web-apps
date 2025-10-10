import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-session-expiration-dialog',
  templateUrl: './session-expiration-dialog.component.html',
  styleUrls: ['./session-expiration-dialog.component.scss'],
})
export class SessionExpirationDialogComponent {
  constructor(private dialogRef: MatDialogRef<SessionExpirationDialogComponent>) {}

  close(): void {
    this.dialogRef.close(true);
  }
}
