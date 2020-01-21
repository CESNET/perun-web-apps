import {Component, HostBinding, OnInit} from '@angular/core';
import {MenuItem} from '../../../models/MenuItem';
import { User } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss']
})
export class UserOverviewComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor() { }

  navItems: MenuItem[] = [];
  user: User;
  path: string;

  ngOnInit() {
    this.initNavItems();
  }

  private initNavItems() {
    this.navItems = [
      {
        cssIcon: 'perun-user',
        url: `detail`,
        label: 'MENU_ITEMS.USER.DETAIL',
        style: 'user-btn'
      },
      {
        cssIcon: 'perun-vo',
        url: `organizations`,
        label: 'MENU_ITEMS.USER.ORGANIZATIONS',
        style: 'user-btn'
      },
      {
        cssIcon: 'perun-group',
        url: `groups`,
        label: 'MENU_ITEMS.USER.GROUPS',
        style: 'user-btn'
      },
      {
        cssIcon: 'perun-settings2',
        url: `settings`,
        label: 'MENU_ITEMS.USER.SETTINGS',
        style: 'user-btn'
      }
    ];
  }
}
