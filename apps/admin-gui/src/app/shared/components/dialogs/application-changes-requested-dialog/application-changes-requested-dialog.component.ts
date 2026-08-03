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
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { SubmissionsService } from '@perun-web-apps/perun/registrar-openapi';

export interface DialogData {
  applicationId: string;
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
  selector: 'app-application-changes-requested-dialog',
  templateUrl: './application-changes-requested-dialog.component.html',
  styleUrls: ['./application-changes-requested-dialog.component.scss'],
})
export class ApplicationChangesRequestedDialogComponent implements OnInit {
  reason = '';
  loading = false;
  theme: string;

  constructor(
    public dialogRef: MatDialogRef<ApplicationChangesRequestedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private submissionsService: SubmissionsService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.loading = true;
    this.submissionsService.requestChanges(this.data.applicationId, this.reason).subscribe(
      (application) => {
        this.translate
          .get('DIALOGS.CHANGES_REQUESTED.SUCCESS')
          .subscribe((successMessage: string) => {
            this.notificator.showSuccess(successMessage);
            this.dialogRef.close(application);
          });
      },
      () => (this.loading = false),
    );
  }
}
