import { MatTooltip } from '@angular/material/tooltip';
import { PerunFooterComponent, PerunHeaderComponent } from '@perun-web-apps/perun/components';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AttributesManagerService,
  PerunPrincipal,
  UsersManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  InitAuthService,
  PreferredLanguageService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { parseQueryParams } from '@perun-web-apps/perun/utils';
import { PasswordAction } from '@perun-web-apps/perun/models';
import { PasswordResetPageComponent } from './pages/password-reset-page/password-reset-page.component';
import { LoginScreenBaseComponent, PerunLoginModule } from '@perun-web-apps/perun/login';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    PerunFooterComponent,
    PerunHeaderComponent,
    MatTooltip,
    PasswordResetPageComponent,
    LoginScreenBaseComponent,
    PerunLoginModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('footer') footer: ElementRef<HTMLElement>;
  mode: PasswordAction;
  token: string;
  namespace: string;
  login: string;
  validToken: boolean;
  authWithoutToken = false;
  displayWarning: boolean = this.store.getProperty('display_warning');
  warningMessage: string = this.store.getProperty('warning_message');
  contentHeight = this.displayWarning ? 'calc(100vh - 132px)' : 'calc(100vh - 84px)';
  contentBackgroundColor = this.store.getProperty('theme').content_bg_color;
  isServiceAccess: boolean;
  showLoginScreen: boolean;
  principal: PerunPrincipal;

  constructor(
    private dialog: MatDialog,
    private usersService: UsersManagerService,
    private preferredLangService: PreferredLanguageService,
    private translateService: TranslateService,
    private store: StoreService,
    private attributesManagerService: AttributesManagerService,
    private changeDetector: ChangeDetectorRef,
    private initAuth: InitAuthService,
  ) {}

  ngOnInit(): void {
    this.principal = this.store.getPerunPrincipal();
    this.isServiceAccess = this.initAuth.isServiceAccessLoginScreenShown();
    this.showLoginScreen = this.initAuth.isLoginScreenShown();
    sessionStorage.removeItem('baLogout');
    const prefLang = this.preferredLangService.getPreferredLanguage(null);
    this.translateService.use(prefLang);

    const queryParams = location.search.substr(1);
    this.mode = parseQueryParams('mode', queryParams) === 'activation' ? 'activation' : 'reset';
    this.namespace = parseQueryParams('namespace', queryParams);

    // If namespace not set, use default namespace
    if (this.namespace.length === 0) {
      this.namespace = this.store.getProperty('default_namespace');
    }

    if (queryParams.includes('token')) {
      this.token = parseQueryParams('token', queryParams);

      this.usersService
        .checkPasswordResetRequestByTokenIsValid({ token: this.token }, true)
        .subscribe({
          next: () => {
            this.validToken = true;
          },
          error: () => {
            this.validToken = false;
          },
        });
    } else if (!this.isServiceAccess && !this.showLoginScreen) {
      this.authWithoutToken = true;
      if (this.principal?.userId) {
        this.attributesManagerService.getLogins(this.principal.userId).subscribe((logins) => {
          const selectedLogin = logins.find(
            (login) => login.friendlyNameParameter === this.namespace,
          );
          this.login = selectedLogin ? String(selectedLogin.value) : '';
        });
      }
    }
  }

  ngAfterViewInit(): void {
    const footerHeight: string = this.footer?.nativeElement?.offsetHeight?.toString() ?? '0';
    this.contentHeight =
      (this.displayWarning ? 'calc(100vh - 132px - ' : 'calc(100vh - 84px - ') +
      footerHeight +
      'px)';
    this.changeDetector.detectChanges();
  }

  getNavMenuTop(): string {
    return this.displayWarning ? '48px' : '0';
  }

  getSideNavMarginTop(): string {
    return this.displayWarning ? '112px' : '64px';
  }
}
