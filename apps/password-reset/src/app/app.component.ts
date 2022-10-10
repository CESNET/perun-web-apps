import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AttributesManagerService, UsersManagerService } from '@perun-web-apps/perun/openapi';
import { PreferredLanguageService, StoreService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { parseQueryParams } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'perun-web-apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('footer') footer: ElementRef<HTMLElement>;
  mode: string;
  token: string;
  namespace: string;
  login: string;
  validToken: boolean;
  authWithoutToken = false;
  contentHeight = 'calc(100vh - 84px)';
  contentBackgroundColor = this.store.getProperty('theme').content_bg_color;

  constructor(
    private dialog: MatDialog,
    private usersService: UsersManagerService,
    private preferredLangService: PreferredLanguageService,
    private translateService: TranslateService,
    private store: StoreService,
    private attributesManagerService: AttributesManagerService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const prefLang = this.preferredLangService.getPreferredLanguage(null);
    this.translateService.use(prefLang);

    const queryParams = location.search.substr(1);
    this.mode = queryParams.includes('activation') ? 'activation' : 'reset';
    this.namespace = parseQueryParams('namespace', queryParams);

    if (queryParams.includes('token')) {
      this.token = parseQueryParams('token', queryParams);

      this.usersService.checkPasswordResetRequestByTokenIsValid(this.token).subscribe(
        () => {
          this.validToken = true;
        },
        () => {
          this.validToken = false;
        }
      );
    } else {
      this.authWithoutToken = true;
      this.attributesManagerService
        .getLogins(this.store.getPerunPrincipal().userId)
        .subscribe((logins) => {
          const selectedLogin = logins.find(
            (login) => login.friendlyNameParameter === this.namespace
          );
          this.login = selectedLogin ? String(selectedLogin.value) : '';
        });
    }
  }

  ngAfterViewInit(): void {
    const footerHeight: string = this.footer?.nativeElement?.offsetHeight?.toString() ?? '0';
    this.contentHeight = 'calc(100vh - 84px - ' + footerHeight + 'px)';
    this.changeDetector.detectChanges();
  }
}
