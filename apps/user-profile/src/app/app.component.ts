import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  InitAuthService,
  StoreService,
  PreferredLanguageService,
  AuthService,
} from '@perun-web-apps/perun/services';
import { AttributesManagerService, PerunPrincipal } from '@perun-web-apps/perun/openapi';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'perun-web-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  static minWidth = 992;
  @ViewChild('footer') footer: ElementRef<HTMLDivElement>;
  sidebarMode: 'over' | 'push' | 'side' = 'side';
  sideMenuBgColor = this.store.getProperty('theme').sidemenu_bg_color;
  contentBackgroundColor = this.store.getProperty('theme').content_bg_color;
  displayWarning: boolean = this.store.getProperty('display_warning');
  warningMessage: string = this.store.getProperty('warning_message');
  isLoginScreenShown: boolean;
  isServiceAccess: boolean;
  contentHeight = this.displayWarning ? 'calc(100vh - 112px)' : 'calc(100vh - 64px)';
  headerLabel = this.store.getProperty('header_label_en');
  principal: PerunPrincipal;

  constructor(
    private store: StoreService,
    private attributesManagerService: AttributesManagerService,
    private translateService: TranslateService,
    private initAuth: InitAuthService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private preferredLangService: PreferredLanguageService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(): void {
    this.sidebarMode = this.isMobile() ? 'over' : 'side';
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((langChange: LangChangeEvent) => {
      const documentTitle = this.store.getProperty('document_title');
      const title: string = langChange.lang === 'en' ? documentTitle.en : documentTitle.cs;
      this.titleService.setTitle(title);
      this.document.documentElement.lang = langChange.lang;
    });

    this.isLoginScreenShown = this.initAuth.isLoginScreenShown();
    this.isServiceAccess = this.initAuth.isServiceAccessLoginScreenShown();
    sessionStorage.removeItem('baLogout');
    if (this.isLoginScreenShown || this.isServiceAccess) {
      const preferredLanguage = this.preferredLangService.getPreferredLanguage(null);
      this.headerLabel = this.store.getProperty(
        preferredLanguage === 'en' ? 'header_label_en' : 'header_label_cs',
      );
      return;
    }
    this.principal = this.store.getPerunPrincipal();
    if (this.principal?.userId) {
      this.attributesManagerService.getUserAttributes(this.principal.userId).subscribe((atts) => {
        const userPrefLang = atts.find((elem) => elem.friendlyName === 'preferredLanguage');
        const userLang = (userPrefLang?.value as string) ?? null;

        const prefLang = this.preferredLangService.getPreferredLanguage(userLang);
        this.translateService.use(prefLang);
      });
    }
  }

  getTopGap(): number {
    return this.displayWarning ? 112 : 64;
  }

  getSideNavMarginTop(): string {
    return this.displayWarning ? '112px' : '64px';
  }

  getSideNavMinHeight(): string {
    return this.displayWarning ? 'calc(100vh - 112px)' : 'calc(100vh - 64px)';
  }

  getNavMenuTop(): string {
    return this.displayWarning ? '48px' : '0';
  }

  isMobile(): boolean {
    return window.innerWidth <= AppComponent.minWidth;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn() || this.initAuth.isServiceAccess();
  }

  ngAfterViewInit(): void {
    const footerHeight: string = this.footer?.nativeElement?.offsetHeight?.toString() ?? '0';
    this.contentHeight = this.displayWarning
      ? 'calc(100vh - ' + footerHeight + 'px - 112px)'
      : 'calc(100vh - ' + footerHeight + 'px - 64px)';
    this.changeDetector.detectChanges();
  }
}
