import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-user-dont-exist-dialog',
  templateUrl: './user-not-allowed-access.component.html',
  styleUrls: ['./user-not-allowed-access.component.scss'],
})
export class UserNotAllowedAccessComponent {
  constructor(public dialogRef: MatDialogRef<UserNotAllowedAccessComponent>) {}

  redirect(): void {
    this.dialogRef.close();
  }
}
