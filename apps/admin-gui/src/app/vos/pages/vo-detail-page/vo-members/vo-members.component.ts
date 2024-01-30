import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  ApiRequestConfigurationService,
  EntityStorageService,
  GuiAuthResolver,
  NotificatorService,
  StoreService,
} from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { RemoveMembersDialogComponent } from '../../../../shared/components/dialogs/remove-members-dialog/remove-members-dialog.component';
import {
  AttributesManagerService,
  RegistrarManagerService,
  RichMember,
  Vo,
  VoMemberStatuses,
} from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { UntypedFormControl } from '@angular/forms';
import { TABLE_VO_MEMBERS } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { InviteMemberDialogComponent } from '../../../../shared/components/dialogs/invite-member-dialog/invite-member-dialog.component';
import { RPCError } from '@perun-web-apps/perun/models';
import { VoAddMemberDialogComponent } from '../../../components/vo-add-member-dialog/vo-add-member-dialog.component';
import { BulkInviteMembersDialogComponent } from '../../../../shared/components/dialogs/bulk-invite-members-dialog/bulk-invite-members-dialog.component';
import { Observable, of } from 'rxjs';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-vo-members',
  templateUrl: './vo-members.component.html',
  styleUrls: ['./vo-members.component.scss'],
})
export class VoMembersComponent implements OnInit {
  static id = 'VoMembersComponent';

  @HostBinding('class.router-component') true;
  vo: Vo;
  members: RichMember[] = null;
  selection = new SelectionModel<RichMember>(true, []);
  loading$: Observable<boolean>;
  attrNames = [
    Urns.MEMBER_DEF_ORGANIZATION,
    Urns.MEMBER_DEF_MAIL,
    Urns.USER_DEF_ORGANIZATION,
    Urns.USER_DEF_PREFERRED_MAIL,
    Urns.MEMBER_DEF_EXPIRATION,
    Urns.MEMBER_LIFECYCLE_ALTERABLE,
  ];
  statuses = new UntypedFormControl();
  statusList = ['VALID', 'INVALID', 'EXPIRED', 'DISABLED'];
  selectedStatuses: VoMemberStatuses[] = [];
  tableId = TABLE_VO_MEMBERS;
  displayedColumns = ['checkbox', 'id', 'fullName', 'status', 'organization', 'email', 'logins'];
  searchString: string;
  updateTable = false;
  addAuth: boolean;
  removeAuth: boolean;
  inviteAuth: boolean;
  inviteDisabled = true;
  routeAuth: boolean;
  blockManualMemberAdding: boolean;
  invitationLink: string;
  copyInvitationDisabled = true;

  constructor(
    private registrarService: RegistrarManagerService,
    private notificator: NotificatorService,
    private dialog: MatDialog,
    private authzService: GuiAuthResolver,
    private storeService: StoreService,
    private attributesManager: AttributesManagerService,
    private apiRequest: ApiRequestConfigurationService,
    private entityStorageService: EntityStorageService,
    private cd: ChangeDetectorRef,
    private cacheHelperService: CacheHelperService,
    private clipboard: Clipboard,
  ) {}

  ngOnInit(): void {
    this.loading$ = of(true);
    this.statuses.setValue(this.selectedStatuses);
    this.attrNames = this.attrNames.concat(this.storeService.getLoginAttributeNames());

    this.vo = this.entityStorageService.getEntity();
    this.setAuthRights();
    if (this.inviteAuth) {
      this.registrarService.isInvitationEnabled(this.vo.id, null).subscribe((enabled) => {
        this.inviteDisabled = !enabled;
      });
      this.registrarService.isLinkInvitationEnabled(this.vo.id, null).subscribe((enabled) => {
        this.copyInvitationDisabled = !enabled;
      });
    }

    void this.isManualAddingBlocked(this.vo.id);

    // Refresh cached data
    this.cacheHelperService.refreshComponentCachedData().subscribe((nextValue) => {
      if (nextValue) {
        this.refreshTable();
      }
    });
  }

  setAuthRights(): void {
    this.addAuth =
      this.authzService.isAuthorized('createMember_Vo_User_List<Group>_policy', [this.vo]) &&
      this.authzService.isAuthorized('createMember_Vo_Candidate_List<Group>_policy', [this.vo]);

    this.removeAuth = this.authzService.isAuthorized('deleteMembers_List<Member>_policy', [
      this.vo,
    ]);

    this.displayedColumns = this.removeAuth
      ? this.displayedColumns
      : ['id', 'fullName', 'status', 'organization', 'email', 'logins'];

    if (this.members !== null && this.members.length !== 0) {
      this.routeAuth = this.authzService.isAuthorized('getMemberById_int_policy', [
        this.vo,
        this.members[0],
      ]);
    }

    this.inviteAuth = this.authzService.isAuthorized(
      'vo-sendInvitation_Vo_Group_String_String_String_policy',
      [this.vo],
    );
  }

  onSearchByString(filter: string): void {
    this.searchString = filter;
    this.selection.clear();
    this.cd.detectChanges();
  }

  onAddMember(): void {
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = {
      voId: this.vo.id,
    };

    const dialogRef = this.dialog.open(VoAddMemberDialogComponent, config);

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
      members: this.selection.selected,
      theme: 'vo-theme',
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
    config.data = { voId: this.vo.id, theme: 'vo-theme' };

    this.dialog.open(InviteMemberDialogComponent, config);
  }

  onBulkInvite(): void {
    const config = getDefaultDialogConfig();
    config.width = '650px';
    config.data = { voId: this.vo.id, theme: 'vo-theme' };

    this.dialog.open(BulkInviteMembersDialogComponent, config);
  }

  copyInvitationLink(): void {
    const invitationLink$ = !this.invitationLink
      ? this.registrarService.buildInviteURL(this.vo.id).pipe(
          concatMap((createdUrl: string) => {
            this.invitationLink = createdUrl;
            return of(this.invitationLink);
          }),
        )
      : of(this.invitationLink);

    invitationLink$.subscribe((link) => {
      this.clipboard.copy(link);
      this.notificator.showSuccess('VO_DETAIL.MEMBERS.COPY_INVITATION_LINK_SUCCESS');
    });
  }

  displaySelectedStatuses(): string {
    if (this.selectedStatuses.length === this.statusList.length) {
      return 'ALL';
    }
    const statuses: string[] = this.statuses.value as string[];
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

  isManualAddingBlocked(voId: number): Promise<void> {
    return new Promise<void>((resolve) => {
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

  changeStatuses(): void {
    this.selection.clear();
    this.selectedStatuses = this.statuses.value as VoMemberStatuses[];
    this.cd.detectChanges();
  }

  refreshTable(): void {
    this.selection.clear();
    this.updateTable = !this.updateTable;
    this.cd.detectChanges();
  }
}
