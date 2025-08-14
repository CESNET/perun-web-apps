import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MenuButtonsFieldComponent } from '@perun-web-apps/perun/components';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MenuItem } from '@perun-web-apps/perun/models';
import { Attribute, User, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MenuButtonsFieldComponent,
    MatCardModule,
    MatTableModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.scss'],
})
export class UserOverviewComponent implements OnInit {
  @HostBinding('class.router-component') true;
  items: MenuItem[] = [];
  user: User;
  isServiceUser = false;
  path: string;
  displayedColumns = ['name', 'value'];
  preferredMail: Attribute;

  constructor(
    private userService: UsersManagerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userService.getUserById(Number(params['userId'])).subscribe((user) => {
        this.user = user;
        this.isServiceUser = user.serviceUser;
        this.setItems(`/admin/users/${this.user.id}`);
      });
    });
  }

  private setItems(urlStart: string): void {
    this.items = [];
    this.items.push(
      {
        cssIcon: 'perun-user',
        url: `${urlStart}/accounts`,
        label: 'MENU_ITEMS.USER.ACCOUNTS',
        style: 'user-btn',
      },
      {
        cssIcon: 'perun-facility-white',
        url: `${urlStart}/assignments`,
        label: 'MENU_ITEMS.USER.ASSIGNMENTS',
        style: 'user-btn',
      },
      {
        cssIcon: 'perun-identity',
        url: `${urlStart}/identities`,
        label: 'MENU_ITEMS.USER.IDENTITIES',
        style: 'user-btn',
      },
      {
        cssIcon: 'perun-applications',
        url: `${urlStart}/applications`,
        label: 'MENU_ITEMS.USER.APPLICATIONS',
        style: 'user-btn',
      },
    );
    this.items.push({
      cssIcon: 'perun-attributes',
      url: `${urlStart}/attributes`,
      label: 'MENU_ITEMS.USER.ATTRIBUTES',
      style: 'user-btn',
    });
    this.items.push({
      cssIcon: 'perun-roles',
      url: `${urlStart}/roles`,
      label: 'MENU_ITEMS.USER.ROLES',
      style: 'user-btn',
    });
    if (this.isServiceUser) {
      this.items.push({
        cssIcon: 'perun-manager',
        url: `${urlStart}/associated-users`,
        label: 'MENU_ITEMS.USER.ASSOCIATED_USERS',
        style: 'user-btn',
      });
    } else {
      this.items.push({
        cssIcon: 'perun-service-identity',
        url: `${urlStart}/service-identities`,
        label: 'MENU_ITEMS.USER.SERVICE_IDENTITIES',
        style: 'user-btn',
      });
    }
    this.items.push({
      cssIcon: 'perun-ban',
      url: `bans`,
      label: 'MENU_ITEMS.USER.BANS',
      style: 'user-btn',
    });
  }
}
