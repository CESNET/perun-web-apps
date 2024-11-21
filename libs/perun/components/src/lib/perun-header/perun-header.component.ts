import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AuthService,
  NotificationStorageService,
  OtherApplicationsService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { ShowNotificationHistoryDialogComponent } from '@perun-web-apps/perun/dialogs';
import { AppType } from '@perun-web-apps/perun/models';
import { ActivatedRoute } from '@angular/router';
import { ChangeNameService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'perun-web-apps-header',
  templateUrl: './perun-header.component.html',
  styleUrls: ['./perun-header.component.scss'],
})
export class PerunHeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter();
  @Input() showToggle = true;
  @Input() showLanguageMenu = false;
  @Input() showOtherApps = true;
  @Input() showNotifications = false;
  @Input() disableLogo = false;
  @Input() logoutEnabled: boolean = null;
  @Input() showUserName = true;

  label = this.storeService.getProperty('header_label_en');
  principal = this.storeService.getPerunPrincipal();

  bgColor = this.storeService.getProperty('theme').nav_bg_color;
  textColor = this.storeService.getProperty('theme').nav_text_color;
  iconColor = this.storeService.getProperty('theme').nav_icon_color;
  navTextColor = this.storeService.getProperty('theme').nav_text_color;

  logo: SafeHtml;

  otherAppLabels: Record<string, string>;
  otherApps: AppType[];
  otherAppUrls: Record<string, string> = {};
  linkRoles: string[];
  activeLink = false;

  constructor(
    private storeService: StoreService,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private otherApplicationService: OtherApplicationsService,
    private notificationStorageService: NotificationStorageService,
    private dialog: MatDialog,
    private changeNameService: ChangeNameService,
    public route: ActivatedRoute,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.changeNameService.getNameChange().subscribe(() => {
      this.principal = this.storeService.getPerunPrincipal();
    });
    this.otherAppLabels = this.storeService.getProperty('other_apps')
      ? this.storeService.getProperty('other_apps')['en'] || {}
      : {};
    this.otherApps = Object.keys(this.otherAppLabels).map((app) => app as AppType);

    this.translateService.onLangChange.subscribe((lang) => {
      this.label = this.storeService.getProperty(
        lang.lang === 'en' ? 'header_label_en' : 'header_label_cs',
      );
      this.otherAppLabels = this.storeService.getProperty('other_apps')
        ? this.storeService.getProperty('other_apps')[lang.lang] || {}
        : {};
      this.otherApps = Object.keys(this.otherAppLabels).map((app) => app as AppType);
    });

    this.logo = this.sanitizer.bypassSecurityTrustHtml(this.storeService.getProperty('logo'));

    if (this.logoutEnabled === null) {
      this.logoutEnabled = this.storeService.getProperty('log_out_enabled');
    }

    if (this.showOtherApps) {
      this.isLinkToOtherAppActive();
    }

    if (!this.principal) {
      this.showNotifications = false;
      this.showToggle = false;
      this.showLanguageMenu = false;
      this.showOtherApps = false;
      this.showUserName = false;
    }
  }

  isLinkToOtherAppActive(): void {
    if (this.otherApps.includes(AppType.Admin)) {
      this.linkRoles = this.storeService.getProperty('link_to_admin_gui_by_roles');

      for (const roleKey in this.storeService.getPerunPrincipal()?.roles ?? {}) {
        if (this.linkRoles.includes(roleKey)) {
          this.activeLink = true;
        }
      }
    }

    if (!this.otherApps.includes(AppType.Admin) || this.activeLink) {
      for (const key of this.otherApps) {
        this.otherAppUrls[key] = this.otherApplicationService.getUrlForOtherApplication(key);
      }
    }
  }

  onToggleSidenav = (): void => {
    this.sidenavToggle.emit();
  };

  changeLanguage(): void {
    const newLang = this.translateService.currentLang === 'en' ? 'cs' : 'en';
    this.translateService.use(newLang);
  }

  showNotificationHistory(): void {
    this.notificationStorageService.newNotificationsCount = 0;

    const config = getDefaultDialogConfig();
    config.width = '520px';

    this.dialog.open(ShowNotificationHistoryDialogComponent, config);
  }

  getNewNotificationsCount(): number {
    return this.notificationStorageService.newNotificationsCount;
  }

  redirectToUrl(url: string): void {
    window.open(url, '_blank');
  }

  onLogOut(): void {
    this.authService.logout();
  }
}
