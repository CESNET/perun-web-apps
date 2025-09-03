import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { InvitationsManagerService, InvitationWithSender } from '@perun-web-apps/perun/openapi';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { formatDate, CommonModule } from '@angular/common';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface DialogData {
  theme: string;
  invitation: InvitationWithSender;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-invitation-extend-date-dialog.component',
  templateUrl: './invitation-extend-date-dialog.component.html',
  styleUrls: ['./invitation-extend-date-dialog.component.scss'],
})
export class InvitationExtendDateDialogComponent implements OnInit {
  loading = false;
  minDate: Date;
  maxDate: Date;
  defaultDate: Date;
  dateForm: FormControl<string>;
  theme: string;

  constructor(
    public dialogRef: MatDialogRef<InvitationExtendDateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService,
    private notificator: NotificatorService,
    private invitationManager: InvitationsManagerService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.minDate = new Date(this.data.invitation.expiration);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
    this.defaultDate = new Date(this.minDate);
    this.defaultDate.setMonth(this.defaultDate.getMonth() + 1);
    this.minDate.setDate(this.minDate.getDate() + 1);

    this.dateForm = new FormControl(this.defaultDate.toISOString().substring(0, 10), [
      Validators.required,
    ]);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.dateForm.invalid) {
      return;
    }
    const newExpirationDate: Date = new Date(this.dateForm.value);

    this.loading = true;
    this.invitationManager
      .extendInvitationExpiration(
        this.data.invitation.id,
        this.expirationDateToString(newExpirationDate),
      )
      .subscribe({
        next: () => {
          this.translate
            .get('DIALOGS.EXTEND_INVITATION_EXPIRATION_DATE.SUCCESS')
            .subscribe((successMessage: string) => {
              this.notificator.showSuccess(successMessage);
              this.dialogRef.close(true);
            });
        },
        error: () => (this.loading = false),
      });
  }

  private expirationDateToString(date: Date): string | null {
    return date ? formatDate(date, 'yyyy-MM-dd', 'en-GB') : null;
  }
}
