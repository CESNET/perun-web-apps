import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CustomValidators } from '@perun-web-apps/perun/utils';
import {
  loginPasswordAsyncValidator,
  PasswordFormComponent,
} from '@perun-web-apps/perun/namespace-password-form';
import { ApiRequestConfigurationService, NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface ChangePasswordDialogData {
  namespace: string;
  login: string;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
    PasswordFormComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
})
export class ChangePasswordDialogComponent implements OnInit {
  formGroup = this._formBuilder.group(
    {
      oldPasswordCtrl: ['', Validators.required],
      passwordCtrl: [
        '',
        Validators.required,
        [
          loginPasswordAsyncValidator(
            this.data.namespace,
            this.usersManagerService,
            this.apiRequestConfiguration,
            false,
            this.data.login,
          ),
        ],
      ],
      passwordAgainCtrl: [''],
    },
    {
      validators: CustomValidators.passwordMatchValidator as ValidatorFn,
    },
  );
  oldPwd: AbstractControl;
  showOldPassword = false;
  loading: boolean;
  private newPwd: AbstractControl;
  private newPwdAgain: AbstractControl;
  private successMessage: string;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ChangePasswordDialogData,
    private _formBuilder: FormBuilder,
    private usersManagerService: UsersManagerService,
    private apiRequestConfiguration: ApiRequestConfigurationService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {
    translate
      .get('SHARED_LIB.PERUN.COMPONENTS.CHANGE_PASSWORD_DIALOG.SUCCESS')
      .subscribe((m: string) => (this.successMessage = m));
  }

  ngOnInit(): void {
    this.oldPwd = this.formGroup.get('oldPasswordCtrl');
    this.newPwd = this.formGroup.get('passwordCtrl');
    this.newPwdAgain = this.formGroup.get('passwordAgainCtrl');
  }

  close(): void {
    this.dialogRef.close(false);
  }

  changePassword(): void {
    this.loading = true;
    this.usersManagerService
      .changePasswordForLogin({
        login: this.data.login,
        namespace: this.data.namespace,
        newPassword: this.newPwd.value as string,
        oldPassword: this.oldPwd.value as string,
        checkOldPassword: true,
      })
      .subscribe(() => {
        this.notificator.showSuccess(this.successMessage);
        this.loading = false;
        this.dialogRef.close(true);
      });
  }
}
