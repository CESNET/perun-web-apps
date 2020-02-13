import { Injectable } from '@angular/core';
import {
  AppConfigService,
  ColorConfig,
  EntityColorConfig
} from '@perun-web-apps/perun/services';


@Injectable({
  providedIn: 'root'
})
export class AdminGuiConfigService {

  constructor(private appConfigService:AppConfigService) {}

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
      .then(() => this.appConfigService.initializeColors(this.entityColorConfigs, this.colorConfigs))
      .then(() => this.appConfigService.authenticateUser())
      .then(() => this.appConfigService.loadPrincipal());
  }
}
