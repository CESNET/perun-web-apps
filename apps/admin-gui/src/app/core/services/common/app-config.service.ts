import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { StoreService } from './store.service';
import { AuthResolverService } from './auth-resolver.service';
import { AuthzService } from '@perun-web-apps/perun/services';

declare const tinycolor: any;

export interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
  red: number;
  green: number;
  blue: number;
}

export interface EntityColorConfig {
  entity: string;
  configValue: string;
  cssVariable: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  constructor(private http: HttpClient,
              private authService: AuthService,
              private storeService: StoreService,
              private authResolver: AuthResolverService,
              private authzService: AuthzService) {}

  entityColorConfigs: EntityColorConfig[] = [
    {
      entity: 'vo',
      configValue: 'vo_color',
      cssVariable: '--vo-color'
    },
    {
      entity: 'group',
      configValue: 'group_color',
      cssVariable: '--group-color'
    },
    {
      entity: 'user',
      configValue: 'user_color',
      cssVariable: '--user-color'
    },
    {
      entity: 'member',
      configValue: 'member_color',
      cssVariable: '--member-color'
    },
    {
      entity: 'facility',
      configValue: 'facility_color',
      cssVariable: '--facility-color'
    },
    {
      entity: 'resource',
      configValue: 'resource_color',
      cssVariable: '--resource-color'
    },
    {
      entity: 'admin',
      configValue: 'admin_color',
      cssVariable: '--admin-color'
    }
  ];

  loadConfigs(): Promise<void> {
    return this.loadAppDefaultConfig()
      .then(() => this.loadAppInstanceConfig())
      .then(() => this.initializeColors())
      .then(() => this.loadAdditionalData());
  }

  initializeColors() : Promise<void> {
    return new Promise<void>((resolve => {
      this.entityColorConfigs.forEach(ecc => {
        const color = this.storeService.get('theme', ecc.configValue);
        // set CSS variable for given entity
        document.documentElement.style.setProperty(ecc.cssVariable, color);
        // update theme for given entity
        this.setEntityTheme(ecc.entity, color);
      });

      resolve();
    }));
  }

  setEntityTheme(entity: string, color: string): void {
    const primaryColorPalette = computeColors(color);

    for (const paletteColor of primaryColorPalette) {
      const key1 = `--${entity}-theme-primary-${paletteColor.name}`;
      const value1 = `${paletteColor.red},${paletteColor.green},${paletteColor.blue}`;
      const key2 = `--${entity}-theme-primary-contrast-${paletteColor.name}`;
      const value2 = paletteColor.darkContrast ? '30,30,30' : '255,255,255';
      document.documentElement.style.setProperty(key1, value1);
      document.documentElement.style.setProperty(key2, value2);
    }
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

function computeColors(hex: string): Color[] {
  return [
    getColorObject(tinycolor(hex).lighten(52), '50'),
    getColorObject(tinycolor(hex).lighten(37), '100'),
    getColorObject(tinycolor(hex).lighten(26), '200'),
    getColorObject(tinycolor(hex).lighten(12), '300'),
    getColorObject(tinycolor(hex).lighten(6), '400'),
    getColorObject(tinycolor(hex), '500'),
    getColorObject(tinycolor(hex).darken(6), '600'),
    getColorObject(tinycolor(hex).darken(12), '700'),
    getColorObject(tinycolor(hex).darken(18), '800'),
    getColorObject(tinycolor(hex).darken(24), '900'),
    getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
    getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
    getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
    getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700')
  ];
}

function getColorObject(value, name): Color {
  const c = tinycolor(value);
  const rgb = c.toRgb();
  return {
    name: name,
    hex: c.toHexString(),
    darkContrast: c.isLight(),
    red: rgb.r,
    green: rgb.g,
    blue: rgb.b
  };
}
