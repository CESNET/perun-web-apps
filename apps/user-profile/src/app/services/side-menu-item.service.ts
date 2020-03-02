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
      link: '/identities',
      activatedRegex: '^/identities$'
    };
  }

  getServicesItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.SERVICES',
      icon: 'build',
      link: '/services',
      activatedRegex: '^/services$'
    };
  }

  getGroupsItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.GROUPS',
      icon: 'group',
      link: '/groups',
      activatedRegex: '^/groups$'

    };
  }

  getVosItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.VOS',
      icon: 'account_balance',
      link: '/organizations',
      activatedRegex: '^/organizations$'

    };
  }

  getPrivacyItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.PRIVACY',
      icon: 'vpn_key',
      link: '/privacy',
      activatedRegex: '^/privacy$'
    };
  }

  getSettingsItem(): SideMenuItem {
    return {
      label: 'MENU_ITEMS.SETTINGS',
      icon: 'settings',
      link: '/settings',
      activatedRegex: '^/settings'
    };
  }
}

export interface SideMenuItem {
  label: string;
  icon: string;
  link: string;
  activatedRegex: string;
}
