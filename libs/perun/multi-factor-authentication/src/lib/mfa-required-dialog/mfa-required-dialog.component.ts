import { TranslateModule } from '@ngx-translate/core';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface MfaRequiredDialogData {
  mfaRoleException: boolean;
}

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, UiAlertsModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-mfa-required-dialog',
  templateUrl: './mfa-required-dialog.component.html',
  styleUrls: ['./mfa-required-dialog.component.scss'],
})
export class MfaRequiredDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<MfaRequiredDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MfaRequiredDialogData,
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.dialogRef.close(true);
  }
}
