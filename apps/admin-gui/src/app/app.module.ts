import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from './shared/shared.module';
import { MainMenuPageComponent } from './main-menu-page/main-menu-page.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreModule} from './core/core.module';
import {RouteReuseStrategy} from '@angular/router';
import {CacheRouteReuseStrategy} from './core/services/common/cache-route-reuse-strategy';
import {MatIconModule} from '@angular/material';
import {CustomIconService} from './core/services/api/custom-icon.service';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { ApiService } from './core/services/api/api.service';
import { AppConfigService } from './core/services/common/app-config.service';
import { ApiModule } from '@perun-web-apps/perun/openapi';
import { ApiConfiguration } from '../../../../libs/perun/openapi/src/lib/api-configuration';
import { StoreService } from './core/services/common/store.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function ApiConfigurationFactory(store: StoreService): ApiConfiguration {
  return {
    rootUrl: store.get('api_url')
  };
}

const loadConfigs = (appConfig: AppConfigService) => {
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ApiModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [AppConfigService]
    },
    {
      provide: ApiConfiguration,
      useFactory: ApiConfigurationFactory,
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
