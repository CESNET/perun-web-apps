import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OtherApplicationsService } from '@perun-web-apps/perun/services';
import { AppType } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-perun-web-apps-change-email-user-profile-redirect-dialog',
  templateUrl: './change-email-user-profile-redirect-dialog.component.html',
  styleUrls: ['./change-email-user-profile-redirect-dialog.component.scss'],
})
export class ChangeEmailUserProfileRedirectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ChangeEmailUserProfileRedirectDialogComponent>,
    private appUrlService: OtherApplicationsService,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const url = this.appUrlService.getUrlForOtherApplication(AppType.Profile);
    window.open(url, '_blank');
    this.dialogRef.close();
  }
}
