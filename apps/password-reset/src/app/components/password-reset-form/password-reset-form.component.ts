import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  ApiRequestConfigurationService,
  ErrorTranslateService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { UsersManagerService } from '@perun-web-apps/perun/openapi';
import {
  loginAsyncValidator,
  PasswordFormComponent,
} from '@perun-web-apps/perun/namespace-password-form';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomValidators, getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import {
  PasswordAction,
  PasswordLabel,
  PasswordLabels,
  RPCError,
} from '@perun-web-apps/perun/models';
import { iif, mergeMap, of } from 'rxjs';
import { BugReportDialogComponent } from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    UiAlertsModule,
    MatProgressSpinnerModule,
    TranslateModule,
    PasswordFormComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.scss'],
})
export class PasswordResetFormComponent implements OnInit {
  @Input() mode: PasswordAction;
  @Input() namespace: string;
  @Input() login: string;
  @Input() token: string;
  @Input() authWithoutToken: boolean;

  loading = false;
  success = false;
  successMsg: string;
  error: RPCError;
  errorMsg: string;
  errorKey: keyof PasswordLabel;
  language = 'en';
  newPasswdForm: FormGroup<{
    passwordCtrl: FormControl<string>;
    passwordAgainCtrl: FormControl<string>;
  }>;
  labels: PasswordLabels;

  constructor(
    private storeService: StoreService,
    private translate: TranslateService,
    private apiRequestConfiguration: ApiRequestConfigurationService,
    private usersService: UsersManagerService,
    private formBuilder: FormBuilder,
    private errorTranslate: ErrorTranslateService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.newPasswdForm = this.formBuilder.group(
      {
        passwordCtrl: [
          '',
          Validators.required,
          [
            loginAsyncValidator(
              this.namespace,
              this.usersService,
              this.apiRequestConfiguration,
              !this.authWithoutToken,
            ),
          ],
        ],
        passwordAgainCtrl: ['', Validators.required],
      },
      {
        validators: CustomValidators.passwordMatchValidator as ValidatorFn,
      },
    );
    this.setLabels(this.translate.currentLang);

    this.translate.onLangChange.subscribe((lang) => {
      this.language = lang.lang;
      this.setLabels(this.language);
      this.successMsg = this.getMessage('success');
      if (this.errorKey) {
        this.errorMsg = this.getMessage(this.errorKey);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    of(this.authWithoutToken)
      .pipe(
        mergeMap((withToken) =>
          iif(
            () => withToken,
            this.usersService.changePasswordForLogin({
              login: this.login,
              namespace: this.namespace,
              newPassword: this.newPasswdForm.value.passwordCtrl,
            }),
            this.usersService.changeNonAuthzPasswordByToken(
              {
                token: this.token,
                password: this.newPasswdForm.value.passwordCtrl,
              },
              true,
            ),
          ),
        ),
      )
      .subscribe({
        next: () => {
          this.success = true;
          this.successMsg = this.getMessage('success');
          this.loading = false;
        },
        error: (e: RPCError) => {
          this.error = e;
          this.errorKey = this.errorTranslate.getErrorKey(e);
          this.errorMsg = this.getMessage(this.errorKey);
          this.loading = false;
        },
      });
  }

  onBugReportClick(): void {
    const config = getDefaultDialogConfig();
    config.width = '550px';
    config.data = { error: this.error };
    config.autoFocus = false;

    this.dialog.open(BugReportDialogComponent, config);
  }

  private setLabels(lang: string): void {
    this.labels = this.storeService.getProperty(
      lang === 'en' ? 'password_labels' : 'password_labels_cs',
    );
  }

  private getMessage<K extends keyof PasswordLabel>(key: K): PasswordLabel[K] {
    const msg = this.labels?.[this.namespace]?.[this.mode]?.[key];
    if (!msg) {
      return this.labels['default'][this.mode][key];
    }
    return msg;
  }
}
