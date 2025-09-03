import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FacilitiesManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

export interface CancelConfigurationDialogData {
  facilityId: number;
  lastStep: boolean;
  theme: string;
}

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, TranslateModule],
  standalone: true,
  selector: 'app-cancel-configuration-dialog',
  templateUrl: './cancel-configuration-dialog.component.html',
  styleUrls: ['./cancel-configuration-dialog.component.scss'],
})
export class CancelConfigurationDialogComponent implements OnInit {
  theme = '';
  lastStep: boolean;
  title = '';
  info = '';
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CancelConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CancelConfigurationDialogData,
    private facilityService: FacilitiesManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.lastStep = this.data.lastStep;
    if (this.lastStep) {
      this.title = 'DIALOGS.CANCEL_CONFIG.TITLE_COMPLETE';
      this.info = 'DIALOGS.CANCEL_CONFIG.INFO_COMPLETE';
    } else {
      this.title = 'DIALOGS.CANCEL_CONFIG.TITLE_INCOMPLETE';
      this.info = 'DIALOGS.CANCEL_CONFIG.INFO_INCOMPLETE';
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onDelete(): void {
    this.loading = true;
    this.facilityService.deleteFacility(this.data.facilityId, true).subscribe(
      () => {
        this.notificator.showSuccess(
          this.translate.instant('DIALOGS.CANCEL_CONFIG.SUCCESS') as string,
        );
        this.dialogRef.close(true);
        this.loading = false;
      },
      () => (this.loading = false),
    );
  }

  onKeep(): void {
    this.dialogRef.close(true);
  }
}
