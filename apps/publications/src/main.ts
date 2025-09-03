import {
  APP_INITIALIZER,
  enableProdMode,
  forwardRef,
  importProvidersFrom,
  Provider,
} from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  ApiInterceptor,
  ApiService,
  CustomIconService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { PublicationsConfigService } from './app/services/publications-config.service';
import { ApiModule, Configuration, ConfigurationParameters } from '@perun-web-apps/perun/openapi';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiMaterialModule } from '@perun-web-apps/ui/material';
import { GeneralModule } from '@perun-web-apps/general';
import { AppRoutingModule } from './app/app-routing.module';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { UiLoadersModule } from '@perun-web-apps/ui/loaders';
import { PerunPipesModule } from '@perun-web-apps/perun/pipes';
import { PerunLoginModule } from '@perun-web-apps/perun/login';
import { MatTabsModule } from '@angular/material/tabs';
import { isRunningLocally, PerunUtilsModule } from '@perun-web-apps/perun/utils';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { PerunTableUtilsModule } from '@perun-web-apps/perun/table-utils';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => ApiInterceptor),
  multi: true,
};

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function apiConfigFactory(store: StoreService): Configuration {
  const params: ConfigurationParameters = {
    basePath: store.getProperty('api_url'),
    withCredentials: !isRunningLocally() /* add cookies to keep same session for BA access */,
  };
  return new Configuration(params);
}
const loadConfigs: (appConfig: PublicationsConfigService) => () => Promise<void> =
  (appConfig: PublicationsConfigService) => () =>
    appConfig.loadConfigs();

// Factory function to initialize services after app bootstrap
const initializeApp = (
  customIconService: CustomIconService,
  translate: TranslateService,
): (() => Promise<void>) => {
  return () => {
    translate.setDefaultLang('en');
    translate.use('en');
    customIconService.registerPerunRefreshIcon();
    return Promise.resolve();
  };
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
      BrowserAnimationsModule,
      UiMaterialModule,
      GeneralModule,
      ApiModule,
      HttpClientModule,
      AppRoutingModule,
      UiAlertsModule,
      UiLoadersModule,
      PerunPipesModule,
      PerunLoginModule,
      MatTabsModule,
      PerunUtilsModule,
      OAuthModule.forRoot(),
      PerunSharedComponentsModule,
      PerunTableUtilsModule,
    ),
    CustomIconService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [PublicationsConfigService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [CustomIconService, TranslateService],
    },
    {
      provide: Configuration,
      useFactory: apiConfigFactory,
      deps: [StoreService],
    },
    ApiInterceptor,
    API_INTERCEPTOR_PROVIDER,
    {
      provide: PERUN_API_SERVICE,
      useClass: ApiService,
    },
    MomentDateModule,
    { provide: OAuthStorage, useFactory: (): OAuthStorage => localStorage },
  ],
}).catch((err) => console.error(err));
