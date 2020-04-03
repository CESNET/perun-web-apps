import {Component, HostBinding, OnInit} from '@angular/core';
import {SideMenuService} from '../../../../../core/services/common/side-menu.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem} from '../../../../../../../../../libs/perun/models/src/lib/MenuItem';
import { MembersService } from '@perun-web-apps/perun/services';
import { Member, Vo, VosManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-member-settings-overview',
  templateUrl: './member-settings-overview.component.html',
  styleUrls: ['./member-settings-overview.component.scss']
})
export class MemberSettingsOverviewComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private sideMenuService: SideMenuService,
    private voService: VosManagerService,
    private memberService: MembersService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
  }

  items: MenuItem[] = [];
  vo: Vo;
  member: Member;

  ngOnInit() {
    this.route.parent.parent.params.subscribe(grandParentParams => {
      const voId = grandParentParams['voId'];
      const memberId = grandParentParams['memberId'];
      this.memberService.getMemberById(memberId).subscribe(member => {
        this.member = member;

        this.voService.getVoById(voId).subscribe(vo => {
          this.vo = vo;

          this.initItems();
        });
      });
    });
  }

  private initItems() {
    this.items = [
      {
        cssIcon: 'perun-attributes',
        url: `/organizations/${this.vo.id}/members/${this.member.id}/settings/attributes`,
        label: 'MENU_ITEMS.MEMBER.ATTRIBUTES',
        style: 'member-btn'
      }
    ];
  }
}
