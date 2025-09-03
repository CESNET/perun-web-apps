import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  Application,
  CantBeApprovedException,
  RegistrarManagerService,
} from '@perun-web-apps/perun/openapi';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface DialogData {
  err: CantBeApprovedException;
  application: Application;
  theme: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    UiAlertsModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-application-approve-anyway-dialog',
  templateUrl: './application-approve-anyway-dialog.component.html',
  styleUrls: ['./application-approve-anyway-dialog.component.scss'],
})
export class ApplicationApproveAnywayDialogComponent implements OnInit {
  err: CantBeApprovedException;
  theme: string;
  application: Application;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ApplicationApproveAnywayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private registrarManager: RegistrarManagerService,
    private notificator: NotificatorService,
  ) {}

  ngOnInit(): void {
    this.err = this.data.err;
    this.theme = this.data.theme;
    this.application = this.data.application;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    this.registrarManager.approveApplication(this.application.id).subscribe({
      next: () => {
        this.translate
          .get('VO_DETAIL.APPLICATION.APPLICATION_DETAIL.APPROVE_MESSAGE')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close(true);
          });
      },
      error: () => (this.loading = false),
    });
  }
}
