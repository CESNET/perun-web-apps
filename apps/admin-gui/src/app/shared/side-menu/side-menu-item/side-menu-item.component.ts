import { TranslateModule } from '@ngx-translate/core';
import { MatRipple } from '@angular/material/core';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SideMenuLink, SideMenuItem } from '../side-menu.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { openClose, rollInOut } from '@perun-web-apps/perun/animations';
import { ExpandedTilesStoreService, StoreService } from '@perun-web-apps/perun/services';
import { ExpandableSectionId } from '@perun-web-apps/perun/models';
import { ActiveSideMenuItemPipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MiddleClickRouterLinkDirective,
    RouterModule,
    MatRipple,
    TranslateModule,
    ActiveSideMenuItemPipe,
  ],
  standalone: true,
  selector: 'app-side-menu-item',
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.scss'],
  animations: [openClose, rollInOut],
})
export class SideMenuItemComponent {
  @Input() item: SideMenuItem;
  @Input() root = false;
  @Input() showLinks = false;

  currentUrl: string;
  linkBgColor = this.store.getProperty('theme').sidemenu_submenu_bg_color;
  linkTextColor = this.store.getProperty('theme').sidemenu_submenu_text_color;
  dividerStyle = '1px solid ' + this.store.getProperty('theme').sidemenu_divider_color;
  rippleColor = 'rgba(255, 255, 255, 0.1)';
  expandSections: Map<ExpandableSectionId, boolean>;

  constructor(
    private router: Router,
    private store: StoreService,
    private expandedTilesStore: ExpandedTilesStoreService,
  ) {
    this.currentUrl = router.url;

    router.events.subscribe((_: NavigationEnd) => {
      if (_ instanceof NavigationEnd) {
        this.currentUrl = _.url;
      }
    });

    this.expandedTilesStore.getStates().subscribe({
      next: (state) => {
        this.expandSections = state;
      },
    });
  }

  /**
   * Navigate or expand children based on item if ctrl (metaKey) is not pressed
   * @param link SideMenuLink with url and list of children
   * @param event mouse event used for detect ctrlKey (support for Windows/Linux keyboards) or metaKey (support for Mac keyboards)
   */
  navigateOrExpandSideMenu(link: SideMenuLink, event: MouseEvent): void {
    if (!event.ctrlKey && !event.metaKey) {
      if (!link.children) {
        void this.router.navigate(link.url);
      } else {
        this.expandedTilesStore.setItem(link.showChildren);
      }
    }
  }
}
