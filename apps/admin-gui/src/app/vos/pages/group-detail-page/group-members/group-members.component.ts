import { Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ApiRequestConfigurationService,
  EntityStorageService,
  GuiAuthResolver,
  MembersListService,
  NotificatorService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { Urns } from '@perun-web-apps/perun/urns';
import { MatDialog } from '@angular/material/dialog';
import { RemoveMembersDialogComponent } from '../../../../shared/components/dialogs/remove-members-dialog/remove-members-dialog.component';
import {
  AttributesManagerService,
  GroupsManagerService,
  MemberGroupStatus,
  MembersManagerService,
  PaginatedRichMembers,
  RegistrarManagerService,
  RichGroup,
  RichMember,
  VoMemberStatuses,
} from '@perun-web-apps/perun/openapi';
import { TABLE_GROUP_MEMBERS } from '@perun-web-apps/config/table-config';
import {
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  isGroupSynchronized,
} from '@perun-web-apps/perun/utils';
import { InviteMemberDialogComponent } from '../../../../shared/components/dialogs/invite-member-dialog/invite-member-dialog.component';
import { FormControl } from '@angular/forms';
import { PageQuery, RPCError } from '@perun-web-apps/perun/models';
import { GroupAddMemberDialogComponent } from '../../../components/group-add-member-dialog/group-add-member-dialog.component';
import { BulkInviteMembersDialogComponent } from '../../../../shared/components/dialogs/bulk-invite-members-dialog/bulk-invite-members-dialog.component';
import { CopyMembersDialogComponent } from '../../../../shared/components/dialogs/copy-members-dialog/copy-members-dialog-component';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { concatMap, map } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InvitePreapprovedMemberDialogComponent } from '../../../../shared/components/dialogs/invite-preapproved-member-dialog/invite-preapproved-member-dialog.component';
import { BulkInvitePreapprovedMembersDialogComponent } from '../../../../shared/components/dialogs/bulk-invite-preapproved-members-dialog/bulk-invite-preapproved-members-dialog.component';
import { ExportDataDialogComponent } from '@perun-web-apps/perun/table-utils';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss'],
})
export class GroupMembersComponent implements OnInit {
  static id = 'GroupMembersComponent';

  // used for router animation
  @HostBinding('class.router-component') true;
  group: RichGroup;
  selection = new SelectionModel<RichMember>(
    true,
    [],
    true,
    (richMember1, richMember2) => richMember1.id === richMember2.id,
  );
  synchEnabled = false;
  searchString = '';
  updateTable = false;
  tableId = TABLE_GROUP_MEMBERS;
  memberAttrNames = [
    Urns.MEMBER_DEF_ORGANIZATION,
    Urns.MEMBER_DEF_MAIL,
    Urns.USER_DEF_ORGANIZATION,
    Urns.USER_DEF_PREFERRED_MAIL,
    Urns.MEMBER_DEF_EXPIRATION,
    Urns.MEMBER_DEF_GROUP_EXPIRATION,
    Urns.MEMBER_LIFECYCLE_ALTERABLE,
  ];
  addAuth: boolean;
  removeAuth: boolean;
  inviteAuth: boolean;
  preApprovedInviteAuth: boolean;
  inviteDisabled = true;
  preApprovedInviteDisabled = true;
  invitationLink: string;
  copyInvitationDisabled = true;
  copyAuth: boolean;
  copyDisabled = false;
  blockManualMemberAdding: boolean;
  displayedColumns = [
    'checkbox',
    'id',
    'type',
    'fullName',
    'status',
    'groupStatus',
    'organization',
    'email',
    'logins',
  ];
  statuses = new FormControl(['']);
  statusList = ['VALID', 'INVALID', 'EXPIRED', 'DISABLED'];
  selectedStatuses: VoMemberStatuses[] = ['VALID', 'INVALID'];
  groupStatuses = new FormControl(['']);
  groupStatusList = ['VALID', 'EXPIRED'];
  selectedGroupStatuses: MemberGroupStatus[] = ['VALID'];
  nextPage = new BehaviorSubject<PageQuery>({});
  membersPage$: Observable<PaginatedRichMembers>;
  loadingSubject$ = new BehaviorSubject(false);
  cacheSubject = new BehaviorSubject(true);
  resetPagination = new BehaviorSubject(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );

  private groupAttrNames = [
    Urns.GROUP_SYNC_ENABLED,
    Urns.GROUP_LAST_SYNC_STATE,
    Urns.GROUP_LAST_SYNC_TIMESTAMP,
    Urns.GROUP_STRUCTURE_SYNC_ENABLED,
    Urns.GROUP_LAST_STRUCTURE_SYNC_STATE,
    Urns.GROUP_LAST_STRUCTURE_SYNC_TIMESTAMP,
    Urns.GROUP_BLOCK_MANUAL_MEMBER_ADDING,
  ];

  constructor(
    private groupService: GroupsManagerService,
    private registrarService: RegistrarManagerService,
    private dialog: MatDialog,
    private guiAuthResolver: GuiAuthResolver,
    private storeService: StoreService,
    private attributesManager: AttributesManagerService,
    private apiRequest: ApiRequestConfigurationService,
    private notificator: NotificatorService,
    private entityStorageService: EntityStorageService,
    private cacheHelperService: CacheHelperService,
    private clipboard: Clipboard,
    private membersService: MembersManagerService,
    private membersListService: MembersListService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.statuses.setValue(this.selectedStatuses);
    this.groupStatuses.setValue(this.selectedGroupStatuses);
    this.memberAttrNames = this.memberAttrNames.concat(this.storeService.getLoginAttributeNames());
    this.group = this.entityStorageService.getEntity();

    this.membersPage$ = this.membersListService.nextPageHandler(
      this.nextPage,
      this.membersService,
      this.group.voId,
      this.memberAttrNames,
      this.statuses,
      this.group.id,
      this.groupStatuses,
      this.selection,
      this.loadingSubject$,
    );

    this.setAuthRights();
    void this.isManualAddingBlocked(this.group.voId).then(() => this.loadPage(this.group.id));
    this.isCopyMembersDisabled();

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === GroupMembersComponent.id) {
          this.refreshTable();
        }
      });
  }

  loadPage(groupId: number): void {
    this.groupService
      .getRichGroupByIdWithAttributesByNames(groupId, this.groupAttrNames)
      .subscribe((group) => {
        this.group = group;
        this.synchEnabled = isGroupSynchronized(this.group);
      });
  }

  setAuthRights(): void {
    this.addAuth = this.guiAuthResolver.isAuthorized('addMembers_Group_List<Member>_policy', [
      this.group,
    ]);
    this.removeAuth = this.guiAuthResolver.isAuthorized('removeMembers_Group_List<Member>_policy', [
      this.group,
    ]);
    this.displayedColumns = this.removeAuth
      ? this.displayedColumns
      : ['id', 'type', 'fullName', 'status', 'groupStatus', 'organization', 'email', 'logins'];
    this.inviteAuth = this.guiAuthResolver.isAuthorized(
      'group-sendInvitation_Vo_Group_String_String_String_policy',
      [this.group],
    );
    this.preApprovedInviteAuth = this.guiAuthResolver.isAuthorized(
      'inviteToGroup_Vo_Group_String_String_String_LocalDate_String_policy',
      [this.group],
    );
    this.copyAuth = this.guiAuthResolver.isAuthorized(
      'source-copyMembers_Group_List<Group>_List<Member>_boolean_policy',
      [this.group],
    );

    if (this.inviteAuth) {
      this.registrarService
        .isInvitationEnabled(this.group.voId, this.group.id)
        .subscribe((enabled) => {
          this.inviteDisabled = !enabled;
        });
      this.registrarService
        .isLinkInvitationEnabled(this.group.voId, this.group.id)
        .subscribe((enabled) => {
          this.copyInvitationDisabled = !enabled;
        });
    }

    if (this.preApprovedInviteAuth) {
      this.registrarService
        .isPreApprovedInvitationEnabled(this.group.voId, this.group.id)
        .subscribe((enabled) => {
          this.preApprovedInviteDisabled = !enabled;
        });
    }
  }

  onSearchByString(filter: string): void {
    this.searchString = filter;
    this.refreshTable();
  }

  onAddMember(): void {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      group: this.group,
      manualAddingBlocked: this.blockManualMemberAdding,
    };

    const dialogRef = this.dialog.open(GroupAddMemberDialogComponent, config);

    dialogRef.afterClosed().subscribe((wereMembersAdded) => {
      if (wereMembersAdded) {
        this.refreshTable();
      }
    });
  }

  onRemoveMembers(): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      groupId: this.group.id,
      members: this.selection.selected,
      theme: 'group-theme',
    };

    const dialogRef = this.dialog.open(RemoveMembersDialogComponent, config);

    dialogRef.afterClosed().subscribe((wereMembersDeleted) => {
      if (wereMembersDeleted) {
        this.refreshTable();
      }
    });
  }

  onInviteMember(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      voId: this.group.voId,
      groupId: this.group.id,
      theme: 'group-theme',
    };

    this.dialog.open(InviteMemberDialogComponent, config);
  }

  onInvitePreapprovedMember(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      voId: this.group.voId,
      groupId: this.group.id,
      theme: 'group-theme',
    };

    this.dialog.open(InvitePreapprovedMemberDialogComponent, config);
  }

  onBulkInvite(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = { voId: this.group.voId, groupId: this.group.id, theme: 'group-theme' };

    this.dialog.open(BulkInviteMembersDialogComponent, config);
  }

  onBulkPreapprovedInvite(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = { voId: this.group.voId, groupId: this.group.id, theme: 'group-theme' };

    this.dialog.open(BulkInvitePreapprovedMembersDialogComponent, config);
  }

  copyInvitationLink(): void {
    const invitationLink$ = !this.invitationLink
      ? this.registrarService.buildInviteURL(this.group.voId, this.group.id).pipe(
          concatMap((createdUrl: string) => {
            this.invitationLink = createdUrl;
            return of(this.invitationLink);
          }),
        )
      : of(this.invitationLink);

    invitationLink$.subscribe((link) => {
      this.clipboard.copy(link);
      this.notificator.showSuccess('GROUP_DETAIL.MEMBERS.COPY_INVITATION_LINK_SUCCESS');
    });
  }

  onCopyMembers(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = {
      voId: this.group.voId,
      groupId: this.group.id,
      theme: 'group-theme',
      members: this.selection.selected,
    };

    const dialogRef = this.dialog.open(CopyMembersDialogComponent, config);

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.selection.clear();
      }
    });
  }

  displaySelectedStatuses(): string {
    if (this.selectedStatuses.length === this.statusList.length) {
      return 'ALL';
    }
    const statuses: string[] = this.statuses.value;
    if (statuses) {
      return `${statuses[0]}  ${
        statuses.length > 1
          ? '(+' +
            (statuses.length - 1).toString() +
            ' ' +
            (statuses.length === 2 ? 'other)' : 'others)')
          : ''
      }`;
    }
    return '';
  }

  displaySelectedGroupStatuses(): string {
    if (this.selectedGroupStatuses.length === this.groupStatusList.length) {
      return 'ALL';
    } else {
      return `${this.groupStatuses.value[0]}`;
    }
  }

  isManualAddingBlocked(voId: number): Promise<void> {
    return new Promise((resolve) => {
      this.apiRequest.dontHandleErrorForNext();
      this.attributesManager
        .getVoAttributeByName(voId, 'urn:perun:vo:attribute-def:def:blockManualMemberAdding')
        .subscribe({
          next: (attrValue) => {
            this.blockManualMemberAdding = attrValue.value !== null;
            resolve();
          },
          error: (error: RPCError) => {
            if (error.name !== 'PrivilegeException') {
              this.notificator.showError(error.name);
            }
            resolve();
          },
        });
    });
  }

  isCopyMembersDisabled(): void {
    this.copyDisabled = true;
    this.groupService.getGroupDirectMembersCount(this.group.id).subscribe({
      next: (count) => {
        this.copyDisabled = count === 0;
      },
      error: () => {
        this.copyDisabled = true;
      },
    });
  }

  changeVoStatuses(): void {
    this.selectedStatuses = this.statuses.value as VoMemberStatuses[];
    this.refreshTable();
  }

  changeGroupStatuses(): void {
    this.selectedGroupStatuses = this.groupStatuses.value as MemberGroupStatus[];
    this.refreshTable();
  }

  refreshTable(): void {
    this.resetPagination.next(true);
    this.cacheSubject.next(true);
    this.nextPage.next(this.nextPage.value);
    this.isCopyMembersDisabled();
  }

  downloadAll(a: {
    format: string;
    length: number;
    getDataForColumnFun: (data: RichMember, column: string) => string;
  }): void {
    const pageQuery = this.nextPage.getValue();

    const config = getDefaultDialogConfig();
    config.width = '500px';
    const exportLoading = this.dialog.open(ExportDataDialogComponent, config);

    const call = this.membersService
      .getMembersPage({
        vo: this.group.voId,
        attrNames: this.memberAttrNames,
        query: {
          order: pageQuery.order,
          pageSize: a.length,
          offset: 0,
          sortColumn: this.membersListService.getSortColumn(pageQuery.sortColumn),
          searchString: pageQuery.searchString,
          groupId: this.group.id,
          statuses: this.statuses.value as VoMemberStatuses[],
          groupStatuses: this.groupStatuses?.value as MemberGroupStatus[],
        },
      })
      .subscribe({
        next: (result) => {
          exportLoading.close();
          downloadData(
            getDataForExport(result.data, this.displayedColumns, a.getDataForColumnFun),
            a.format,
          );
        },
        error: (err: RPCError) => {
          this.notificator.showRPCError(err);
          exportLoading.close();
        },
      });
    exportLoading.afterClosed().subscribe(() => {
      if (call) {
        call.unsubscribe();
      }
    });
  }
}
