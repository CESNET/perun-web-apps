import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { InvitationsManagerService, InvitationWithSender } from '@perun-web-apps/perun/openapi';

export interface DialogData {
  invitations: InvitationWithSender[];
}

@Component({
  selector: 'app-invitation-revoke-dialog.component',
  templateUrl: './invitation-revoke-dialog.component.html',
  styleUrls: ['./invitation-revoke-dialog.component.scss'],
})
export class InvitationRevokeDialogComponent {
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<InvitationRevokeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private invitationManager: InvitationsManagerService,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;
    this.invitationManager.revokeInvitationById(this.data.invitations[0]?.id).subscribe({
      next: () => {
        this.translate
          .get('DIALOGS.REVOKE_INVITATION.SUCCESS')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close(true);
          });
      },
      error: () => (this.loading = false),
    });
  }
}
