import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideMenuItemService {

  constructor() { }

  getSideMenuItems(): SideMenuItem[] {
    return [
      {
        label: 'MENU_ITEMS.PROFILE',
        icon: 'account_box',
        link: '/profile',
        activatedRegex: '^/profile$',
        tabName: 'profile'
      },
      {
        label: 'MENU_ITEMS.IDENTITIES',
        icon: 'remove_red_eye',
        link: '/profile/identities',
        activatedRegex: '^/profile/identities$',
        tabName: 'identities'
      },
      {
        label: 'MENU_ITEMS.SERVICES',
        icon: 'build',
        link: '/profile/services',
        activatedRegex: '^/profile/services$',
        tabName: 'services'
      },
      {
        label: 'MENU_ITEMS.GROUPS',
        icon: 'group',
        link: '/profile/groups',
        activatedRegex: '^/profile/groups$',
        tabName: 'groups'
      },
      {
        label: 'MENU_ITEMS.VOS',
        icon: 'account_balance',
        link: '/profile/organizations',
        activatedRegex: '^/profile/organizations$',
        tabName: 'vos'
      },
      {
        label: 'MENU_ITEMS.PRIVACY',
        icon: 'vpn_key',
        link: '/profile/privacy',
        activatedRegex: '^/profile/privacy$',
        tabName: 'privacy'
      },
      {
        label: 'MENU_ITEMS.SETTINGS',
        icon: 'settings',
        link: '/profile/settings',
        activatedRegex: '^/profile/settings',
        tabName: 'settings'
      }
    ]
  }

  // getProfileItem(): SideMenuItem {
  //   return {
  //     label: 'MENU_ITEMS.PROFILE',
  //     icon: 'account_box',
  //     link: '/profile',
  //     activatedRegex: '^/profile$',
  //     tabName: 'profile'
  //   };
  // }

  // getIdentitiesItem(): SideMenuItem {
  //   return {
  //     label: 'MENU_ITEMS.IDENTITIES',
  //     icon: 'remove_red_eye',
  //     link: '/profile/identities',
  //     activatedRegex: '^/profile/identities$',
  //     tabName: 'identities'
  //   };
  // }

  // getServicesItem(): SideMenuItem {
  //   return {
  //     label: 'MENU_ITEMS.SERVICES',
  //     icon: 'build',
  //     link: '/profile/services',
  //     activatedRegex: '^/profile/services$',
  //     tabName: 'services'
  //   };
  // }

  // getGroupsItem(): SideMenuItem {
  //   return {
  //     label: 'MENU_ITEMS.GROUPS',
  //     icon: 'group',
  //     link: '/profile/groups',
  //     activatedRegex: '^/profile/groups$',
  //     tabName: 'groups'
  //   };
  // }

  // getVosItem(): SideMenuItem {
  //   return {
  //     label: 'MENU_ITEMS.VOS',
  //     icon: 'account_balance',
  //     link: '/profile/organizations',
  //     activatedRegex: '^/profile/organizations$',
  //     tabName: 'vos'
  //
  //   };
  // }

  // getPrivacyItem(): SideMenuItem {
  //   return {
  //     label: 'MENU_ITEMS.PRIVACY',
  //     icon: 'vpn_key',
  //     link: '/profile/privacy',
  //     activatedRegex: '^/profile/privacy$',
  //     tabName: 'privacy'
  //   };
  // }

  // getSettingsItem(): SideMenuItem {
  //   return {
  //     label: 'MENU_ITEMS.SETTINGS',
  //     icon: 'settings',
  //     link: '/profile/settings',
  //     activatedRegex: '^/profile/settings',
  //     tabName: 'settings'
  //   };
  // }
}

export interface SideMenuItem {
  label: string;
  icon: string;
  link: string;
  activatedRegex: string;
  tabName: string;
}
