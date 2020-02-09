import { Injectable } from '@angular/core';
import { SideMenuItem } from '../../../../admin-gui/src/app/shared/side-menu/side-menu.component';

@Injectable({
  providedIn: 'root'
})
export class SideMenuItemService {

  constructor() { }

  baseItemColor = 'yellow';     //PLACEHOLDER
  baseItemTextColor = 'green';    //PLACEHOLDER

  getProfileItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.PROFILE',
      colorClass: 'base-item-color-activated',
      icon: 'settings-blue',
      baseLink: ['/profile'],
      links: [],
      baseColorClass: 'base-item-color',
      baseColorClassRegex: '^/profile',
      backgroundColorCss: this.baseItemColor,
      textColorCss: this.baseItemTextColor
    };
  }

  getIdentitiesItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.IDENTITIES',
      colorClass: 'base-item-color-activated',
      icon: 'settings-blue',
      baseLink: ['/identities'],
      links: [],
      baseColorClass: 'base-item-color',
      baseColorClassRegex: '^/identities',
      backgroundColorCss: this.baseItemColor,
      textColorCss: this.baseItemTextColor
    };
  }

  getServicesItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.SERVICES',
      colorClass: 'base-item-color-activated',
      icon: 'settings-blue',
      baseLink: ['/services'],
      links: [],
      baseColorClass: 'base-item-color',
      baseColorClassRegex: '^/services',
      backgroundColorCss: this.baseItemColor,
      textColorCss: this.baseItemTextColor
    };
  }

  getGroupsItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.GROUPS',
      colorClass: 'base-item-color-activated',
      icon: 'settings-blue',
      baseLink: ['/groups'],
      links: [],
      baseColorClass: 'base-item-color',
      baseColorClassRegex: '^/groups',
      backgroundColorCss: this.baseItemColor,
      textColorCss: this.baseItemTextColor
    };
  }

  getVosItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.VOS',
      colorClass: 'base-item-color-activated',
      icon: 'settings-blue',
      baseLink: ['/organizations'],
      links: [],
      baseColorClass: 'base-item-color',
      baseColorClassRegex: '^/organizations',
      backgroundColorCss: this.baseItemColor,
      textColorCss: this.baseItemTextColor
    };
  }

  getSettingsItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.SETTINGS',
      colorClass: 'base-item-color-activated',
      icon: 'settings-blue',
      baseLink: ['/settings'],
      links: [],
      baseColorClass: 'base-item-color',
      baseColorClassRegex: '^/settings',
      backgroundColorCss: this.baseItemColor,
      textColorCss: this.baseItemTextColor
    };
  }
}
