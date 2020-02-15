import { Component, OnInit } from '@angular/core';
import { SideMenuItem, SideMenuItemService } from '../../services/side-menu-item.service';

@Component({
  selector: 'perun-web-apps-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor(
    private sideMenuItemService: SideMenuItemService
  ) { }

  items: SideMenuItem[] = [];

  ngOnInit() {
    this.items.push(this.sideMenuItemService.getProfileItem());
    this.items.push(this.sideMenuItemService.getIdentitiesItem());
    this.items.push(this.sideMenuItemService.getServicesItem());
    this.items.push(this.sideMenuItemService.getGroupsItem());
    this.items.push(this.sideMenuItemService.getVosItem());
    this.items.push(this.sideMenuItemService.getSettingsItem());
  }

}
