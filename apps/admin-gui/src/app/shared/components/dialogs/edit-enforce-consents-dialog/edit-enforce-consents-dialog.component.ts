import { TranslateModule } from '@ngx-translate/core';
import { MatDivider } from '@angular/material/divider';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface EditEnforceConsentsDialogData {
  theme: string;
  enforceConsents: boolean;
  consentHubName: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    UiAlertsModule,
    MatDivider,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-perun-web-apps-edit-enforce-consents-dialog',
  templateUrl: './edit-enforce-consents-dialog.component.html',
  styleUrls: ['./edit-enforce-consents-dialog.component.scss'],
})
export class EditEnforceConsentsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditEnforceConsentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditEnforceConsentsDialogData,
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.dialogRef.close(true);
  }
}
