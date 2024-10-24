import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { InvitationsManagerService, InvitationWithSender } from '@perun-web-apps/perun/openapi';

export interface DialogData {
  invitations: InvitationWithSender[];
}

@Component({
  selector: 'app-invitation-resend-dialog.component',
  templateUrl: './invitation-resend-dialog.component.html',
  styleUrls: ['./invitation-resend-dialog.component.scss'],
})
export class InvitationResendDialogComponent {
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<InvitationResendDialogComponent>,
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
    this.invitationManager.resendInvitation(this.data.invitations[0]?.id).subscribe({
      next: () => {
        this.translate
          .get('DIALOGS.RESEND_INVITATION.SUCCESS')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close();
          });
      },
      error: () => (this.loading = false),
    });
  }
}
