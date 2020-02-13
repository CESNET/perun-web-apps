import { Component, OnInit } from '@angular/core';
import { AuthResolverService } from '@perun-web-apps/perun/services';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { UsersService } from '@perun-web-apps/perun/services';
import { PerunPrincipal, User } from '@perun-web-apps/perun/openapi';
import { StoreService } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(
    public authResolver: AuthResolverService,
    private usersService: UsersService,
    private sideMenuService: SideMenuService,
    private store: StoreService
  ) {
  }

  principal: PerunPrincipal;
  user: User;
  path = `/profile`;
  regex = `/profile`;

  ngOnInit() {
    this.principal = this.store.getPerunPrincipal();
    this.user = this.principal.user;

    this.sideMenuService.setUserItems([]);
  }
}
