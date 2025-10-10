import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnimatedRouterOutletComponent } from '../../../shared/components/animated-router-outlet/animated-router-outlet.component';
import { PerunSharedComponentsModule } from '@perun-web-apps/perun/components';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SideMenuItemService } from '../../../shared/side-menu/side-menu-item.service';
import { SideMenuService } from '../../../core/services/common/side-menu.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { fadeIn } from '@perun-web-apps/perun/animations';
import { EntityStorageService, GuiAuthResolver } from '@perun-web-apps/perun/services';
import {
  MembersManagerService,
  RichMember,
  Vo,
  VosManagerService,
} from '@perun-web-apps/perun/openapi';
import { EntityPathParam } from '@perun-web-apps/perun/models';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MiddleClickRouterLinkDirective,
    PerunSharedComponentsModule,
    AnimatedRouterOutletComponent,
    RouterModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
  ],
  standalone: true,
  selector: 'app-member-detail-page',
  templateUrl: './member-detail-page.component.html',
  styleUrls: ['./member-detail-page.component.scss'],
  animations: [fadeIn],
})
export class MemberDetailPageComponent implements OnInit {
  vo: Vo;
  member: RichMember;
  fullName = '';
  isAuthorized = false;
  loading = false;
  svgIcon = 'perun-user-dark';

  constructor(
    private sideMenuItemService: SideMenuItemService,
    private translate: TranslateService,
    private sideMenuService: SideMenuService,
    private membersService: MembersManagerService,
    private voService: VosManagerService,
    private route: ActivatedRoute,
    private authResolver: GuiAuthResolver,
    private entityService: EntityStorageService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params) => {
      const voId = Number(params['voId']);
      const memberId = Number(params['memberId']);
      this.isAuthorized = this.authResolver.isPerunAdminOrObserver();

      this.voService.getVoById(voId).subscribe({
        next: (vo) => {
          this.vo = vo;
          this.membersService.getRichMemberWithAttributes(memberId).subscribe({
            next: (member) => {
              this.member = member;
              this.svgIcon = this.member.user.serviceUser
                ? 'perun-service-identity'
                : 'perun-user-dark';
              this.entityService.setEntityAndPathParam(
                {
                  id: member.id,
                  beanName: member.beanName,
                  voId: member.voId,
                  userId: member.userId,
                },
                EntityPathParam.Member,
              );
              const voSideMenuItem = this.sideMenuItemService.parseVo(this.vo);
              const memberSideMenuItem = this.sideMenuItemService.parseMember(this.member);
              this.fullName = memberSideMenuItem.label;
              this.sideMenuService.setAccessMenuItems([voSideMenuItem, memberSideMenuItem]);
              this.loading = false;
            },
            error: () => (this.loading = false),
          });
        },
        error: () => (this.loading = false),
      });
    });
  }
}
