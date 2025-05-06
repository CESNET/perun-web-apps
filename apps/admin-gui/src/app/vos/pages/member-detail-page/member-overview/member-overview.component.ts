import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, Role } from '@perun-web-apps/perun/models';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PasswordResetRequestDialogComponent } from '../../../../shared/components/dialogs/password-reset-request-dialog/password-reset-request-dialog.component';
import {
  Attribute,
  AttributesManagerService,
  MembersManagerService,
  RichMember,
  Sponsor,
  UsersManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import {
  FindSponsorsService,
  GuiAuthResolver,
  RoutePolicyService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { EditMemberSponsorsDialogComponent } from '../../../../shared/components/dialogs/edit-member-sponsors-dialog/edit-member-sponsors-dialog.component';
import { SponsorThisMemberDialogComponent } from '../../../../shared/components/dialogs/sponsor-this-member-dialog/sponsor-this-member-dialog.component';

@Component({
  selector: 'app-member-overview',
  templateUrl: './member-overview.component.html',
  styleUrls: ['./member-overview.component.scss'],
})
export class MemberOverviewComponent implements OnInit {
  // used for router animation
  @HostBinding('class.router-component') true;
  expiration = '';
  logins: Attribute[] = [];
  member: RichMember = null;
  navItems: MenuItem[] = [];
  attUrns: string[];
  attributeNames: Array<string> = [];
  attributes: Map<string, string[]> = new Map<string, string[]>();
  dataSource = new MatTableDataSource<string>();
  displayedColumns = ['attName', 'attValue'];
  sponsorshipEnabled = false;
  sponsors: Sponsor[] = [];
  sponsorsDataSource = new MatTableDataSource<Sponsor>();
  vo: Vo;
  loading = false;
  pwdResetAuth: boolean;
  isSponsor = false;
  canReadSponsors = false;
  canReadGroups = false;
  isPerunAdmin = false;
  sponsorButtonEnabled = false;

  constructor(
    private attributesManager: AttributesManagerService,
    private membersService: MembersManagerService,
    private usersManager: UsersManagerService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public authResolver: GuiAuthResolver,
    private storeService: StoreService,
    private routePolicyService: RoutePolicyService,
    private findSponsors: FindSponsorsService,
    private store: StoreService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.sponsorshipEnabled = this.store.getProperty('enable_sponsorships');
    this.route.parent.params.subscribe((parentParams) => {
      const memberId = Number(parentParams['memberId']);
      this.attributeNames = this.storeService.getMemberProfileAttributeNames();

      this.membersService.getRichMemberWithAttributes(memberId).subscribe((member) => {
        this.attUrns = this.storeService
          .getProperty('password_namespace_attributes')
          .map((urn: string) => {
            const urns: string[] = urn.split(':');
            return urns[urns.length - 1];
          });
        this.attributesManager.getLogins(member.userId).subscribe({
          next: (logins) => {
            this.logins = logins.filter((login) =>
              this.attUrns.includes(login.friendlyNameParameter),
            );
            this.member = member;

            this.initAttributes();
            this.dataSource = new MatTableDataSource<string>(Array.from(this.attributes.keys()));

            this.vo = {
              id: member.voId,
              beanName: 'Vo',
            };
            this.pwdResetAuth = this.authResolver.isAuthorized(
              'sendPasswordResetLinkEmail_Member_String_String_String_String_policy',
              [this.vo, this.member],
            );
            this.isPerunAdmin = this.authResolver.isPerunAdmin();
            this.isSponsor = this.authResolver.principalHasRole(Role.SPONSOR, 'Vo', this.vo.id);
            this.canReadSponsors = this.authResolver.isAuthorized(
              'getSponsorsForMember_Member_List<String>_policy',
              [this.member],
            );
            this.canReadGroups = this.authResolver.isAuthorized(
              'getGroupRichMembersByIds_int_List<Integer>_List<String>_policy',
              [this.vo],
            );
            if (this.sponsorshipEnabled && this.member.sponsored && this.canReadSponsors) {
              this.usersManager.getSponsorsForMember(this.member.id, null).subscribe((sponsors) => {
                this.sponsors = sponsors;
                this.sponsorsDataSource = new MatTableDataSource<Sponsor>(this.sponsors);

                this.initNavItems();
                this.refreshData();
              });
            } else {
              this.initNavItems();
              this.refreshData();
            }
          },
          error: () => {
            this.loading = false;
          },
        });
      });
    });
  }

  requestPwdReset(): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = {
      userId: this.member.userId,
      memberId: this.member.id,
      logins: this.logins,
    };

    this.dialog.open(PasswordResetRequestDialogComponent, config);
  }

  changeSponsors(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      sponsors: this.sponsors,
      member: this.member,
      theme: 'member-theme',
    };
    const dialogRef = this.dialog.open(EditMemberSponsorsDialogComponent, config);
    dialogRef.afterClosed().subscribe((edited) => {
      if (edited) {
        this.refreshData();
      }
    });
  }

  sponsorThisMember(): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = {
      theme: 'member-theme',
      member: this.member,
    };

    const dialogRef = this.dialog.open(SponsorThisMemberDialogComponent, config);

    dialogRef.afterClosed().subscribe((edited) => {
      if (edited) {
        this.refreshData();
      }
    });
  }

  private isSponsorButtonEnabled(): void {
    if (!this.sponsorshipEnabled) {
      this.sponsorButtonEnabled = false;
      return;
    }
    const sponsorIds = this.sponsors.map((sponsor) => sponsor.user.id);

    this.membersService.someAvailableSponsorExistsForMember(this.member.id).subscribe({
      next: (availableSponsorExists) => {
        this.sponsorButtonEnabled =
          (this.isSponsor && !sponsorIds.includes(this.storeService.getPerunPrincipal().user.id)) ||
          (this.isPerunAdmin && availableSponsorExists);
      },
      error: () => {
        this.sponsorButtonEnabled = false;
      },
    });
  }

  private initAttributes(): void {
    this.attributeNames.forEach((name) => {
      this.attributes.set(name, [null, '-']);
    });
    this.filterAttributes();
  }

  private filterAttributes(): void {
    if (this.member.memberAttributes !== null) {
      this.member.memberAttributes.forEach((att) => {
        if (this.attributeNames.includes(att.friendlyName)) {
          this.attributes.set(att.friendlyName, [att.displayName, att.value as string]);
        }
      });
    }

    if (this.member.userAttributes !== null) {
      this.member.userAttributes.forEach((att) => {
        if (this.attributeNames.includes(att.friendlyName)) {
          this.attributes.set(att.friendlyName, [att.displayName, att.value as string]);
        }
      });
    }
  }

  private initNavItems(): void {
    this.navItems = [];
    if (this.routePolicyService.canNavigate('members-groups', this.member)) {
      this.navItems.push({
        cssIcon: 'perun-group',
        url: `/organizations/${this.member.voId}/members/${this.member.id}/groups`,
        label: 'MENU_ITEMS.MEMBER.GROUPS',
        style: 'member-btn',
      });
    }
    if (this.routePolicyService.canNavigate('members-applications', this.member)) {
      this.navItems.push({
        cssIcon: 'perun-applications',
        url: `/organizations/${this.member.voId}/members/${this.member.id}/applications`,
        label: 'MENU_ITEMS.MEMBER.APPLICATIONS',
        style: 'member-btn',
      });
    }
    if (this.routePolicyService.canNavigate('members-resources', this.member)) {
      this.navItems.push({
        cssIcon: 'perun-resource',
        url: `/organizations/${this.member.voId}/members/${this.member.id}/resources`,
        label: 'MENU_ITEMS.MEMBER.RESOURCES',
        style: 'member-btn',
      });
    }
    if (this.routePolicyService.canNavigate('members-attributes', this.member)) {
      this.navItems.push({
        cssIcon: 'perun-attributes',
        url: `/organizations/${this.vo.id}/members/${this.member.id}/attributes`,
        label: 'MENU_ITEMS.MEMBER.ATTRIBUTES',
        style: 'member-btn',
      });
    }
    if (this.routePolicyService.canNavigate('members-bans', this.member)) {
      this.navItems.push({
        cssIcon: 'perun-ban',
        url: `/organizations/${this.vo.id}/members/${this.member.id}/bans`,
        label: 'MENU_ITEMS.MEMBER.BANS',
        style: 'member-btn',
      });
    }
  }

  private refreshData(): void {
    this.loading = true;
    this.membersService.getRichMemberWithAttributes(this.member.id).subscribe({
      next: (member) => {
        this.member = member;
        if (this.sponsorshipEnabled && member.sponsored && this.canReadSponsors) {
          this.usersManager.getSponsorsForMember(this.member.id, null).subscribe((sponsors) => {
            this.sponsors = sponsors;
            this.sponsorsDataSource.data = this.sponsors;
            this.isSponsorButtonEnabled();
          });
        } else {
          this.sponsors = [];
          this.sponsorsDataSource.data = this.sponsors;
          this.isSponsorButtonEnabled();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
