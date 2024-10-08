import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MemberTreeViewDialogComponent } from '@perun-web-apps/perun/dialogs';
import {
  GuiAuthResolver,
  TableCheckbox,
  EntityStorageService,
} from '@perun-web-apps/perun/services';
import {
  MemberGroupStatus,
  PaginatedRichMembers,
  RichMember,
  VoMemberStatuses,
} from '@perun-web-apps/perun/openapi';
import { MatDialog } from '@angular/material/dialog';
import {
  TABLE_ITEMS_COUNT_OPTIONS,
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  isMemberIndirect,
  parseEmail,
  parseFullName,
  parseLogins,
  parseOrganization,
  isMemberIndirectString,
  customDataSourceFilterPredicate,
  customDataSourceSort,
} from '@perun-web-apps/perun/utils';

import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { ChangeMemberStatusOrExpirationDialogComponent } from '../change-member-status-or-expiration-dialog/change-member-status-or-expiration-dialog.component';
import {
  DynamicDataSource,
  isDynamicDataSource,
  MemberWithConsentStatus,
  PageQuery,
} from '@perun-web-apps/perun/models';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'perun-web-apps-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MembersListComponent implements OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() selection: SelectionModel<RichMember>;
  @Input() displayedColumns: string[] = [
    'checkbox',
    'id',
    'voId',
    'userId',
    'type',
    'fullName',
    'status',
    'groupStatus',
    'sponsored',
    'organization',
    'email',
    'logins',
  ];
  @Input() voId: number;
  @Input() groupId: number;
  @Input() selectedGroupStatuses: MemberGroupStatus[] = [];
  @Input() searchString: string;
  @Input() selectedStatuses: VoMemberStatuses[];
  @Input() tableId: string;
  @Input() updateTable: boolean;
  @Input() isMembersGroup: boolean;
  @Input() disableRouting = false;
  @Input() disableStatusChange = false;
  @Input() disableCheckbox = true;
  @Input() loading: boolean;
  @Input() cacheSubject: BehaviorSubject<boolean>;
  @Output() refreshTable = new EventEmitter<void>();
  @Output() queryChanged = new EventEmitter<PageQuery>();
  @Output() downloadAll = new EventEmitter<{
    format: string;
    length: number;
    getDataForColumnFun: (data: RichMember, column: string) => string;
  }>();

  expireGroupAuth: boolean;
  expireVoAuth: boolean;
  isMasterCheckboxEnabled: boolean = true;

  dataSource: MatTableDataSource<MemberWithConsentStatus> | DynamicDataSource<RichMember>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  // contains all selected members across all pages
  cachedSelection: SelectionModel<RichMember>;

  constructor(
    private dialog: MatDialog,
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private entityStorage: EntityStorageService,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set members(members: MemberWithConsentStatus[] | PaginatedRichMembers) {
    // Initialize data source with first member object passed
    // One table instance can NOT alternate between paginated and not paginated members
    if (!this.dataSource) {
      this.dataSourceInit(members);
    }

    // Set up data correctly on each change
    const paginated = this.isPaginated(members);
    if (isDynamicDataSource(this.dataSource) && paginated) {
      this.dataSource.data = members.data;
      this.dataSource.count = members.totalCount;
    } else if (!isDynamicDataSource(this.dataSource) && !paginated) {
      this.dataSource.data = members;
    }
  }

  @Input() set filter(value: string) {
    this.dataSource.filter = value;
  }

  @Input() set displayColumns(columns: string[]) {
    if (!this.authResolver.isPerunAdminOrObserver()) {
      columns = columns.filter((column) => column !== 'id');
    }
    this.displayedColumns = columns;
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<RichMember>(
        this.selection.isMultipleSelection(),
        [],
        true,
        this.selection.compareWith,
      );
    }
    this.cacheSubject?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (val) {
        this.cachedSelection.clear();
      }
    });
    // without entity beanName the error is thrown e.g. in searcher component
    if (this.entityStorage.getEntity()) {
      this.expireGroupAuth = this.authResolver.isAuthorized(
        'setMemberGroupStatus_Member_Group_MemberGroupStatus_policy',
        [this.entityStorage.getEntity()],
      );
      this.expireVoAuth = this.authResolver.isAuthorized('setStatus_Member_Status_policy', [
        this.entityStorage.getEntity(),
      ]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isMasterCheckboxEnabled =
      !this.disableCheckbox ||
      this.tableCheckbox.anySelectableRows(this.dataSource, this.canBeSelected);
    if (this.cachedSelection && changes['members']) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
    if (this.cachedSelection && changes['filter']) {
      this.cachedSelection.clear();
      this.selection.clear();
    }
  }

  getExportDataForColumn(data: RichMember, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'voId':
        return data.voId.toString();
      case 'userId':
        return data.userId.toString();
      case 'type':
        return data.membershipType;
      case 'fullName':
        if (data.user) {
          return parseFullName(data.user);
        }
        return '';
      case 'status':
        return data.status;
      case 'groupStatus':
        return data.groupStatus;
      case 'organization':
        return parseOrganization(data);
      case 'email':
        return parseEmail(data);
      case 'logins':
        return parseLogins(data);
      default:
        return '';
    }
  }

  getDataForColumnFun = (data: RichMember, column: string): string => {
    return this.getExportDataForColumn(data, column);
  };

  /**
   * Sort full name by last name or first name
   * @param data
   * @param column
   */
  getSortDataForColumnFun = (data: RichMember, column: string): string => {
    if (column === 'fullName') {
      if (data.user) {
        return data.user.lastName ? data.user.lastName : data.user.firstName ?? '';
      }
      return '';
    } else {
      return this.getExportDataForColumn(data, column);
    }
  };

  isPaginated(
    data: MemberWithConsentStatus[] | PaginatedRichMembers,
  ): data is PaginatedRichMembers {
    return 'data' in data;
  }

  canBeSelected = (member: RichMember): boolean => !isMemberIndirect(member);

  masterToggle(): void {
    if (isDynamicDataSource(this.dataSource)) {
      this.tableCheckbox.masterTogglePaginated(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        !this.isAllSelected(),
        this.canBeSelected,
      );
    } else {
      this.tableCheckbox.masterToggle(
        this.isAllSelected(),
        this.selection,
        this.cachedSelection,
        this.dataSource.filter,
        this.dataSource,
        this.dataSource.sort,
        this.dataSource.paginator.pageSize,
        this.dataSource.paginator.pageIndex,
        true,
        this.canBeSelected,
      );
    }
  }

  isAllSelected(): boolean {
    if (isDynamicDataSource(this.dataSource)) {
      return this.tableCheckbox.isAllSelectedPaginated(
        this.dataSource,
        this.selection.selected.length,
        this.canBeSelected,
      );
    } else {
      return this.tableCheckbox.isAllSelected(
        this.selection.selected.length,
        this.dataSource,
        this.canBeSelected,
      );
    }
  }

  /**
   * Open the dialog for changing tho Vo/Group status
   * Dialog can be opened if the status/groupStatus column is between displayedColumns
   * AND the "disableStatusChange" property is set to false (default)
   * Do NOT open this dialog if the:
   *    1) caller doesn't have sufficient rights (for Vo or Group)
   *    2) vo member is unalterable (member from member Vo)
   *    3) current group is 'members'
   *    4) group member is indirect
   *
   * NOTE: isLifecycleAlterable member attribute should be presented in the member object to ensure the correct behavior
   *
   * @param event to stop default click event
   * @param member member for who should be changed the status
   * @param groupId id of group if the status should be changed on a group level
   */
  openMembershipDialog(event: Event, member: RichMember, groupId?: number): void {
    event.stopPropagation();

    if (!this.disableStatusChange) {
      const indirect = isMemberIndirectString(member);
      if (!groupId) {
        if (!this.expireVoAuth || indirect === 'UNALTERABLE') return;
      } else if (!this.expireGroupAuth || this.isMembersGroup || indirect === 'INDIRECT') return;

      const config = getDefaultDialogConfig();
      config.width = '400px';
      config.data = { member: member, voId: this.voId, groupId: groupId };

      const dialogRef = this.dialog.open(ChangeMemberStatusOrExpirationDialogComponent, config);

      dialogRef.afterClosed().subscribe(() => {
        this.refreshTable.emit();
      });
    }
  }

  exportDisplayedData(format: string): void {
    if (isDynamicDataSource(this.dataSource)) {
      downloadData(
        getDataForExport(this.dataSource.data, this.displayedColumns, this.getDataForColumnFun),
        format,
      );
    } else {
      const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
      const end = start + this.dataSource.paginator.pageSize;
      downloadData(
        getDataForExport(
          this.dataSource
            .sortData(this.dataSource.filteredData, this.dataSource.sort)
            .slice(start, end),
          this.displayedColumns,
          this.getDataForColumnFun,
        ),
        format,
      );
    }
  }

  exportAllData(format: string): void {
    if (isDynamicDataSource(this.dataSource)) {
      this.downloadAll.emit({
        format: format,
        length: this.dataSource.paginator.length,
        getDataForColumnFun: this.getDataForColumnFun,
      });
    } else {
      downloadData(
        getDataForExport(
          this.dataSource.filteredData,
          this.displayedColumns,
          this.getDataForColumnFun,
        ),
        format,
      );
    }
  }

  viewMemberGroupTree(event: Event, member: RichMember): void {
    event.stopPropagation();
    const config = getDefaultDialogConfig();
    config.width = '1000px';
    config.data = { member: member, groupId: this.groupId };

    this.dialog.open(MemberTreeViewDialogComponent, config);
  }

  toggleRow(row: RichMember): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    if (isDynamicDataSource(this.dataSource)) {
      return;
    }
    if (this.cachedSelection) {
      this.isMasterCheckboxEnabled =
        !this.disableCheckbox ||
        this.tableCheckbox.anySelectableRows(this.dataSource, this.canBeSelected);
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }

  private dataSourceInit(members: MemberWithConsentStatus[] | PaginatedRichMembers): void {
    const paginated = this.isPaginated(members);

    // Create data source based on input type
    this.dataSource = paginated
      ? new DynamicDataSource(members.data, members.totalCount, this.sort, this.child.paginator)
      : new MatTableDataSource(members);

    if (isDynamicDataSource(this.dataSource)) {
      // Subscribe to data source changes and pass them to parent
      this.dataSource.pageQuery$.subscribe((query) => this.queryChanged.emit(query));
    } else {
      // Initialize client-side data source
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: MemberWithConsentStatus, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          this.getDataForColumnFun,
          true,
        );
      this.dataSource.sortData = (
        data: MemberWithConsentStatus[],
        sort: MatSort,
      ): MemberWithConsentStatus[] =>
        customDataSourceSort(data, sort, this.getSortDataForColumnFun);
    }
  }
}
