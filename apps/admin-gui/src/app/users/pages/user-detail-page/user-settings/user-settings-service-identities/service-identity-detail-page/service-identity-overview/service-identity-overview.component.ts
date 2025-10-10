import {
  MenuButtonsFieldComponent,
  ExpandableTilesComponent,
} from '@perun-web-apps/perun/components';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from '@perun-web-apps/perun/models';
import { EntityStorageService } from '@perun-web-apps/perun/services';
import { User } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [CommonModule, MenuButtonsFieldComponent, ExpandableTilesComponent],
  standalone: true,
  selector: 'app-service-identity-overview',
  templateUrl: './service-identity-overview.component.html',
  styleUrls: ['./service-identity-overview.component.css'],
})
export class ServiceIdentityOverviewComponent implements OnInit {
  navItems: MenuItem[] = [];
  authenticationItems: MenuItem[] = [];
  serviceAccount: User;

  constructor(private entityStorageService: EntityStorageService) {}

  ngOnInit(): void {
    this.serviceAccount = this.entityStorageService.getEntity();
    this.initNavItems();
  }

  private initNavItems(): void {
    this.navItems = [
      {
        cssIcon: 'perun-manager',
        url: `/service-identities/${this.serviceAccount.id}/associated-users`,
        label: 'MENU_ITEMS.USER.ASSOCIATED_USERS',
        style: 'user-btn',
      },
      {
        cssIcon: 'perun-statistics',
        url: `/service-identities/${this.serviceAccount.id}/data-quotas`,
        label: 'MENU_ITEMS.USER.DATA_QUOTAS',
        style: 'user-btn',
      },
      {
        cssIcon: 'perun-notification',
        url: `/service-identities/${this.serviceAccount.id}/mailing-lists`,
        label: 'MENU_ITEMS.USER.MAILING_LISTS',
        style: 'user-btn',
      },
    ];

    this.authenticationItems = [
      {
        cssIcon: 'perun-logins',
        url: `/service-identities/${this.serviceAccount.id}/authentication/logins`,
        label: 'MENU_ITEMS.USER.LOGINS',
        style: 'user-btn',
      },
      {
        cssIcon: 'perun-certificates',
        url: `/service-identities/${this.serviceAccount.id}/authentication/certificates`,
        label: 'MENU_ITEMS.USER.CERTIFICATES',
        style: 'user-btn',
      },
      {
        cssIcon: 'perun-key',
        url: `/service-identities/${this.serviceAccount.id}/authentication/ssh-keys`,
        label: 'MENU_ITEMS.USER.SSH_KEYS',
        style: 'user-btn',
      },
    ];
  }
}
