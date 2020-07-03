import { __decorate, __metadata } from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, forwardRef, NgModule } from '@angular/core';
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
// @ts-ignore
import { ApiModule, Configuration } from '@perun-web-apps/perun/openapi';
// @ts-ignore
import { StoreService } from '@perun-web-apps/perun/services';
import { ApiInterceptor } from '@perun-web-apps/perun/services';
import { GeneralModule } from '@perun-web-apps/general';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
export const API_INTERCEPTOR_PROVIDER = {
    provide: HTTP_INTERCEPTORS,
    useExisting: forwardRef(() => ApiInterceptor),
    multi: true
};
export function HttpLoaderFactory(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// export function ApiConfigurationFactory(store: StoreService): ApiConfiguration {
//   return {
//     rootUrl: store.get('api_url')
//   };
// }
export function apiConfigFactory(store) {
    const params = {
        basePath: store.get('api_url')
        // set configuration parameters here.
    };
    return new Configuration(params);
}
const loadConfigs = (appConfig) => {
    return () => {
        return appConfig.loadConfigs();
    };
};
const DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
    suppressScrollX: true
};
let AppModule = class AppModule {
    constructor(customIconService, translate) {
        this.customIconService = customIconService;
        this.translate = translate;
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.customIconService.registerPerunRefreshIcon();
    }
};
AppModule = __decorate([
    NgModule({
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
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            }),
            ApiModule,
            PerfectScrollbarModule
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
            API_INTERCEPTOR_PROVIDER,
            {
                provide: PERFECT_SCROLLBAR_CONFIG,
                useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
            }
        ],
        bootstrap: [AppComponent]
    }),
    __metadata("design:paramtypes", [CustomIconService,
        TranslateService])
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map