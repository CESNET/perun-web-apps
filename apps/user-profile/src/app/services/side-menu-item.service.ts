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
      activatedRegex: '^/profile$'
    };
  }

  getIdentitiesItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.IDENTITIES',
      icon: 'remove_red_eye',
      link: '/profile/identities',
      activatedRegex: '^/profile/identities$'
    };
  }

  getServicesItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.SERVICES',
      icon: 'build',
      link: '/profile/services',
      activatedRegex: '^/profile/services$'
    };
  }

  getGroupsItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.GROUPS',
      icon: 'group',
      link: '/profile/groups',
      activatedRegex: '^/profile/groups$'

    };
  }

  getVosItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.VOS',
      icon: 'account_balance',
      link: '/profile/organizations',
      activatedRegex: '^/profile/organizations$'

    };
  }

  getPrivacyItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.PRIVACY',
      icon: 'vpn_key',
      link: '/profile/privacy',
      activatedRegex: '^/profile/privacy$'
    };
  }

  getSettingsItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.SETTINGS',
      icon: 'settings',
      link: '/profile/settings',
      activatedRegex: '^/profile/settings'
    };
  }
}

export interface SideMenuItem {
  label: string;
  icon: string;
  link: string;
  activatedRegex: string;
}
