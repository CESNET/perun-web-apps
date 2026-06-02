import {
  APP_INITIALIZER,
  enableProdMode,
  forwardRef,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication, BrowserModule, Title } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import {
  ApiInterceptor,
  ApiService,
  CustomIconService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Configuration, ConfigurationParameters } from '@perun-web-apps/perun/openapi';
import { isRunningLocally } from '@perun-web-apps/perun/utils';
import {
  ApiModule as RegistrarApiModule,
  Configuration as RegistrarConfiguration,
  ConfigurationParameters as RegistrarConfigurationParameters,
} from '@perun-web-apps/perun/registrar-openapi';
import { UserProfileConfigService } from './app/services/user-profile-config.service';
import { UserFullNamePipe } from '@perun-web-apps/perun/pipes';
import { PERUN_API_SERVICE } from '@perun-web-apps/perun/tokens';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { provideRouter, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { providePerunDateAdapter } from '@perun-web-apps/perun/components';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { appRoutes } from './app/app.routes';

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

export function registrarApiConfigFactory(store: StoreService): RegistrarConfiguration {
  const params: RegistrarConfigurationParameters = {
    basePath: store.getProperty('registrar_api_url'),
    withCredentials: !isRunningLocally() /* add cookies to keep same session for BA access */,
  };
  return new RegistrarConfiguration(params);
}

const loadConfigs: (appConfig: UserProfileConfigService) => () => Promise<void> =
  (appConfig: UserProfileConfigService) => () =>
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
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
      MatIconModule,
      MatSidenavModule,
      MatListModule,
      RouterModule,
      MatButtonModule,
      MatToolbarModule,
      MatExpansionModule,
      MatFormFieldModule,
      MatSelectModule,
      MatDialogModule,
      MatTableModule,
      MatInputModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatPaginatorModule,
      MatProgressSpinnerModule,
      MatSortModule,
      MatCardModule,
      ClipboardModule,
      MatAutocompleteModule,
      MatRippleModule,
      MatTooltipModule,
      MatSlideToggleModule,
      MatRadioModule,
      FormsModule,
      MatMenuModule,
      OAuthModule.forRoot(),
      RegistrarApiModule,
    ),
    providePerunDateAdapter(),
    provideRouter(appRoutes),
    CustomIconService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      multi: true,
      deps: [UserProfileConfigService],
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
      provide: RegistrarConfiguration,
      useFactory: registrarApiConfigFactory,
      deps: [StoreService],
    },
    UserFullNamePipe,
    ApiInterceptor,
    API_INTERCEPTOR_PROVIDER,
    {
      provide: PERUN_API_SERVICE,
      useClass: ApiService,
    },
    Title,
    { provide: OAuthStorage, useFactory: (): OAuthStorage => localStorage },
  ],
}).catch((err) => console.error(err));
