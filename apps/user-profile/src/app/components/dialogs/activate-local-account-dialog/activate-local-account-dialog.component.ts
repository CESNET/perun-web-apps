import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '@perun-web-apps/perun/utils';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import { ApiRequestConfigurationService, NotificatorService } from '@perun-web-apps/perun/services';
import { switchMap } from 'rxjs/operators';
import {
  loginPasswordAsyncValidator,
  PasswordFormComponent,
} from '@perun-web-apps/perun/namespace-password-form';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface ActivateLocalAccountData {
  userId: number;
  namespace: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    CustomTranslatePipe,
    LoadingDialogComponent,
    TranslateModule,
    PasswordFormComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'perun-web-apps-activate-authentication-local-account-dialog',
  templateUrl: './activate-local-account-dialog.component.html',
  styleUrls: ['./activate-local-account-dialog.component.scss'],
})
export class ActivateLocalAccountDialogComponent {
  loading = false;
  lang: string = this.translate.currentLang;
  pwdForm = this.formBuilder.group(
    {
      passwordCtrl: [
        '',
        Validators.required,
        [
          loginPasswordAsyncValidator(
            this.data.namespace,
            this.userManager,
            this.apiRequestConfiguration,
          ),
        ],
      ],
      passwordAgainCtrl: ['', Validators.required],
    },
    {
      validators: CustomValidators.passwordMatchValidator as ValidatorFn,
    },
  );

  constructor(
    private dialogRef: MatDialogRef<ActivateLocalAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivateLocalAccountData,
    private userManager: UsersManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private apiRequestConfiguration: ApiRequestConfigurationService,
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  activate(): void {
    this.loading = true;
    const pwd: string = this.pwdForm.value.passwordCtrl;
    this.userManager
      .reservePasswordForUser({
        user: this.data.userId,
        namespace: this.data.namespace,
        password: pwd,
      })
      .pipe(
        switchMap(() =>
          this.userManager.validatePasswordForUser(this.data.userId, this.data.namespace),
        ),
      )
      .subscribe({
        next: () => {
          this.notificator.showSuccess(
            this.translate.instant('DIALOGS.ACTIVATE_LOCAL_ACCOUNT.SUCCESS') as string,
          );
          this.dialogRef.close();
        },
        error: () => (this.loading = false),
      });
  }
}
