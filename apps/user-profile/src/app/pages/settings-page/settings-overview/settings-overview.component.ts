import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../../../../../admin-gui/src/app/shared/models/MenuItem';

@Component({
  selector: 'perun-web-apps-settings-overview',
  templateUrl: './settings-overview.component.html',
  styleUrls: ['./settings-overview.component.scss']
})
export class SettingsOverviewComponent implements OnInit {

  constructor() { }

  items: MenuItem[] = [];

  ngOnInit() {
    this.initItems()
  }

  private initItems() {
    this.items = [
      {
        cssIcon: 'settings-blue',
        url: `/settings/altPasswords`,
        label: 'MENU_ITEMS.SETTINGS.ALTERNATIVE_PASSWORDS',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/settings/dataQuotas`,
        label: 'MENU_ITEMS.SETTINGS.DATA_QUOTAS',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/settings/mailingLists`,
        label: 'MENU_ITEMS.SETTINGS.MAILING_LISTS',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/settings/prefShells`,
        label: 'MENU_ITEMS.SETTINGS.PREFERRED_SHELLS',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/settings/prefGroupNames`,
        label: 'MENU_ITEMS.SETTINGS.PREFERRED_UNIX_GROUP_NAMES',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/settings/sambaPassword`,
        label: 'MENU_ITEMS.SETTINGS.SAMBA_PASSWORD',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/settings/sshKeys`,
        label: 'MENU_ITEMS.SETTINGS.SSH_KEYS',
        style: 'vo-btn'
      }
    ];
  }
}
