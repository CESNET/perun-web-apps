import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideMenuItemService {

  constructor() { }

  getProfileItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.PROFILE',
      icon: 'account_box',
      link: '/profile',
      // activated_regex
    };
  }

  getIdentitiesItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.IDENTITIES',
      icon: 'remove_red_eye',
      link: '/identities'
    };
  }

  getServicesItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.SERVICES',
      icon: 'build',
      link: '/services'
    };
  }

  getGroupsItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.GROUPS',
      icon: 'group',
      link: '/groups'

    };
  }

  getVosItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.VOS',
      icon: 'account_balance',
      link: '/organizations'

    };
  }

  getSettingsItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.SETTINGS',
      icon: 'settings',
      link: '/settings'
    };
  }
}

export interface SideMenuItem {
  label: string;
  icon: string;
  link: string;
}
