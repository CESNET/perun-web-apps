import { Component, HostBinding, OnInit } from '@angular/core';
import { User, UsersManagerService } from '@perun-web-apps/perun/openapi';
import {
  ApiRequestConfigurationService,
  NotificatorService,
  OtherApplicationsService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { SideMenuService } from '../../../../core/services/common/side-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { MailChangeFailedDialogComponent } from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-perun-web-apps-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  @HostBinding('class.router-component') true;
  user: User;
  roles: { [key: string]: { [key: string]: Array<number> } } = {};
  roleNames: string[];
  hasOnlyNoRightsRoles = false;
  rightSettingOpened = false;
  recentlyViewedShow = true;
  rolesToHide: string[] = [];
  noRightsRoles = new Set<string>(['SELF', 'MEMBERSHIP', 'SPONSORSHIP']);
  allowedRoles = [
    'VOADMIN',
    'GROUPADMIN',
    'FACILITYADMIN',
    'SPONSOR',
    'RESOURCEADMIN',
    'TOPGROUPCREATOR',
    'VOOBSERVER',
    'GROUPOBSERVER',
    'GROUPMEMBERSHIPMANAGER',
    'FACILITYOBSERVER',
    'RESOURCEOBSERVER',
    'SERVICEACCOUNTCREATOR',
  ];
  mailSuccessMessage: string;

  constructor(
    private userManager: UsersManagerService,
    private storeService: StoreService,
    private sideMenuService: SideMenuService,
    private route: ActivatedRoute,
    private router: Router,
    private notificator: NotificatorService,
    public translateService: TranslateService,
    private dialog: MatDialog,
    private apiRequestConfiguration: ApiRequestConfigurationService,
    private otherApplicationService: OtherApplicationsService,
  ) {
    translateService
      .get('USER_DETAIL.DASHBOARD.MAIL_CHANGE_SUCCESS')
      .subscribe((res: string) => (this.mailSuccessMessage = res));
  }

  ngOnInit(): void {
    this.sideMenuService.setHomeItems([]);
    this.validatePreferredMailChange();

    this.user = this.storeService.getPerunPrincipal()?.user;
    this.roles = this.storeService.getPerunPrincipal()?.roles ?? {};
    const allUserRoles = Object.keys(this.roles);
    this.hasOnlyNoRightsRoles = allUserRoles.every((role) => this.noRightsRoles.has(role));
    this.roleNames = this.allowedRoles.filter((value) => allUserRoles.includes(value));
    this.getDashboardSettings();
  }

  recentlyViewedChanged(): void {
    localStorage.setItem('showRecentlyViewed', JSON.stringify(this.recentlyViewedShow));
  }

  changeRoleView(roleName: string): void {
    if (!this.isRoleShowed(roleName)) {
      this.rolesToHide = this.rolesToHide.filter((obj) => obj !== roleName);
    } else {
      const newRolesToHide: string[] = [];
      for (const role of this.roleNames) {
        if (!this.isRoleShowed(role)) {
          newRolesToHide.push(role);
        }
        if (role === roleName) {
          newRolesToHide.push(role);
        }
      }
      this.rolesToHide = newRolesToHide;
    }
    localStorage.setItem('rolesToHide', JSON.stringify(this.rolesToHide));
  }

  isRoleShowed(roleName: string): boolean {
    return !this.rolesToHide.includes(roleName);
  }

  private validatePreferredMailChange(): void {
    const params = this.route.snapshot.queryParamMap;
    const token = params.get('token');
    const u = params.get('u');
    if (token && u) {
      this.apiRequestConfiguration.dontHandleErrorForNext();
      this.userManager
        .validatePreferredEmailChangeWithToken({ token: token, u: Number.parseInt(u, 10) })
        .subscribe({
          next: () => {
            this.notificator.showSuccess(this.mailSuccessMessage);
            void this.router.navigate([], { replaceUrl: true, queryParamsHandling: 'preserve' });
          },
          error: () => {
            const config = getDefaultDialogConfig();
            config.width = '600px';

            const dialogRef = this.dialog.open(MailChangeFailedDialogComponent, config);
            dialogRef.afterClosed().subscribe(() => {
              this.getDashboardSettings();
            });
          },
        });
    }
  }

  private getDashboardSettings(): void {
    const recentlyViewedShow = JSON.parse(localStorage.getItem('showRecentlyViewed')) as boolean;
    this.recentlyViewedShow = recentlyViewedShow === null ? true : recentlyViewedShow;

    const rolesToHide = JSON.parse(localStorage.getItem('rolesToHide')) as string[];
    this.rolesToHide = rolesToHide === null ? [] : rolesToHide;
  }
}
