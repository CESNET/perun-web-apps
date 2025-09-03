import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { OneEntityAttributePageComponent } from '../../../../shared/components/one-entity-attribute-page/one-entity-attribute-page.component';
import { TwoEntityAttributePageComponent } from '../../../../shared/components/two-entity-attribute-page/two-entity-attribute-page.component';
import { LoaderDirective, MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  GroupsManagerService,
  Member,
  MembersManagerService,
  RichGroup,
  UsersManagerService,
  Vo,
} from '@perun-web-apps/perun/openapi';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Urns } from '@perun-web-apps/perun/urns';
import { compareFnName } from '@perun-web-apps/perun/utils';
import {
  GroupsListComponent,
  MemberOverviewMembershipComponent,
  VoSearchSelectComponent,
} from '@perun-web-apps/perun/components';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';

@Component({
  imports: [
    CommonModule,
    UiAlertsModule,
    MiddleClickRouterLinkDirective,
    OneEntityAttributePageComponent,
    TwoEntityAttributePageComponent,
    MatTabsModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TranslateModule,
    GroupsListComponent,
    MemberOverviewMembershipComponent,
    VoSearchSelectComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'app-perun-web-apps-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.css'],
})
export class UserAccountsComponent implements OnInit {
  initLoading = false;
  loading = false;
  vos: Vo[] = [];
  selectedVo: Vo = null;
  member: Member = null;
  groups: RichGroup[] = [];
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersManagerService,
    private membersService: MembersManagerService,
    private groupService: GroupsManagerService,
  ) {}

  ngOnInit(): void {
    this.initLoading = true;
    this.route.parent.params.subscribe((params) => {
      this.userId = Number(params['userId']);
      this.usersService.getVosWhereUserIsMember(this.userId).subscribe({
        next: (vos) => {
          this.vos = vos;
          if (this.vos.length) {
            this.loadMember(this.vos.sort(compareFnName)[0]);
          }
          this.initLoading = false;
        },
        error: () => (this.initLoading = false),
      });
    });
  }

  loadMember(vo: Vo): void {
    this.loading = true;
    this.selectedVo = vo;
    this.membersService.getMemberByUser(this.selectedVo.id, this.userId).subscribe({
      next: (member) => {
        this.membersService.getRichMemberWithAttributes(member.id).subscribe({
          next: (m) => {
            this.member = m;
            this.groupService
              .getMemberRichGroupsWithAttributesByNames(this.member.id, [
                Urns.MEMBER_DEF_GROUP_EXPIRATION,
                Urns.MEMBER_GROUP_STATUS,
              ])
              .subscribe({
                next: (groups) => {
                  this.groups = groups;
                  this.loading = false;
                },
                error: () => (this.loading = false),
              });
          },
          error: () => (this.loading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }
}
