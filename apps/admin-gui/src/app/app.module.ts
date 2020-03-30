import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, forwardRef, NgModule, Provider } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/shared.module';
import { MainMenuPageComponent } from './main-menu-page/main-menu-page.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from './core/core.module';
import {RouteReuseStrategy} from '@angular/router';
import {CacheRouteReuseStrategy} from './core/services/common/cache-route-reuse-strategy';
import { MatIconModule } from '@angular/material/icon';
import {CustomIconService} from '@perun-web-apps/perun/services';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { ApiService } from './core/services/api/api.service';
import { AdminGuiConfigService } from './core/services/common/admin-gui-config.service';
// @ts-ignore
import { ApiModule, Configuration, ConfigurationParameters } from '@perun-web-apps/perun/openapi';
// @ts-ignore
import { StoreService } from '@perun-web-apps/perun/services';
import { ApiInterceptor } from './core/services/api/ApiInterceptor';
import { GeneralModule } from '@perun-web-apps/general';


export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => ApiInterceptor),
  multi: true
};

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// export function ApiConfigurationFactory(store: StoreService): ApiConfiguration {
//   return {
//     rootUrl: store.get('api_url')
//   };
// }

export function apiConfigFactory(store: StoreService): Configuration {
  const params: ConfigurationParameters = {
    basePath: store.get('api_url')
    // set configuration parameters here.
  };
  return new Configuration(params);
}

const loadConfigs = (appConfig: AdminGuiConfigService) => {
  return () => {
    return appConfig.loadConfigs();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    MainMenuPageComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    AppRoutingModule,
    MatIconModule,
    GeneralModule,
    ApiModule,
  ],
  providers: [
    AdminGuiConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [AdminGuiConfigService]
    },
    // {
    //   provide: ApiConfiguration,
    //   useFactory: ApiConfigurationFactory,
    //   deps: [StoreService]
    // },
    {
      provide: Configuration,
      useFactory: apiConfigFactory,
      deps: [StoreService]
    },
    {
    provide: RouteReuseStrategy,
    useClass: CacheRouteReuseStrategy
    },
    CustomIconService,
    {
      provide: PERUN_API_SERVICE,
      useClass: ApiService
    },
    ApiInterceptor,
    API_INTERCEPTOR_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    private customIconService: CustomIconService,
  ) {
    // this.translate.setLang('en');
    // this.translate.setDefaultLang('en');
    // this.translate.use('en');
    this.customIconService.registerPerunRefreshIcon();
  }
}
