import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AuthService,
  GuiAuthResolver,
  NotificationStorageService,
  OtherApplicationsService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MatDialog } from '@angular/material/dialog';
import { AppType } from '@perun-web-apps/perun/models';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChangeNameService } from '@perun-web-apps/perun/services';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';
import { MatBadge } from '@angular/material/badge';
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { ShowNotificationHistoryDialogComponent } from '../show-notification-history-dialog/show-notification-history-dialog.component';
import { GuiConfigurationComponent } from '../gui-configuration/gui-configuration.component';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    TranslateModule,
    MatTooltip,
    UserFullNamePipe,
    MatBadge,
    GlobalSearchComponent,
    GuiConfigurationComponent,
  ],
  standalone: true,
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
  @Input() showSearch = false;

  label = this.storeService.getProperty('header_label_en');
  principal = this.storeService.getPerunPrincipal();

  bgColor = this.storeService.getProperty('theme').nav_bg_color;
  textColor = this.storeService.getProperty('theme').nav_text_color;
  iconColor = this.storeService.getProperty('theme').nav_icon_color;
  navTextColor = this.storeService.getProperty('theme').nav_text_color;

  logo: SafeHtml;

  otherAppLabels: Record<string, string>;
  otherAppLabelsCustom: Record<string, string>;
  otherApps: AppType[];
  otherAppUrls: Record<string, string> = {};
  linkRoles: string[];
  activeLink = false;
  searchEnabled = false;
  searchAsAdmin = false;
  guiConfigPanelEnabled = false;

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
    private guiAuthResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.changeNameService.getNameChange().subscribe(() => {
      this.principal = this.storeService.getPerunPrincipal();
    });
    this.otherAppLabels = this.storeService.getProperty('other_apps')
      ? this.storeService.getProperty('other_apps')['en'] || {}
      : {};
    this.otherApps = Object.keys(this.otherAppLabels).map((app) => app as AppType);

    this.otherAppLabelsCustom = this.storeService.getProperty('other_apps_custom')
      ? this.storeService.getProperty('other_apps_custom')['en'] || {}
      : {};

    this.translateService.onLangChange.subscribe((lang) => {
      this.label = this.storeService.getProperty(
        lang.lang === 'en' ? 'header_label_en' : 'header_label_cs',
      );
      this.otherAppLabels = this.storeService.getProperty('other_apps')
        ? this.storeService.getProperty('other_apps')[lang.lang] || {}
        : {};
      this.otherApps = Object.keys(this.otherAppLabels).map((app) => app as AppType);

      this.otherAppLabelsCustom = this.storeService.getProperty('other_apps_custom')
        ? this.storeService.getProperty('other_apps_custom')[lang.lang] || {}
        : {};
    });

    this.logo = this.sanitizer.bypassSecurityTrustHtml(this.storeService.getProperty('logo'));

    if (this.logoutEnabled === null) {
      this.logoutEnabled = this.storeService.getProperty('log_out_enabled');
    }

    if (this.showSearch) {
      this.searchEnabled = this.guiAuthResolver.isAuthorized('globalSearch_String_policy', []);
      this.searchAsAdmin = this.guiAuthResolver.isPerunAdminOrObserver();
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

    if (this.storeService.getProperty('gui_settings_panel')) {
      this.guiConfigPanelEnabled = true;
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
