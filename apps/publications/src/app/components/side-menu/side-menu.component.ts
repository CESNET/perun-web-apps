import { TranslateModule } from '@ngx-translate/core';
import { MatListModule, MatNavList, MatListItem } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { SideMenuItem, SideMenuItemsService } from '../../services/side-menu-items.service';
import { MatRipple } from '@angular/material/core';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatNavList,
    MatListItem,
    TranslateModule,
    MatRipple,
  ],
  standalone: true,
  selector: 'perun-web-apps-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @Input() sideNav: MatSidenav;
  items: SideMenuItem[] = [];
  textColor = this.storeService.getProperty('theme').sidemenu_text_color;
  private currentUrl: string;

  constructor(
    private sideMenuItemService: SideMenuItemsService,
    private storeService: StoreService,
    private router: Router,
  ) {
    this.currentUrl = router.url;

    router.events.subscribe((_: NavigationEnd) => {
      if (_ instanceof NavigationEnd) {
        this.currentUrl = _.url;
      }
    });
  }

  ngOnInit(): void {
    this.items = this.sideMenuItemService.getSideMenuItems();
  }

  isActive(regexValue: string): boolean {
    const regexp = new RegExp(regexValue);

    return regexp.test(this.currentUrl);
  }

  shouldHideMenu(): void {
    if (this.sideNav.mode === 'over') {
      void this.sideNav.close();
    }
  }
}
