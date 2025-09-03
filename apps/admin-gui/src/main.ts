import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, forwardRef, Provider } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module';
import { SharedModule } from './app/shared/shared.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './app/core/core.module';
import { RouteReuseStrategy } from '@angular/router';
import { CacheRouteReuseStrategy } from './app/core/services/common/cache-route-reuse-strategy';
import { MatIconModule } from '@angular/material/icon';
import {
  ApiInterceptor,
  ApiService,
  CustomIconService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { AdminGuiConfigService } from './app/core/services/common/admin-gui-config.service';
import { ApiModule, Configuration, ConfigurationParameters } from '@perun-web-apps/perun/openapi';
import { GeneralModule } from '@perun-web-apps/general';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarModule } from 'ngx-scrollbar';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { PerunLoginModule } from '@perun-web-apps/perun/login';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { isRunningLocally } from '@perun-web-apps/perun/utils';
import { environment } from './environments/environment';

export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => ApiInterceptor),
  multi: true,
};

export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function apiConfigFactory(store: StoreService): Configuration {
  const params: ConfigurationParameters = {
    basePath: store.getProperty('api_url'),
    withCredentials: !isRunningLocally() /* add cookies to keep same session for BA access */,
  };
  return new Configuration(params);
}

const loadConfigs: (appConfig: AdminGuiConfigService) => () => Promise<void> =
  (appConfig: AdminGuiConfigService) => () =>
    appConfig.initialize();

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
      BrowserAnimationsModule,
      BrowserModule,
      HttpClientModule,
      SharedModule,
      CoreModule,
      AppRoutingModule,
      MatIconModule,
      GeneralModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      ApiModule,
      PerunSharedComponentsModule,
      PerunLoginModule,
      NgScrollbarModule,
      OAuthModule.forRoot(),
    ),
    AdminGuiConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [AdminGuiConfigService],
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
    {
      provide: RouteReuseStrategy,
      useClass: CacheRouteReuseStrategy,
    },
    CustomIconService,
    {
      provide: PERUN_API_SERVICE,
      useClass: ApiService,
    },
    ApiInterceptor,
    API_INTERCEPTOR_PROVIDER,
    { provide: OAuthStorage, useFactory: (): OAuthStorage => localStorage },
    {
      provide: NG_SCROLLBAR_OPTIONS,
      useValue: {
        autoWidthDisabled: false,
        visibility: 'hover',
      },
    },
  ],
}).catch((err) => console.error(err));
