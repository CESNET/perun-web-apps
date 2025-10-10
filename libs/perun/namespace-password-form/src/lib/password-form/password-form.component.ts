import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImmediateStateMatcher } from '../perun-namespace-password-form';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { Attribute, UsersManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    UiAlertsModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
  ],
  standalone: true,
  selector: 'perun-web-apps-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements OnInit, OnChanges {
  @Input() formGroup: UntypedFormGroup;
  @Input() passwordRequired = true;
  @Input() tooltipPwdViaEmail = false;
  @Input() tooltipPwdDisabledForNamespace = false;
  @Input() namespace: string;
  @Input() language = 'en';

  passwordRequirement: string = null;
  showNewPassword = false;
  showPasswordConfirm = false;
  passwordStateMatcher: ImmediateStateMatcher = new ImmediateStateMatcher();
  private allPasswordRequirements = this.store.getProperty('password_help');

  constructor(
    private translator: TranslateService,
    private usersManagerService: UsersManagerService,
    private store: StoreService,
  ) {}

  ngOnInit(): void {
    if (window.location.href.includes('/profile')) {
      this.usersManagerService
        .getRichUserWithAttributes(this.store.getPerunPrincipal().userId)
        .subscribe((richUser) => {
          const languageAttribute: Attribute = richUser.userAttributes.find(
            (att) => att.friendlyName === 'preferredLanguage',
          );
          this.language = (languageAttribute?.value as string) ?? 'en';

          if (this.language !== 'en') {
            this.allPasswordRequirements = this.store.getProperty(
              this.language === 'en' ? 'password_help' : 'password_help_cs',
            );
          }

          this.changeHelp();
        });
    } else {
      this.changeHelp();
    }
  }

  ngOnChanges(): void {
    this.allPasswordRequirements = this.store.getProperty(
      this.language === 'en' ? 'password_help' : 'password_help_cs',
    );

    this.changeHelp();
  }

  getPasswordDisabledTooltip(): string {
    if (this.namespace === null) {
      return this.translator.instant(
        'DIALOGS.CREATE_SPONSORED_MEMBER.NO_NAMESPACE_SELECTED',
      ) as string;
    }

    if (this.tooltipPwdViaEmail) {
      return this.translator.instant(
        'SHARED_LIB.PERUN.COMPONENTS.PASSWORD_FORM_FIELD.TOOLTIP_PASSWORD_VIA_EMAIL',
      ) as string;
    } else {
      return this.translator.instant(
        'SHARED_LIB.PERUN.COMPONENTS.PASSWORD_FORM_FIELD.TOOLTIP_PASSWORD_DISABLED',
      ) as string;
    }
  }

  getErrorTooltip(): string {
    let err: string = this.formGroup.get('passwordCtrl').getError('backendError') as string;
    if (err) {
      err = err.replace(':null', '');
    }
    return err;
  }

  changeHelp(): void {
    this.passwordRequirement = this.allPasswordRequirements[this.namespace];
    if (!this.passwordRequirement) {
      this.passwordRequirement = this.allPasswordRequirements['default'];
    }
  }
}
