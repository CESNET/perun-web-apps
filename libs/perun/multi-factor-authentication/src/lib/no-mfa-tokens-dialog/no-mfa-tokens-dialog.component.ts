import { TranslateModule } from '@ngx-translate/core';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface NoMfaTokensData {
  tokensUrl: string;
}

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, UiAlertsModule, TranslateModule],
  standalone: true,
  selector: 'perun-web-apps-no-mfa-tokens-dialog',
  templateUrl: './no-mfa-tokens-dialog.component.html',
  styleUrls: ['./no-mfa-tokens-dialog.component.scss'],
})
export class NoMfaTokensDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NoMfaTokensData,
    private dialogRef: MatDialogRef<NoMfaTokensDialogComponent>,
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    window.open(this.data.tokensUrl, '_blank');
    this.dialogRef.close(true);
  }
}
