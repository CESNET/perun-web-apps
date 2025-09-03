import { TranslateModule } from '@ngx-translate/core';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface DeleteApplicationFormItemDialogData {
  errorMessage: string;
}

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, UiAlertsModule, TranslateModule],
  standalone: true,
  selector: 'app-delete-application-form-item-dialog',
  templateUrl: './delete-application-form-item-dialog.component.html',
  styleUrls: ['./delete-application-form-item-dialog.component.scss'],
})
export class DeleteApplicationFormItemDialogComponent {
  deletionDisabled: boolean;

  constructor(
    private dialogRef: MatDialogRef<DeleteApplicationFormItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteApplicationFormItemDialogData,
  ) {
    this.deletionDisabled = this.data.errorMessage?.length !== 0;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.dialogRef.close(true);
  }
}
