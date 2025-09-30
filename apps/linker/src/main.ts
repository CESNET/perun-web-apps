import {
  APP_INITIALIZER,
  enableProdMode,
  forwardRef,
  importProvidersFrom,
  Provider,
} from '@angular/core';

import { environment } from './environments/environment';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import {
  ApiInterceptor,
  ApiService,
  CustomIconService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { LinkerConfigService } from './app/service/linker-config.service';
import { ApiModule, Configuration, ConfigurationParameters } from '@perun-web-apps/perun/openapi';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { appRoutes } from './app/app.routes';
import { UiMaterialModule } from '@perun-web-apps/ui/material';
import { PerunLoginModule } from '@perun-web-apps/perun/login';
import { MatIconModule } from '@angular/material/icon';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { UiLoadersModule } from '@perun-web-apps/ui/loaders';
import { isRunningLocally, PerunUtilsModule } from '@perun-web-apps/perun/utils';
import { GeneralModule } from '@perun-web-apps/general';
import { LibLinkerModule } from '@perun-web-apps/lib-linker';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app/app.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';

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

const loadConfigs = (appConfig: LinkerConfigService) => (): Promise<void> =>
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
      BrowserAnimationsModule,
      HttpClientModule,
      ApiModule,
      UiMaterialModule,
      PerunLoginModule,
      MatIconModule,
      PerunSharedComponentsModule,
      UiAlertsModule,
      UiLoadersModule,
      PerunUtilsModule,
      GeneralModule,
      OAuthModule.forRoot(),
      LibLinkerModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
    ),
    provideRouter(appRoutes),
    CustomIconService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [LinkerConfigService],
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
    { provide: OAuthStorage, useFactory: (): OAuthStorage => localStorage },
  ],
}).catch((err) => console.error(err));
