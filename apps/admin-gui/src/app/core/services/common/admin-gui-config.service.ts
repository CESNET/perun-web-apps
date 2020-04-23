import { Injectable } from '@angular/core';
import {
  InitAuthService, StoreService
} from '@perun-web-apps/perun/services';
import { AppConfigService, ColorConfig, EntityColorConfig } from '@perun-web-apps/config';
import { AuthzResolverService } from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserDontExistDialogComponent } from '../../../../../../../libs/perun/components/src/lib/user-dont-exist-dialog/user-dont-exist-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class AdminGuiConfigService {

  constructor(
    private initAuthService: InitAuthService,
    private appConfigService: AppConfigService,
    private store: StoreService,
    private authzSevice: AuthzResolverService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

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

  colorConfigs: ColorConfig[] = [
    {
      configValue: 'sidemenu_hover_color',
      cssVariable: '--side-root-item-hover'
    },
    {
      configValue: 'sidemenu_root_active_color',
      cssVariable: '--side-root-item-active'
    },
    {
      configValue: 'sidemenu-link-active',
      cssVariable: '--side-link-active'
    },
    {
      configValue: 'sidemenu-link-hover',
      cssVariable: '--side-link-hover'
    }
  ];

  loadConfigs(): Promise<void> {
    return this.appConfigService.loadAppDefaultConfig()
      .then(() => this.appConfigService.loadAppInstanceConfig())
      .then(() => this.setApiUrl())
      .then(() => this.appConfigService.initializeColors(this.entityColorConfigs, this.colorConfigs))
      .then(() => this.initAuthService.authenticateUser())
      .then(isAuthenticated => {
        // if the user is not authenticated, do not try to load principal
        console.log(isAuthenticated);
        if (isAuthenticated !== true) {
          return new Promise<void>(resolve => resolve());
        }
        return this.initAuthService.loadPrincipal();
      }).catch(err => this.handlePrincipalErr(err));
  }

  /**
   *  We need to set basePath for authzService before loading principal, otherwise authzService uses its default basePath
   */
  private setApiUrl() {
    return new Promise((resolve) => {
      this.authzSevice.configuration.basePath = this.store.get('api_url');
      resolve();
    });
  }

  private handlePrincipalErr(err: any) {
    this.translate.get('GENERAL.PRINCIPAL_ERROR.TITLE').subscribe(sdf => console.log(sdf));
    this.dialog.open(UserDontExistDialogComponent, {
      disableClose: true
    });
    throw err;
  }
}
