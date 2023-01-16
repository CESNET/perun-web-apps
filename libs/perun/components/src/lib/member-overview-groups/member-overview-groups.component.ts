import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  Attribute,
  Group,
  GroupsManagerService,
  RichGroup,
  RichMember,
} from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig, getRecentlyVisitedIds } from '@perun-web-apps/perun/utils';
import { Urns } from '@perun-web-apps/perun/urns';
import { MatTableDataSource } from '@angular/material/table';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import {
  ChangeGroupExpirationDialogComponent,
  ChangeMemberStatusDialogComponent,
} from '@perun-web-apps/perun/dialogs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'perun-web-apps-member-overview-groups',
  templateUrl: './member-overview-groups.component.html',
  styleUrls: ['./member-overview-groups.component.css'],
})
export class MemberOverviewGroupsComponent implements OnChanges {
  @Input() voId: number;
  @Input() member: RichMember;
  @Input() openedInDialog = false;
  @Output() statusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  loading: boolean;
  initLoading: boolean;
  groups: Group[];
  recentIds: number[];
  filterValue: string;
  selectedGroup: Group;
  selectedMember: RichMember;
  noGroups = false;
  groupMembershipDataSource = new MatTableDataSource<string>();
  expiration = '';
  expirationAtt: Attribute;
  displayedColumns = ['attName', 'attValue'];

  constructor(
    private groupsManager: GroupsManagerService,
    public authResolver: GuiAuthResolver,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    this.loading = true;
    this.initLoading = true;
    this.groupMembershipDataSource = new MatTableDataSource<string>(['Status', 'Expiration']);
    this.groupsManager.getMemberGroups(this.member.id).subscribe((groups) => {
      this.groups = groups;
      if (this.groups.length === 0) {
        this.noGroups = true;
        return;
      }
      const initiallySelectedGroup = this.findInitiallySelectedGroupId();
      this.groupIsSelected(initiallySelectedGroup);
      this.initLoading = false;
    });
  }

  findInitiallySelectedGroupId(): Group {
    this.recentIds = getRecentlyVisitedIds('groups');
    if (this.recentIds) {
      const foundedGroup = this.groups.find((group) => group.id === this.recentIds[0]);
      if (foundedGroup) {
        return foundedGroup;
      }
    }
    return this.groups[0];
  }

  groupIsSelected(event: RichGroup): void {
    this.loading = true;
    this.selectedGroup = event;
    this.groupsManager
      .getGroupRichMembersByIds(
        this.selectedGroup.id,
        [this.member.id],
        [Urns.MEMBER_DEF_GROUP_EXPIRATION]
      )
      .subscribe((members) => {
        this.selectedMember = members[0];
        this.expirationAtt = this.selectedMember.memberAttributes.find(
          (att) => att.baseFriendlyName === 'groupMembershipExpiration'
        );
        if (this.expirationAtt) {
          this.groupMembershipDataSource = new MatTableDataSource<string>(['Status', 'Expiration']);
          this.expiration = !this.expirationAtt.value
            ? (this.translate.instant('MEMBER_DETAIL.OVERVIEW.NEVER_EXPIRES') as string)
            : (this.expirationAtt.value as string);
        } else {
          this.groupMembershipDataSource = new MatTableDataSource<string>(['Status']);
        }
        this.loading = false;
      });
  }

  changeExpiration(statusChanged = false): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = {
      memberId: this.member.id,
      groupId: this.selectedGroup.id,
      expirationAttr: this.expirationAtt,
      status: this.selectedMember.groupStatus,
      statusChanged: statusChanged,
      backButton: this.openedInDialog,
    };

    const dialogRef = this.dialog.open(ChangeGroupExpirationDialogComponent, config);
    dialogRef.afterClosed().subscribe((result: { success: boolean; member: RichMember }) => {
      if (result.success) {
        this.groupIsSelected(this.selectedGroup);
        this.dialog.closeAll();
      } else if (statusChanged) {
        this.statusChanged.emit(statusChanged);
      }
    });
  }

  changeStatus(): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.data = {
      member: this.selectedMember,
      voId: this.voId,
      groupId: this.selectedGroup.id,
      backButton: this.openedInDialog,
    };

    const dialogRef = this.dialog.open(ChangeMemberStatusDialogComponent, config);
    dialogRef.afterClosed().subscribe((member: RichMember) => {
      if (member) {
        this.selectedMember = member;
        this.changeExpiration(true);
      }
    });
  }
}
