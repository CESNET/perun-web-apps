import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OneEntityAttributePageComponent } from '../../../../shared/components/one-entity-attribute-page/one-entity-attribute-page.component';
import { TwoEntityAttributePageComponent } from '../../../../shared/components/two-entity-attribute-page/two-entity-attribute-page.component';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import { Member, MembersManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  imports: [
    CommonModule,
    OneEntityAttributePageComponent,
    TwoEntityAttributePageComponent,
    MatTabsModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-member-attributes',
  templateUrl: './member-attributes.component.html',
  styleUrls: ['./member-attributes.component.scss'],
})
export class MemberAttributesComponent implements OnInit {
  @HostBinding('class.router-component') true;
  member: Member;
  memberResourceAttAuth: boolean;
  memberGroupAttAuth: boolean;
  userFacilityAttAuth: boolean;

  constructor(
    private route: ActivatedRoute,
    private authResolver: GuiAuthResolver,
    private memberManager: MembersManagerService,
    private entityService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.member = this.entityService.getEntity();

    this.memberGroupAttAuth = this.authResolver.isAuthorized('getMemberGroups_Member_policy', [
      this.member,
    ]);
    this.memberResourceAttAuth = this.authResolver.isAuthorized(
      'getAssignedResourcesWithStatus_Member_policy',
      [this.member],
    );
    this.userFacilityAttAuth = this.authResolver.isAuthorized('getAssignedFacilities_User_policy', [
      { beanName: 'User', id: this.member.userId },
    ]);
  }
}
