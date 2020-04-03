import {Component, HostBinding, OnInit} from '@angular/core';
import {MenuItem} from '../../../../../../../../../libs/perun/models/src/lib/MenuItem';

@Component({
  selector: 'app-user-settings-overview',
  templateUrl: './user-settings-overview.component.html',
  styleUrls: ['./user-settings-overview.component.scss']
})
export class UserSettingsOverviewComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
  ) { }

  navItems: MenuItem[] = [];
  path: string;

  ngOnInit() {
    this.initNavItems();
  }

  private initNavItems() {
    this.navItems = [
      {
        cssIcon: 'perun-attributes',
        url: `attributes`,
        label: 'MENU_ITEMS.USER.ATTRIBUTES',
        style: 'user-btn'
      },
      {
        cssIcon: 'perun-group',
        url: `roles`,
        label: 'MENU_ITEMS.USER.ROLES',
        style: 'user-btn'
      }
    ];
  }
}
