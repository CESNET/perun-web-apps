import { Component, OnInit } from '@angular/core';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { PerunPrincipal, User } from '@perun-web-apps/perun/openapi';
import { EntityStorageService, StoreService } from '@perun-web-apps/perun/services';
import { Router } from '@angular/router';
import { EntityPathParam } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  principal: PerunPrincipal;
  user: User;
  path: string;

  constructor(
    private sideMenuService: SideMenuService,
    private store: StoreService,
    private entityStore: EntityStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.path = this.router.url;
    this.router.events.subscribe(() => {
      this.path = this.router.url;
    });
    this.principal = this.store.getPerunPrincipal();
    this.user = this.principal.user;
    this.entityStore.setEntityAndPathParam(this.user, EntityPathParam.User);
    this.sideMenuService.setUserItems([]);
  }

  getUserType(): string {
    if (this.user.serviceUser) {
      return 'Service';
    }
    return 'Person';
  }
}
