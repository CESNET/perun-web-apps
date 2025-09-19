import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [CommonModule, MatIconModule, MatDialogModule, TranslateModule, MatButton],
  standalone: true,
  selector: 'perun-web-apps-user-dont-exist-dialog',
  templateUrl: './user-dont-exist-dialog.component.html',
  styleUrls: ['./user-dont-exist-dialog.component.scss'],
})
export class UserDontExistDialogComponent {
  constructor(public dialogRef: MatDialogRef<UserDontExistDialogComponent>) {}

  onLogOut(): void {
    this.dialogRef.close();
  }
}
