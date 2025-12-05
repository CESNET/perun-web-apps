import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StoreService } from '@perun-web-apps/perun/services';
import { PasswordAction } from '@perun-web-apps/perun/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PasswordResetFormComponent } from '../../components/password-reset-form/password-reset-form.component';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';

@Component({
  imports: [CommonModule, TranslateModule, PasswordResetFormComponent, UiAlertsModule],
  standalone: true,
  selector: 'perun-web-apps-password-reset-page',
  templateUrl: './password-reset-page.component.html',
  styleUrls: ['./password-reset-page.component.scss'],
})
export class PasswordResetPageComponent implements OnInit {
  @Input() mode: PasswordAction;
  @Input() token: string;
  @Input() namespace: string;
  @Input() login: string;
  @Input() validToken: boolean;
  @Input() validNamespace: boolean;
  @Input() authWithoutToken: boolean;

  passwordResetLogo: SafeHtml;
  description: string;

  constructor(
    private storeService: StoreService,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.passwordResetLogo = this.sanitizer.bypassSecurityTrustHtml(
      this.storeService.getProperty('password_reset_logo'),
    );
    this.setDescription(this.translateService.currentLang);
    this.translateService.onLangChange.subscribe((lang) => {
      this.setDescription(lang.lang);
    });
  }

  private setDescription(lang: string): void {
    const passwordLabels = this.storeService.getProperty(
      lang === 'en' ? 'password_labels' : 'password_labels_cs',
    );
    this.description = passwordLabels[this.namespace]?.[this.mode]?.description;
    if (!this.description) {
      this.description = passwordLabels['default'][this.mode].description;
    }
  }
}
