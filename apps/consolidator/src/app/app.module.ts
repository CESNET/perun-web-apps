import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UiModule } from '@perun-web-apps/ui';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiMaterialModule } from '@perun-web-apps/ui/material';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { IdentitiesComponent } from './components/identities/identities.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AddIdentityDialogComponent } from './components/add-identity-dialog/add-identity-dialog.component';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { ApiService } from './services/api.service';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { FederationSelectComponent } from './components/federation-select/federation-select.component';
import { IdentityTypeSelectionComponent } from './components/identity-type-selection/identity-type-selection.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { NewIdentityPageComponent } from './pages/new-identity-page/new-identity-page.component';
import { ConsolidatePageComponent } from './pages/consolidate-page/consolidate-page.component';
import { APP_BASE_HREF } from '@angular/common';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { ConsolidationErrorPipe } from './components/consolidation-error.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, HomePageComponent, IdentitiesComponent, AddIdentityDialogComponent, WelcomePageComponent, FederationSelectComponent, IdentityTypeSelectionComponent, ConfirmationComponent, NewIdentityPageComponent, ConsolidatePageComponent, ConsolidationErrorPipe],
  imports: [
    AppRoutingModule,
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
    UiModule,
    UiMaterialModule,
    UiAlertsModule
  ],
  providers: [
    {
      provide: PERUN_API_SERVICE,
      useClass: ApiService
    },
    {
      provide: APP_BASE_HREF,
      useValue: window['_app_base'] || '/krb/nic'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
