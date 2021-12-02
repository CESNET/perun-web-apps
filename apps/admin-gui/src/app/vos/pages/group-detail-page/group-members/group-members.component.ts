import { Component, HostBinding, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ApiRequestConfigurationService, EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
  StoreService
} from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import { AddMemberDialogComponent } from '../../../../shared/components/dialogs/add-member-dialog/add-member-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RemoveMembersDialogComponent } from '../../../../shared/components/dialogs/remove-members-dialog/remove-members-dialog.component';
import {
  AttributesManagerService,
  GroupsManagerService,
  RichGroup,
  RichMember
} from '@perun-web-apps/perun/openapi';
import { TABLE_GROUP_MEMBERS } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { InviteMemberDialogComponent } from '../../../../shared/components/dialogs/invite-member-dialog/invite-member-dialog.component';
import { FormControl } from '@angular/forms';

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
    private groupService: GroupsManagerService,
    private dialog: MatDialog,
    private guiAuthResolver: GuiAuthResolver,
    private storeService: StoreService,
    private attributesManager: AttributesManagerService,
    private apiRequest: ApiRequestConfigurationService,
    private notificator: NotificatorService,
    private entityStorageService: EntityStorageService
  ) { }

  group: RichGroup;
  selection: SelectionModel<RichMember>;
  synchEnabled = false;
  searchString: string;
  updateTable = false;
  loading = false;

  tableId = TABLE_GROUP_MEMBERS;

  memberAttrNames = [
    Urns.MEMBER_DEF_ORGANIZATION,
    Urns.MEMBER_DEF_MAIL,
    Urns.USER_DEF_ORGANIZATION,
    Urns.USER_DEF_PREFERRED_MAIL,
    Urns.MEMBER_DEF_EXPIRATION,
    Urns.MEMBER_DEF_GROUP_EXPIRATION
  ];

  private groupAttrNames = [
    Urns.GROUP_SYNC_ENABLED,
    Urns.GROUP_LAST_SYNC_STATE,
    Urns.GROUP_LAST_SYNC_TIMESTAMP,
    Urns.GROUP_STRUCTURE_SYNC_ENABLED,
    Urns.GROUP_LAST_STRUCTURE_SYNC_STATE,
    Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP
  ];

  addAuth: boolean;
  removeAuth: boolean;
  inviteAuth: boolean;
  blockManualMemberAdding: boolean;
  blockGroupManualMemberAdding: boolean;
  displayedColumns = ['checkbox', 'id', 'type', 'fullName', 'status', 'groupStatus', 'organization', 'email', 'logins'];

  statuses = new FormControl();
  statusList = ['VALID', 'INVALID', 'EXPIRED', 'DISABLED'];
  selectedStatuses: string[] = ['VALID', 'INVALID'];

  groupStatuses = new FormControl();
  groupStatusList = ['VALID', 'EXPIRED'];
  selectedGroupStatuses: ('VALID' | 'EXPIRED')[] = ['VALID'];

  ngOnInit() {
    this.loading = true;
    this.selection = new SelectionModel<RichMember>(true, []);
    this.statuses.setValue(this.selectedStatuses);
    this.groupStatuses.setValue(this.selectedGroupStatuses);
    this.memberAttrNames = this.memberAttrNames.concat(this.storeService.getLoginAttributeNames());
    this.group = this.entityStorageService.getEntity();
    this.setAuthRights();
    this.isManualAddingBlocked(this.group.voId, this.group.id).then(() => this.loadPage(this.group.id));
  }

  loadPage(groupId: number) {
    this.groupService.getRichGroupByIdWithAttributesByNames(groupId, this.groupAttrNames).subscribe(group => {
      this.group = group;
      this.synchEnabled = this.isSynchronized();
      this.loading = false;
    });
  }

  isSynchronized() {
    return this.group.groupAttributes.some(att =>
      att.friendlyName === "synchronizationEnabled" && att.value !== null && att.value.toString() === "true");
  }

  setAuthRights() {
    this.addAuth = this.guiAuthResolver.isAuthorized('addMembers_Group_List<Member>_policy', [this.group]);
    this.removeAuth = this.guiAuthResolver.isAuthorized('removeMembers_Group_List<Member>_policy', [this.group]);
    this.displayedColumns = this.removeAuth ? this.displayedColumns : ['id', 'type', 'fullName', 'status', 'groupStatus', 'organization', 'email', 'logins'];
    this.inviteAuth = this.guiAuthResolver.isAuthorized('group-sendInvitation_Vo_Group_String_String_String_policy', [this.group]);
  }


  onSearchByString(filter: string) {
    this.searchString = filter;
    this.updateTable = !this.updateTable;
  }

  onAddMember() {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      voId: this.group.voId,
      group: this.group,
      entityId: this.group.id,
      manualAddingBlocked: this.blockManualMemberAdding,
      theme: 'group-theme',
      type: 'group',
    };

    const dialogRef = this.dialog.open(AddMemberDialogComponent, config);

    dialogRef.afterClosed().subscribe((success) => {
      if(success) {
        this.selection.clear();
        this.updateTable = !this.updateTable;
      }
    });
  }

  onRemoveMembers() {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      groupId: this.group.id,
      members: this.selection.selected,
      theme: 'group-theme'
    };

    const dialogRef = this.dialog.open(RemoveMembersDialogComponent, config);

    dialogRef.afterClosed().subscribe(wereMembersDeleted => {
      if (wereMembersDeleted) {
        this.selection.clear();
        this.updateTable = !this.updateTable;
      }
    });
  }

  onInviteMember(){
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      voId: this.group.voId,
      groupId: this.group.id,
      theme: 'group-theme'
    };

    this.dialog.open(InviteMemberDialogComponent, config);

  }

  displaySelectedStatuses(): string {
    if(this.selectedStatuses.length === this.statusList.length){
      return 'ALL';
    }
    if(this.statuses.value){
      return `${this.statuses.value[0]}  ${this.statuses.value.length > 1 ? ('(+' + (this.statuses.value.length - 1) +' '+ (this.statuses.value.length === 2 ? 'other)' : 'others)')) : ''}`;
    }
    return '';
  }

  displaySelectedGroupStatuses(): string {
    if(this.selectedGroupStatuses.length === this.groupStatusList.length){
      return 'ALL';
    } else {
      return `${this.groupStatuses.value[0]}`;
    }
  }

  isManualAddingBlocked(voId: number, groupId: number): Promise<void> {
    return new Promise((resolve) => {
      this.apiRequest.dontHandleErrorForNext();
      this.attributesManager.getVoAttributeByName(voId, 'urn:perun:vo:attribute-def:def:blockManualMemberAdding').subscribe(attrValue => {
        this.blockManualMemberAdding = attrValue.value !== null;
        this.apiRequest.dontHandleErrorForNext();
        this.attributesManager.getGroupAttributeByName(groupId, 'urn:perun:group:attribute-def:def:blockManualMemberAdding').subscribe(groupAttrValue => {
          this.blockGroupManualMemberAdding = groupAttrValue.value !== null;
          resolve();
        }, error => {
          if (error.error.name !== 'PrivilegeException') {
            this.notificator.showError(error);
          }
          resolve();
        });
      }, error => {
        if (error.error.name !== 'PrivilegeException') {
          this.notificator.showError(error);
        }
        resolve();
      });
    });
  }

  changeVoStatuses() {
    this.selectedStatuses = this.statuses.value;
  }

  changeGroupStatuses() {
    this.selectedGroupStatuses = this.groupStatuses.value;
  }
}
