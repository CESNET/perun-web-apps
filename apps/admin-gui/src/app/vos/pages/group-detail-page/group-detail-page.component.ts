import {Component, OnInit} from '@angular/core';
import {SideMenuService} from '../../../core/services/common/side-menu.service';
import {ActivatedRoute} from '@angular/router';
import {SideMenuItemService} from '../../../shared/side-menu/side-menu-item.service';
import {fadeIn} from '../../../shared/animations/Animations';
import { VoService } from '@perun-web-apps/perun/services';
import { Vo } from '@perun-web-apps/perun/models';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-group-detail-page',
  templateUrl: './group-detail-page.component.html',
  styleUrls: ['./group-detail-page.component.scss'],
  animations: [
    fadeIn
  ]
})
export class GroupDetailPageComponent implements OnInit {

  constructor(
    private sideMenuService: SideMenuService,
    private voService: VoService,
    private route: ActivatedRoute,
    private sideMenuItemService: SideMenuItemService,
    private groupService: GroupsManagerService
  ) {}

  vo: Vo;
  group: Group;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const voId = params['voId'];
      const groupId = params['groupId'];

      this.voService.getVoById(voId).subscribe(vo => {
        this.vo = vo;
        this.groupService.getGroupById(groupId).subscribe(group => {
          this.group = group;
          const voSideMenuItem = this.sideMenuItemService.parseVo(vo);
          const groupSideMenuItem = this.sideMenuItemService.parseGroup(group);

          this.sideMenuService.setAccessMenuItems([voSideMenuItem, groupSideMenuItem]);
        });
      });
    });
  }
}
