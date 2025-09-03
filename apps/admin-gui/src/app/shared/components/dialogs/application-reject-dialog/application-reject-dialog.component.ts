import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface DialogData {
  applicationId: number;
  theme: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-application-reject-dialog',
  templateUrl: './application-reject-dialog.component.html',
  styleUrls: ['./application-reject-dialog.component.scss'],
})
export class ApplicationRejectDialogComponent implements OnInit {
  reason = '';
  loading = false;
  theme: string;

  constructor(
    public dialogRef: MatDialogRef<ApplicationRejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private registrarManager: RegistrarManagerService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;
    this.registrarManager.rejectApplication(this.data.applicationId, this.reason).subscribe(
      () => {
        this.translate
          .get('DIALOGS.REJECT_APPLICATION.SUCCESS')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close();
          });
      },
      () => (this.loading = false),
    );
  }
}
