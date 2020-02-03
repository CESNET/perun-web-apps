import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import { MembersService } from '@perun-web-apps/perun/services';
import { RichMember } from '@perun-web-apps/perun/models';
import { Urns } from '@perun-web-apps/perun/urns';
import { AddMemberDialogComponent } from '../../../../shared/components/dialogs/add-member-dialog/add-member-dialog.component';
import { MatDialog } from '@angular/material';
import { RemoveMembersDialogComponent } from '../../../../shared/components/dialogs/remove-members-dialog/remove-members-dialog.component';
import { Group, GroupsManagerService } from '@perun-web-apps/perun/openapi';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit {

  static id = 'GroupMembersComponent';

  // used for router animation
  @HostBinding('class.router-component') true;

  constructor(
    private membersService: MembersService,
    private groupService: GroupsManagerService,
    protected route: ActivatedRoute,
    protected router: Router,
    private dialog: MatDialog
  ) { }

  group: Group;

  members: RichMember[] = null;
  selection: SelectionModel<RichMember>;

  searchString = '';
  firstSearchDone = false;

  loading = false;
  data: 'search' | 'all';

  private attrNames = [
    Urns.MEMBER_DEF_ORGANIZATION,
    Urns.MEMBER_DEF_MAIL,
    Urns.USER_DEF_ORGANIZATION,
    Urns.USER_DEF_PREFERRED_MAIL
  ];

  ngOnInit() {
    this.selection = new SelectionModel<RichMember>(true, []);
    this.route.parent.params.subscribe(parentParams => {
      const groupId = parentParams['groupId'];

      this.groupService.getGroupById(groupId).subscribe(group => {
        this.group = group;
      });
    });
  }

  onSearchByString() {
    this.data = 'search';
    this.firstSearchDone = true;

    this.refreshTable();
  }

  onListAll() {
    this.data = 'all';
    this.firstSearchDone = true;

   this.refreshTable();
  }

  onAddMember() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '1000px',
      data: {
        voId: this.group.voId,
        group: this.group,
        entityId: this.group.id,
        theme: 'group-theme',
        type: 'group',
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.firstSearchDone) {
        this.refreshTable();
      }
    });
  }

  onKeyInput(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.searchString.length > 0) {
      this.onSearchByString();
    }
  }

  onRemoveMembers() {
    const dialogRef = this.dialog.open(RemoveMembersDialogComponent, {
      width: '450px',
      data: {
        groupId: this.group.id,
        members: this.selection.selected
      }
    });

    dialogRef.afterClosed().subscribe(wereMembersDeleted => {
      if (wereMembersDeleted) {
        this.refreshTable();
      }
    });
  }

  refreshTable() {
    this.loading = true;
    this.selection.clear();
    switch (this.data) {
      case 'all': {
        this.membersService.getCompleteRichMembersForGroup(this.group.id, this.attrNames).subscribe(
          members => {
            this.members = members;
            this.loading = false;
          },
          () => this.loading = false
        );
        break;
      }
      case 'search': {
        this.membersService.findCompleteRichMembersForGroup(this.group.id, this.searchString, this.attrNames).subscribe(
          members => {
            this.members = members;
            this.loading = false;
          },
          () => this.loading = false
        );
        break;
      }
    }
  }
}
