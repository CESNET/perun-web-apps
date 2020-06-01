import {Component, HostBinding, OnInit} from '@angular/core';
import {MenuItem} from '@perun-web-apps/perun/models';

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
        cssIcon: 'perun-attributes',
        url: `facilityAttributes`,
        label: 'MENU_ITEMS.USER.FACILITY_ATTRIBUTES',
        style: 'user-btn'
      },
      {
        cssIcon: 'perun-group',
        url: `roles`,
        label: 'MENU_ITEMS.USER.ROLES',
        style: 'user-btn'
      }
    ];
    // if at user profile, add user gui config item
    if (!window.location.pathname.startsWith('/admin')) {
      this.navItems.push({
          cssIcon: 'perun-settings2',
          url: 'gui-config',
          label: 'MENU_ITEMS.USER.GUI_CONFIG',
          style: 'user-btn'
        });
    }
  }
}
