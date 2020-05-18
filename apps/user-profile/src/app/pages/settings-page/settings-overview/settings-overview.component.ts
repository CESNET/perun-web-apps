import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@perun-web-apps/perun/models';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'perun-web-apps-settings-overview',
  templateUrl: './settings-overview.component.html',
  styleUrls: ['./settings-overview.component.scss']
})
export class SettingsOverviewComponent implements OnInit {

  constructor(private storeService: StoreService) { }

  items: MenuItem[] = [];

  ngOnInit() {
    this.initItems();
    const displayedTabs: string[] = this.storeService.get('displayed_tabs');

    this.items = this.items.filter(item => displayedTabs.includes(item.tabName));
  }

  private initItems() {
    this.items = [
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/altPasswords`,
        label: 'SETTINGS.ALTERNATIVE_PASSWORDS',
        style: 'vo-btn',
        tabName: 'alt_passwords'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/dataQuotas`,
        label: 'SETTINGS.DATA_QUOTAS',
        style: 'vo-btn',
        tabName: 'data_quotas'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/mailingLists`,
        label: 'SETTINGS.MAILING_LISTS',
        style: 'vo-btn',
        tabName: 'opt_out'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/prefShells`,
        label: 'SETTINGS.PREFERRED_SHELLS',
        style: 'vo-btn',
        tabName: 'pref_shells'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/prefGroupNames`,
        label: 'SETTINGS.PREFERRED_UNIX_GROUP_NAMES',
        style: 'vo-btn',
        tabName: 'pref_group_names'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/sambaPassword`,
        label: 'SETTINGS.SAMBA_PASSWORD',
        style: 'vo-btn',
        tabName: 'samba'
      },
      {
        cssIcon: 'settings-blue',
        url: `/profile/settings/sshKeys`,
        label: 'SETTINGS.SSH_KEYS',
        style: 'vo-btn',
        tabName: 'ssh_keys'
      }
    ];
  }
}
