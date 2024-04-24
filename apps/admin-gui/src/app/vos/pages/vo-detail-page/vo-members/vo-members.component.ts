import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
} from '@angular/core';
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
  MembersManagerService,
  PaginatedRichMembers,
  RegistrarManagerService,
  RichMember,
  Vo,
  VoMemberStatuses,
} from '@perun-web-apps/perun/openapi';
import { Urns } from '@perun-web-apps/perun/urns';
import { FormControl } from '@angular/forms';
import { TABLE_VO_MEMBERS } from '@perun-web-apps/config/table-config';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { InviteMemberDialogComponent } from '../../../../shared/components/dialogs/invite-member-dialog/invite-member-dialog.component';
import { PageQuery, RPCError } from '@perun-web-apps/perun/models';
import { VoAddMemberDialogComponent } from '../../../components/vo-add-member-dialog/vo-add-member-dialog.component';
import { BulkInviteMembersDialogComponent } from '../../../../shared/components/dialogs/bulk-invite-members-dialog/bulk-invite-members-dialog.component';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { CacheHelperService } from '../../../../core/services/common/cache-helper.service';
import { concatMap, map, tap } from 'rxjs/operators';
import { MembersListService } from '@perun-web-apps/perun/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-vo-members',
  templateUrl: './vo-members.component.html',
  styleUrls: ['./vo-members.component.scss'],
})
export class VoMembersComponent implements OnInit, AfterViewInit {
  static id = 'VoMembersComponent';

  @HostBinding('class.router-component') true;
  vo: Vo;
  selection = new SelectionModel<RichMember>(true, []);
  attrNames = [
    Urns.MEMBER_DEF_ORGANIZATION,
    Urns.MEMBER_DEF_MAIL,
    Urns.USER_DEF_ORGANIZATION,
    Urns.USER_DEF_PREFERRED_MAIL,
    Urns.MEMBER_DEF_EXPIRATION,
    Urns.MEMBER_LIFECYCLE_ALTERABLE,
  ];
  statuses = new FormControl(['']);
  statusList = ['VALID', 'INVALID', 'EXPIRED', 'DISABLED'];
  selectedStatuses: VoMemberStatuses[] = [];
  tableId = TABLE_VO_MEMBERS;
  displayedColumns = ['checkbox', 'id', 'fullName', 'status', 'organization', 'email', 'logins'];
  searchString = '';
  updateTable = false;
  addAuth: boolean;
  removeAuth: boolean;
  inviteAuth: boolean;
  inviteDisabled = true;
  routeAuth: boolean;
  blockManualMemberAdding: boolean;
  invitationLink: string;
  copyInvitationDisabled = true;
  nextPage = new BehaviorSubject<PageQuery>({});
  membersPage$: Observable<PaginatedRichMembers>;
  loadingSubject$ = new BehaviorSubject(false);
  loading$: Observable<boolean> = merge(
    this.loadingSubject$,
    this.nextPage.pipe(map((): boolean => true)),
  );

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
    private membersService: MembersManagerService,
    private membersListService: MembersListService,
    private destroyRef: DestroyRef,
  ) {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.statuses.setValue(this.selectedStatuses);
    this.attrNames = this.attrNames.concat(this.storeService.getLoginAttributeNames());

    this.vo = this.entityStorageService.getEntity();
    this.membersPage$ = this.membersListService
      .nextPageHandler(
        this.nextPage,
        this.membersService,
        this.vo.id,
        this.attrNames,
        this.statuses,
        null,
        null,
        this.selection,
        this.loadingSubject$,
      )
      .pipe(
        tap((members) => {
          this.setAuthRights(members.data);
        }),
      );

    void this.isManualAddingBlocked(this.vo.id);

    // Refresh cached data
    this.cacheHelperService
      .refreshComponentCachedData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((nextValue) => {
        if (nextValue === VoMembersComponent.id) {
          this.refreshTable();
        }
      });
  }

  setAuthRights(members: RichMember[]): void {
    this.addAuth =
      this.authzService.isAuthorized('createMember_Vo_User_List<Group>_policy', [this.vo]) &&
      this.authzService.isAuthorized('createMember_Vo_Candidate_List<Group>_policy', [this.vo]);

    this.removeAuth = this.authzService.isAuthorized('deleteMembers_List<Member>_policy', [
      this.vo,
    ]);

    this.displayedColumns = this.removeAuth
      ? this.displayedColumns
      : ['id', 'fullName', 'status', 'organization', 'email', 'logins'];

    if (members !== null && members.length !== 0) {
      this.routeAuth = this.authzService.isAuthorized('getMemberById_int_policy', [
        this.vo,
        members[0],
      ]);
    }

    this.inviteAuth = this.authzService.isAuthorized(
      'vo-sendInvitation_Vo_Group_String_String_String_policy',
      [this.vo],
    );

    if (this.inviteAuth) {
      this.registrarService.isInvitationEnabled(this.vo.id, null).subscribe((enabled) => {
        this.inviteDisabled = !enabled;
      });
      this.registrarService.isLinkInvitationEnabled(this.vo.id, null).subscribe((enabled) => {
        this.copyInvitationDisabled = !enabled;
      });
    }
  }

  onSearchByString(filter: string): void {
    this.searchString = filter;
    this.nextPage.next(this.nextPage.value);
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
    this.selectedStatuses = this.statuses.value as VoMemberStatuses[];
    this.nextPage.next(this.nextPage.value);
  }

  refreshTable(): void {
    this.nextPage.next(this.nextPage.value);
  }

  downloadAll(a: {
    format: string;
    length: number;
    getDataForColumnFun: (data: RichMember, column: string) => string;
  }): void {
    this.membersListService.downloadAll(
      a.format,
      a.length,
      a.getDataForColumnFun,
      this.nextPage,
      this.membersService,
      this.vo.id,
      this.attrNames,
      this.statuses,
      null,
      null,
      this.displayedColumns,
    );
  }
}
