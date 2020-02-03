import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Role } from '@perun-web-apps/perun/models';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-group-settings-managers',
  templateUrl: './group-settings-managers.component.html',
  styleUrls: ['./group-settings-managers.component.scss']
})
export class GroupSettingsManagersComponent implements OnInit {

  @HostBinding('class.router-component') true;

  constructor(
    private groupService: GroupsManagerService,
    private route: ActivatedRoute
  ) { }

  group: Group;

  availableRoles: Role[] = [ Role.GROUPADMIN ];

  selected = 'user';

  type = 'Group';

  theme = 'group-theme';

  ngOnInit() {
    this.route.parent.parent.params.subscribe(parentParentParams => {
      const groupId = parentParentParams ['groupId'];

      this.groupService.getGroupById(groupId).subscribe(group => {
        this.group = group;
      });
    });
  }
}
