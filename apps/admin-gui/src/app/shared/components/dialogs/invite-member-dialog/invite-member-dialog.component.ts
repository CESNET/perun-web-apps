import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormControl, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RegistrarManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { emailRegexString } from '@perun-web-apps/perun/utils';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface InviteMemberDialogData {
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
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-invite-member-dialog',
  templateUrl: './invite-member-dialog.component.html',
  styleUrls: ['./invite-member-dialog.component.scss'],
})
export class InviteMemberDialogComponent implements OnInit {
  emailForm = new FormControl('', [
    Validators.required,
    Validators.pattern(emailRegexString).bind(this),
  ]);
  languages = ['en'];
  currentLanguage = 'en';
  name = new FormControl('', Validators.required as ValidatorFn);
  loading = false;
  theme: string;

  constructor(
    public dialogRef: MatDialogRef<InviteMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InviteMemberDialogData,
    private registrarManager: RegistrarManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private store: StoreService,
  ) {}

  ngOnInit(): void {
    this.languages = this.store.getProperty('supported_languages');
    this.theme = this.data.theme;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.emailForm.invalid || this.name.invalid) {
      return;
    }
    if (this.data.voId && !this.data.groupId) {
      this.loading = true;
      this.registrarManager
        .sendInvitation(this.emailForm.value, this.currentLanguage, this.data.voId, this.name.value)
        .subscribe({
          next: () => {
            this.translate
              .get('DIALOGS.INVITE_MEMBER.SUCCESS')
              .subscribe((successMessage: string) => {
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close(true);
              });
          },
          error: () => (this.loading = false),
        });
    } else {
      this.loading = true;
      this.registrarManager
        .sendInvitationForGroup(
          this.emailForm.value,
          this.currentLanguage,
          this.data.voId,
          this.data.groupId,
          this.name.value,
        )
        .subscribe({
          next: () => {
            this.translate
              .get('DIALOGS.INVITE_MEMBER.SUCCESS')
              .subscribe((successMessage: string) => {
                this.notificator.showSuccess(successMessage);
                this.dialogRef.close(true);
              });
          },
          error: () => (this.loading = false),
        });
    }
  }
}
