import { Component, OnInit } from '@angular/core';
import { SideMenuItemService } from '../../services/side-menu-item.service';

@Component({
  selector: 'perun-web-apps-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor(
    private sideMenuItemService: SideMenuItemService
  ) { }

  profileItem = this.sideMenuItemService.getProfileItem();
  identitiesItem = this.sideMenuItemService.getIdentitiesItem();
  servicesItem = this.sideMenuItemService.getServicesItem();
  groupsItem = this.sideMenuItemService.getGroupsItem();
  vosItem = this.sideMenuItemService.getVosItem();
  settingsItem = this.sideMenuItemService.getSettingsItem();

  ngOnInit() {

  }

}
