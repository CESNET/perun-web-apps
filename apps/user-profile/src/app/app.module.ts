import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { ApiService } from '../../../admin-gui/src/app/core/services/api/api.service';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatIconModule } from '@angular/material';
import { CustomIconService } from '../../../admin-gui/src/app/core/services/api/custom-icon.service';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { IdentitiesPageComponent } from './pages/identities-page/identities-page.component';
import { GroupsPageComponent } from './pages/groups-page/groups-page.component';
import { VosPageComponent } from './pages/vos-page/vos-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ProfilePageComponent,
    IdentitiesPageComponent,
    GroupsPageComponent,
    VosPageComponent,
    ServicesPageComponent,
    SettingsPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    MatIconModule
  ],
  providers: [
    {
      provide: PERUN_API_SERVICE,
      useClass: ApiService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    // private customIconService: CustomIconService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    // this.customIconService.registerPerunRefreshIcon();
  }
}
