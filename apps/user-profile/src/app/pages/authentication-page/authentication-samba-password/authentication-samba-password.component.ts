import { CustomTranslatePipe } from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Attribute,
  AttributesManagerService,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import { NotificatorService, StoreService } from '@perun-web-apps/perun/services';
import { UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    UiAlertsModule,
    CustomTranslatePipe,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-authentication-samba-password',
  templateUrl: './authentication-samba-password.component.html',
  styleUrls: ['./authentication-samba-password.component.scss'],
})
export class AuthenticationSambaPasswordComponent implements OnInit {
  showPassword: boolean;
  sambaExists: boolean;
  sambaAttribute: Attribute;
  sambaControl: UntypedFormControl;
  userId: number;
  showPwdTooltip: string;
  hidePwdTooltip: string;
  successMessage: string;

  constructor(
    private attributesManagerService: AttributesManagerService,
    private store: StoreService,
    private usersManagerService: UsersManagerService,
    private notificator: NotificatorService,
    private translate: TranslateService,
  ) {
    translate
      .get('SAMBA_PASSWORD.SUCCESS_MESSAGE')
      .subscribe((res: string) => (this.successMessage = res));
    translate
      .get('SAMBA_PASSWORD.SHOW_PWD_TOOLTIP')
      .subscribe((res: string) => (this.showPwdTooltip = res));
    translate
      .get('SAMBA_PASSWORD.HIDE_PWD_TOOLTIP')
      .subscribe((res: string) => (this.hidePwdTooltip = res));
  }

  ngOnInit(): void {
    this.userId = this.store.getPerunPrincipal().userId;
    this.sambaControl = new UntypedFormControl('', [
      Validators.pattern(
        '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&/=?_.,:;\\-])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&/=?_.,:;\\-])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&/=?_.,:;\\-])).{3,}',
      ),
    ]);
    this.getSambaAttribute();
  }

  setSambaPassword(): void {
    this.sambaAttribute.value = this.sambaControl.value as object;

    const timestamp = new Date().getTime().toString();
    this.usersManagerService
      .createAlternativePassword({
        user: this.userId,
        description: timestamp,
        loginNamespace: 'samba-du',
        password: this.sambaControl.value as string,
      })
      .subscribe(() => {
        this.sambaControl.setValue('');
        this.getSambaAttribute();
        this.notificator.showSuccess(this.successMessage);
      });
  }

  getSambaAttribute(): void {
    this.attributesManagerService
      .getUserAttributeByName(this.userId, 'urn:perun:user:attribute-def:def:altPasswords:samba-du')
      .subscribe((att) => {
        this.sambaExists = !!att.value;
        this.sambaAttribute = att;
      });
  }
}
