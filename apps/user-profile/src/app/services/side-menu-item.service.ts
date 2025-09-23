import { Injectable } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';

@Injectable({
  providedIn: 'root',
})
export class SideMenuItemService {
  constructor(private store: StoreService) {}

  getSideMenuItems(): SideMenuItem[] {
    const tabs = this.store.getProperty('displayed_tabs');
    const items: SideMenuItem[] = [];
    tabs.forEach((tab) => {
      switch (tab) {
        case 'profile':
          items.push({
            label: 'MENU_ITEMS.PROFILE',
            icon: 'account_box',
            link: '/profile',
            activatedRegex: '^/profile$',
            tabName: 'profile',
          });
          break;
        case 'identities':
          items.push({
            label: 'MENU_ITEMS.IDENTITIES',
            icon: 'remove_red_eye',
            link: '/profile/identities',
            activatedRegex: '^/profile/identities$',
            tabName: 'identities',
          });
          break;
        case 'services':
          items.push({
            label: 'MENU_ITEMS.SERVICES',
            icon: 'build',
            link: '/profile/services',
            activatedRegex: '^/profile/services$',
            tabName: 'services',
          });
          break;
        case 'groups':
          items.push({
            label: 'MENU_ITEMS.GROUPS',
            icon: 'group',
            link: '/profile/groups',
            activatedRegex: '^/profile/groups$',
            tabName: 'groups',
          });
          break;
        case 'vos':
          items.push({
            label: 'MENU_ITEMS.VOS',
            icon: 'account_balance',
            link: '/profile/organizations',
            activatedRegex: '^/profile/organizations$',
            tabName: 'vos',
          });
          break;
        case 'privacy':
          items.push({
            label: 'MENU_ITEMS.PRIVACY',
            icon: 'vpn_key',
            link: '/profile/privacy',
            activatedRegex: '^/profile/privacy$',
            tabName: 'privacy',
          });
          break;
        case 'consents':
          items.push({
            label: 'MENU_ITEMS.CONSENTS',
            icon: 'fact_check',
            link: '/profile/consents',
            activatedRegex: '^/profile/consents',
            tabName: 'consents',
          });
          break;
        case 'roles':
          items.push({
            label: 'MENU_ITEMS.ROLES',
            icon: 'passkey',
            link: '/profile/roles',
            activatedRegex: '^/profile/roles',
            tabName: 'roles',
          });
          break;
        case 'bans':
          items.push({
            label: 'MENU_ITEMS.BANS',
            icon: 'person_off',
            link: '/profile/bans',
            activatedRegex: '^/profile/bans',
            tabName: 'bans',
          });
          break;
        case 'authentication':
          items.push({
            label: 'MENU_ITEMS.AUTHENTICATION',
            icon: 'admin_panel_settings',
            link: '/profile/auth',
            activatedRegex: '^/profile/auth',
            tabName: 'authentication',
          });
          break;
        case 'settings':
          items.push({
            label: 'MENU_ITEMS.SETTINGS',
            icon: 'settings',
            link: '/profile/settings',
            activatedRegex: '^/profile/settings',
            tabName: 'settings',
          });
          break;
      }
    });
    const externalServices = this.store.getProperty('external_services');
    externalServices.forEach((service) => {
      const item: SideMenuItem = {
        icon: 'insert_link',
        link: service.url,
        activatedRegex: '^/profile/external',
        tabName: 'external',
        external: true,
      };
      const languages: string[] = this.store.getProperty('supported_languages');
      languages.forEach((lang) => {
        item[`label_${lang}`] = String(service[`label_${lang}`]) ?? service.label_en;
      });
      items.push(item);
    });
    return items;
  }
}

export interface SideMenuItem {
  [key: string]: string | boolean;
  icon: string;
  link: string;
  activatedRegex: string;
  tabName: string;
  external?: boolean;
}
