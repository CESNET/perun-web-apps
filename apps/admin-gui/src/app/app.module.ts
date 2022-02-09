import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, forwardRef, NgModule, Provider } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MainMenuPageComponent } from './main-menu-page/main-menu-page.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { RouteReuseStrategy } from '@angular/router';
import { CacheRouteReuseStrategy } from './core/services/common/cache-route-reuse-strategy';
import { MatIconModule } from '@angular/material/icon';
import { CustomIconService } from '@perun-web-apps/perun/services';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { ApiService } from '@perun-web-apps/perun/services';
import { AdminGuiConfigService } from './core/services/common/admin-gui-config.service';
import { ApiModule, Configuration, ConfigurationParameters } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';
import { ApiInterceptor } from '@perun-web-apps/perun/services';
import { GeneralModule } from '@perun-web-apps/general';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from 'ngx-perfect-scrollbar';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { PerunLoginModule } from '@perun-web-apps/perun/login';
import { OAuthModule } from 'angular-oauth2-oidc';

export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => ApiInterceptor),
  multi: true,
};

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function apiConfigFactory(store: StoreService): Configuration {
  const params: ConfigurationParameters = {
    basePath: store.get('api_url'),
    // set configuration parameters here.
  };
  return new Configuration(params);
}

const loadConfigs = (appConfig: AdminGuiConfigService) => () => appConfig.initialize();

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [AppComponent, MainMenuPageComponent],
  imports: [
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
    PerfectScrollbarModule,
    PerunSharedComponentsModule,
    PerunLoginModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    AdminGuiConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [AdminGuiConfigService],
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
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private customIconService: CustomIconService, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.customIconService.registerPerunRefreshIcon();
  }
}
