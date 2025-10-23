import { MatNavList, MatListItem } from '@angular/material/list';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { CustomTranslatePipe, LocalisedTextPipe } from '@perun-web-apps/perun/pipes';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SideMenuItem, SideMenuItemService } from '../../services/side-menu-item.service';
import { StoreService } from '@perun-web-apps/perun/services';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatRipple } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    CustomTranslatePipe,
    MiddleClickRouterLinkDirective,
    RouterModule,
    MatNavList,
    MatListItem,
    TranslateModule,
    LocalisedTextPipe,
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
  lang = 'en';
  textColor = this.storeService.getProperty('theme').sidemenu_text_color;
  private currentUrl: string;

  constructor(
    private sideMenuItemService: SideMenuItemService,
    private storeService: StoreService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private translateService: TranslateService,
  ) {
    this.currentUrl = router.url;
    this.matIconRegistry.addSvgIcon(
      'orcid',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/PerunWebImages/orcid.svg'),
    );
    router.events.subscribe((_: NavigationEnd) => {
      if (_ instanceof NavigationEnd) {
        this.currentUrl = _.url;
      }
    });
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((lang) => {
      const { lang: lan } = lang;
      this.lang = lan;
    });
    const displayedTabs: string[] = this.storeService.getProperty('displayed_tabs');
    this.items = this.sideMenuItemService.getSideMenuItems();

    this.items = this.items.filter((item) => displayedTabs.includes(item.tabName));
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

  goToURL(link: string): void {
    window.open(link, '_blank');
  }
}
