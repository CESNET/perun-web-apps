import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertComponent } from '@perun-web-apps/ui/alerts';

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, AlertComponent, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-mail-change-failed-dialog',
  templateUrl: './mail-change-failed-dialog.component.html',
  styleUrls: ['./mail-change-failed-dialog.component.scss'],
})
export class MailChangeFailedDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<MailChangeFailedDialogComponent>,
    private router: Router,
  ) {}

  onClose(): void {
    void this.router.navigate([], { queryParamsHandling: 'preserve' });
    this.dialogRef.close();
  }
}
