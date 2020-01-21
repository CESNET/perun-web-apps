import {Component, HostBinding, OnInit} from '@angular/core';
import {MenuItem} from '../../../../shared/models/MenuItem';
import {ActivatedRoute} from '@angular/router';
import { GroupService } from '@perun-web-apps/perun/services';
import { Group } from '@perun-web-apps/perun/models';

@Component({
  selector: 'app-group-overview',
  templateUrl: './group-overview.component.html',
  styleUrls: ['./group-overview.component.scss']
})
export class GroupOverviewComponent implements OnInit {

  // used for router animation
  @HostBinding('class.router-component') true;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) { }

  navItems: MenuItem[] = [];
  groupId: number;
  group: Group;
  parentGroup: Group = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupId = params['groupId'];


      this.groupService.getGroupById(this.groupId).subscribe(group => {
        this.group = group;

        if (this.group.parentGroupId !== null) {
          this.loadParentGroupData();
        } else {
          this.parentGroup = null;
          this.initNavItems();
        }
      });
    });
  }

  private loadParentGroupData() {
    this.groupService.getGroupById(this.group.parentGroupId).subscribe(parentGroup => {
      this.parentGroup = parentGroup;
      this.initNavItems();
    });
  }

  private initNavItems() {
    this.navItems = [
      {
        cssIcon: 'perun-user',
        url: `/organizations/${this.group.voId}/groups/${this.groupId}/members`,
        label: 'MENU_ITEMS.GROUP.MEMBERS',
        style: 'group-btn'
      },
      {
        cssIcon: 'perun-group',
        url: `/organizations/${this.group.voId}/groups/${this.groupId}/subgroups`,
        label: 'MENU_ITEMS.GROUP.SUBGROUPS',
        style: 'group-btn'
      },
      {
        cssIcon: 'perun-manage-facility',
        url: `/organizations/${this.group.voId}/groups/${this.groupId}/resources`,
        label: 'MENU_ITEMS.GROUP.RESOURCES',
        style: 'group-btn'
      },
      {
        cssIcon: 'perun-applications',
        url: `/organizations/${this.group.voId}/groups/${this.groupId}/applications`,
        label: 'MENU_ITEMS.GROUP.APPLICATIONS',
        style: 'group-btn'
      },
      {
        cssIcon: 'perun-settings2',
        url: `/organizations/${this.group.voId}/groups/${this.groupId}/settings`,
        label: 'MENU_ITEMS.GROUP.SETTINGS',
        style: 'group-btn'
      },
    ];
  }
}
