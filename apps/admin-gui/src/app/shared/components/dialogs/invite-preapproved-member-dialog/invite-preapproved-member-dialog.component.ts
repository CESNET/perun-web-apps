import { MatTooltip } from '@angular/material/tooltip';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormControl, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { InvitationsManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { formatDate, CommonModule } from '@angular/common';
import { emailRegexString } from '@perun-web-apps/perun/utils';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface InvitePreapprovedMemberDialogData {
  theme: string;
  voId: number;
  groupId: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    MatTooltip,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-invite-preapproved-member-dialog',
  templateUrl: './invite-preapproved-member-dialog.component.html',
  styleUrls: ['./invite-preapproved-member-dialog.component.scss'],
})
export class InvitePreapprovedMemberDialogComponent implements OnInit {
  emailForm = new FormControl('', [
    Validators.required,
    Validators.pattern(emailRegexString).bind(this),
  ]);
  languages = ['en'];
  currentLanguage = 'en';
  name = new FormControl('', Validators.required as ValidatorFn);
  loading = false;
  theme: string;
  minDate: Date;
  maxDate: Date;
  expirationControl = new FormControl<Date>(null);
  url: FormControl<string> = new FormControl<string>(null);

  constructor(
    public dialogRef: MatDialogRef<InvitePreapprovedMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InvitePreapprovedMemberDialogData,
    private invitationsManager: InvitationsManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private store: StoreService,
  ) {}

  ngOnInit(): void {
    this.languages = this.store.getProperty('supported_languages');
    this.theme = this.data.theme;
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
    const monthFromNow = new Date();
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);
    this.expirationControl.setValue(monthFromNow);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.emailForm.invalid || this.name.invalid) {
      return;
    }
    this.loading = true;
    this.invitationsManager
      .inviteToGroup(
        this.data.voId,
        this.data.groupId,
        this.name.value,
        this.emailForm.value,
        this.currentLanguage,
        formatDate(this.expirationControl.value, 'yyyy-MM-dd', 'en-GB'),
        this.url.value,
      )
      .subscribe({
        next: () => {
          this.translate
            .get('DIALOGS.INVITE_PREAPPROVED_MEMBER.SUCCESS')
            .subscribe((successMessage: string) => {
              this.notificator.showSuccess(successMessage);
              this.dialogRef.close(true);
            });
        },
        error: () => (this.loading = false),
      });
  }
}
