import { Component, HostBinding, OnInit } from '@angular/core';
import { Group, GroupsManagerService, RoleManagementRules } from '@perun-web-apps/perun/openapi';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-settings-managers',
  templateUrl: './group-settings-managers.component.html',
  styleUrls: ['./group-settings-managers.component.scss'],
})
export class GroupSettingsManagersComponent implements OnInit {
  @HostBinding('class.router-component') true;
  loading = false;
  group: Group;
  availableRoles: RoleManagementRules[] = [];
  selected = 'user';
  type = 'Group';
  theme = 'group-theme';

  constructor(
    private guiAuthResolver: GuiAuthResolver,
    public route: ActivatedRoute,
    private groupsManager: GroupsManagerService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.pathFromRoot[2].params.subscribe((params) => {
      const groupId = Number(params['groupId']);

      this.groupsManager.getGroupById(groupId).subscribe({
        next: (group) => {
          this.group = group;
          this.guiAuthResolver.assignAvailableRoles(this.availableRoles, 'Group');
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    });
  }
}
