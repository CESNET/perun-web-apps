import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@perun-web-apps/perun/models';

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
        url: `/profile/settings/altPasswords`,
        label: 'SETTINGS.ALTERNATIVE_PASSWORDS',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/dataQuotas`,
        label: 'SETTINGS.DATA_QUOTAS',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/mailingLists`,
        label: 'SETTINGS.MAILING_LISTS',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/prefShells`,
        label: 'SETTINGS.PREFERRED_SHELLS',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/prefGroupNames`,
        label: 'SETTINGS.PREFERRED_UNIX_GROUP_NAMES',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/sambaPassword`,
        label: 'SETTINGS.SAMBA_PASSWORD',
        style: 'vo-btn'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/sshKeys`,
        label: 'SETTINGS.SSH_KEYS',
        style: 'vo-btn'
      }
    ];
  }
}
