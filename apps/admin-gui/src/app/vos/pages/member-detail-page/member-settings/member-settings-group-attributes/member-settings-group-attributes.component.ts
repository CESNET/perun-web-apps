import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group, GroupsManagerService} from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-member-settings-group-attributes',
  templateUrl: './member-settings-group-attributes.component.html',
  styleUrls: ['./member-settings-group-attributes.component.scss']
})
export class MemberSettingsGroupAttributesComponent implements OnInit {

  constructor(protected route: ActivatedRoute,
              private groupsManagerService: GroupsManagerService) {
  }

  memberId: number;
  groups: Group[] = [];
  loading: boolean;

  ngOnInit(): void {
    this.loading = true;
    this.route.parent.parent.params.subscribe(parent => {
      this.memberId = parent['memberId'];
      this.groupsManagerService.getMemberGroups(this.memberId).subscribe(groups => {
        this.groups = groups;
        this.loading = false;
      });
    });
  }
}
