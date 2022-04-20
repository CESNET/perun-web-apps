import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-service-identity-overview',
  templateUrl: './service-identity-overview.component.html',
  styleUrls: ['./service-identity-overview.component.css'],
})
export class ServiceIdentityOverviewComponent implements OnInit {
  navItems: MenuItem[] = [];

  ngOnInit(): void {
    this.initNavItems();
  }

  private initNavItems(): void {
    this.navItems = [
      {
        cssIcon: 'perun-user',
        url: `associated-users`,
        label: 'MENU_ITEMS.USER.ASSOCIATED_USERS',
        style: 'user-btn',
      },
    ];
  }
}
