import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { CustomValidators } from '@perun-web-apps/perun/utils';
import { loginAsyncValidator } from '@perun-web-apps/perun/namespace-password-form';
import { ApiRequestConfigurationService, NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';

export interface ChangePasswordDialogData {
  namespace: string;
  login: string;
}

@Component({
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
          loginAsyncValidator(
            this.data.namespace,
            this.usersManagerService,
            this.apiRequestConfiguration,
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
