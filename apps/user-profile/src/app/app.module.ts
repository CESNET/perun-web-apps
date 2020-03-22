import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { IdentitiesPageComponent } from './pages/identities-page/identities-page.component';
import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { VosPageComponent } from './pages/vos-page/vos-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Configuration, ConfigurationParameters } from '@perun-web-apps/perun/openapi';
import { SettingsOverviewComponent } from './pages/settings-page/settings-overview/settings-overview.component';
import { SettingsSSHKeysComponent } from './pages/settings-page/settings-ssh-keys/settings-ssh-keys.component';
import { SettingsPreferredUnixGroupNamesComponent } from './pages/settings-page/settings-preferred-unix-group-names/settings-preferred-unix-group-names.component';
import { SettingsPreferredShellsComponent } from './pages/settings-page/settings-preferred-shells/settings-preferred-shells.component';
import { SettingsDataQuotasComponent } from './pages/settings-page/settings-data-quotas/settings-data-quotas.component';
import { SettingsAlternativePasswordsComponent } from './pages/settings-page/settings-alternative-passwords/settings-alternative-passwords.component';
import { SettingsSambaPasswordComponent } from './pages/settings-page/settings-samba-password/settings-samba-password.component';
import { SettingsMailingListsComponent } from './pages/settings-page/settings-mailing-lists/settings-mailing-lists.component';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { SharedModule } from '../../../admin-gui/src/app/shared/shared.module';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CustomIconService, StoreService } from '@perun-web-apps/perun/services';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserProfileConfigService } from './services/user-profile-config.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { BreadcrumbModule } from 'angular-crumbs';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { ChangeEmailDialogComponent } from './components/dialogs/change-email-dialog/change-email-dialog.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { SshKeysListComponent } from './components/ssh-keys-list/ssh-keys-list.component';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { AddSshDialogComponent } from './components/dialogs/add-ssh-dialog/add-ssh-dialog.component';
import { RemoveSshDialogComponent } from './components/dialogs/remove-ssh-dialog/remove-ssh-dialog.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function apiConfigFactory(store: StoreService): Configuration {
  const params: ConfigurationParameters = {
    basePath: store.get('api_url')
  };
  return new Configuration(params);
}

const loadConfigs = (appConfig: UserProfileConfigService) => {
  return () => {
    return appConfig.loadConfigs();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    ProfilePageComponent,
    IdentitiesPageComponent,
    GroupsPageComponent,
    VosPageComponent,
    ServicesPageComponent,
    SettingsPageComponent,
    SettingsOverviewComponent,
    SettingsSSHKeysComponent,
    SettingsPreferredUnixGroupNamesComponent,
    SettingsPreferredShellsComponent,
    SettingsDataQuotasComponent,
    SettingsAlternativePasswordsComponent,
    SettingsSambaPasswordComponent,
    SettingsMailingListsComponent,
    SideMenuComponent,
    HeaderComponent,
    FooterComponent,
    PrivacyPageComponent,
    HomePageComponent,
    ChangeEmailDialogComponent,
    SshKeysListComponent,
    AddSshDialogComponent,
    RemoveSshDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatButtonModule,
    SharedModule,
    FlexLayoutModule,
    MatToolbarModule,
    BreadcrumbModule,
    PerunSharedComponentsModule,
    MatTableExporterModule,
    UiAlertsModule
  ],
  providers: [
    CustomIconService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [UserProfileConfigService]
    },
    {
      provide: Configuration,
      useFactory: apiConfigFactory,
      deps:[StoreService]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private customIconService: CustomIconService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.customIconService.registerPerunRefreshIcon();
  }
}
