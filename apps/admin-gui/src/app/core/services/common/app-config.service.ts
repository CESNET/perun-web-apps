import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { StoreService } from './store.service';
import { AuthResolverService } from './auth-resolver.service';
import { AuthzService } from '@perun-web-apps/perun/services';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor(private http: HttpClient,
              private authService: AuthService,
              private storeService: StoreService,
              private authResolver: AuthResolverService,
              private authzService: AuthzService) {}

  loadConfigs(): Promise<void> {
    return this.loadAppDefaultConfig()
      .then(() => this.loadAppInstanceConfig())
      .then(() => this.loadAdditionalData());
  }

  /**
   * Load default configuration.
   * If instance is not in production mode, the configuration is also
   * taken as instance configuration and load additional data.
   */
  loadAppDefaultConfig() : Promise<void> {
    return new Promise((resolve) => {

      this.http.get('/assets/config/defaultConfig.json', {headers: this.getNoCacheHeaders()})
        .subscribe(config => {
          this.storeService.setDefaultConfig(config);
          resolve();
        });

    });
  }

  /**
   * Load instance configuration.
   * If instance is in production mode, configuration mode is assigned to
   * instance config and load additional data.
   */
  loadAppInstanceConfig() : Promise<void>  {
    return new Promise((resolve, reject) => {

      this.http.get('/assets/config/instanceConfig.json', { headers: this.getNoCacheHeaders() })
        .subscribe(config => {
          this.storeService.setInstanceConfig(config);
          resolve();
        }, () => {
          if (environment.production) {
            console.error('Failed to load instance config.');
            reject();
          } else {
            console.log('instance config not detected');
            resolve();
          }
        });
    });
  }

  getNoCacheHeaders() : HttpHeaders {
    return new HttpHeaders({
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  /**
   * Load additional data. First it init authService with necessarily data. Then start authentication and after user is
   * authenticated the principal is loaded.
   * @param config of the instance
   */
  loadAdditionalData(): Promise<any> {
    return new Promise((resolve) => {
      this.authService.loadConfigData();

      this.authService.authenticate().then(() => {

        this.loadPrincipal().then( () => {
          resolve();
        });
      });

    });
  }

  /**
   * Load principal
   */
  loadPrincipal(): Promise<any> {
    return this.authzService.getPerunPrincipal()
      .toPromise()
      .then(perunPrincipal => {
        this.storeService.setPerunPrincipal(perunPrincipal);
        this.authResolver.init(perunPrincipal);
    });
  }


}
