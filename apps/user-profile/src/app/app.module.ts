import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { ApiService } from '../../../admin-gui/src/app/core/services/api/api.service';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatButtonModule, MatIconModule, MatListModule, MatSidenavModule } from '@angular/material';
import { CustomIconService } from '../../../admin-gui/src/app/core/services/api/custom-icon.service';
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
import { SharedModule } from '../../../admin-gui/src/app/shared/shared.module';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: 'http://localhost/krb/rpc'
  };
  return new Configuration(params);
}

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
    SideMenuComponent
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
    SharedModule
  ],
  providers: [
    CustomIconService,
    {
      provide: Configuration,
      useFactory: apiConfigFactory,
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
