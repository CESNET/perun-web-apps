import {
  Component,
  DestroyRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ChangeGroupExpirationDialogComponent,
  EditFacilityResourceGroupVoDialogComponent,
  EditFacilityResourceGroupVoDialogOptions,
  GroupSyncDetailDialogComponent,
} from '@perun-web-apps/perun/dialogs';
import { Group, PaginatedRichGroups, VosManagerService } from '@perun-web-apps/perun/openapi';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  findAttribute,
  getDataForExport,
  getDefaultDialogConfig,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';

import {
  DynamicDataSource,
  GroupWithStatus,
  isDynamicDataSource,
  PageQuery,
} from '@perun-web-apps/perun/models';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DisableGroupSelectPipe } from '@perun-web-apps/perun/pipes';
import { GroupUtilsService } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';

@Component({
  selector: 'perun-web-apps-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
  providers: [DisableGroupSelectPipe],
})
export class GroupsListComponent implements OnInit, OnChanges {
  @Input() theme = 'group-theme';
  @Input() selection: SelectionModel<GroupWithStatus>;
  @Input() groupWithAuthzGroupPairs: Map<number, Group[]>;
  @Input() authzVoNames: Map<number, string>;
  @Input() disableMembers: boolean;
  @Input() disableGroups: boolean = false;
  @Input() groupsToDisableCheckbox: Set<number> = new Set<number>();
  @Input() groupsToDisableRouting: Set<number> = new Set<number>();
  @Input() disableHeadCheckbox: boolean;
  @Input() parentGroup: Group;
  @Input() disableRouting = false;
  @Input() memberId: number;
  @Input() memberGroupStatus: string;
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() recentIds: number[] = [];
  @Input() resourceId: number = null;
  @Input() tableId: string;
  @Input() relation = false;
  @Input() noGroupsAlert = 'SHARED_LIB.UI.ALERTS.NO_GROUPS';
  @Input() loading: boolean;
  @Input() cacheSubject: BehaviorSubject<boolean>;
  @Input() resetPagination: BehaviorSubject<boolean>;
  @Output() groupMoved = new EventEmitter<GroupWithStatus>();
  @Output() refreshTable = new EventEmitter<void>();
  @Output() queryChanged = new EventEmitter<PageQuery>();
  @Output() downloadAll = new EventEmitter<{ format: string; length: number }>();
  @ViewChild(TableWrapperComponent, { static: true }) tableWrapper: TableWrapperComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // contains all selected groups across all pages
  cachedSelection: SelectionModel<GroupWithStatus>;

  displayButtons = window.innerWidth > 800;
  dataSource: MatTableDataSource<GroupWithStatus> | DynamicDataSource<GroupWithStatus>;
  disabledRouting = false;
  voNames: Map<number, string> = new Map<number, string>();
  isMasterCheckboxEnabled: boolean = true;
  columns: string[] = [
    'select',
    'id',
    'recent',
    'vo',
    'indirectGroupAssigment',
    'name',
    'status',
    'groupStatus',
    'description',
    'expiration',
    'menu',
  ];

  constructor(
    private dialog: MatDialog,
    private authResolver: GuiAuthResolver,
    private voService: VosManagerService,
    private tableCheckbox: TableCheckbox,
    private disableGroupSelect: DisableGroupSelectPipe,
    private groupUtils: GroupUtilsService,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set groups(groups: GroupWithStatus[] | PaginatedRichGroups) {
    // Initialize data source with first group object passed
    // One table instance can NOT alternate between paginated and not paginated groups
    if (!this.dataSource) {
      this.dataSourceInit(groups);
    }

    // Set up data correctly on each change
    const paginated = this.isPaginated(groups);
    if (isDynamicDataSource(this.dataSource) && paginated) {
      this.dataSource.data = groups.data;
      this.dataSource.count = groups.totalCount;
    } else if (!isDynamicDataSource(this.dataSource) && !paginated) {
      this.dataSource.data = groups;
    }

    this.updateVoNames();
  }

  @Input() set filter(value: string) {
    this.dataSource.filter = value;
  }

  @Input() set displayedColumns(columns: string[]) {
    if (localStorage.getItem('showIds') !== 'true') {
      columns = columns.filter((column) => column !== 'id');
    }
    this.columns = columns;
  }

  @HostListener('window:resize', ['$event'])
  shouldHideButtons(): void {
    this.displayButtons = window.innerWidth > 800;
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<GroupWithStatus>(
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
    this.resetPagination?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (val) {
        this.tableWrapper.paginator.firstPage();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isMasterCheckboxEnabled =
      !this.disableGroups ||
      this.tableCheckbox.anySelectableRows(this.dataSource, this.canBeSelected);
    if (this.cachedSelection && changes['groups']) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
    if (this.cachedSelection && changes['filter']) {
      this.selection.clear();
      this.cachedSelection.clear();
    }
  }

  isPaginated(data: GroupWithStatus[] | PaginatedRichGroups): data is PaginatedRichGroups {
    return 'data' in data;
  }

  getDataForColumnFun = (data: GroupWithStatus, column: string): string => {
    return this.groupUtils.getDataForColumn(data, column, this.voNames);
  };

  getSortDataForColumnFun = (data: GroupWithStatus, column: string): string => {
    return this.groupUtils.getSortDataForColumn(data, column, this.voNames, this.recentIds);
  };

  exportAllData(format: string): void {
    if (isDynamicDataSource(this.dataSource)) {
      this.downloadAll.emit({ format: format, length: this.dataSource.paginator.length });
    } else {
      downloadData(
        getDataForExport(this.dataSource.filteredData, this.columns, this.getDataForColumnFun),
        format,
      );
    }
  }

  exportDisplayedData(format: string): void {
    if (isDynamicDataSource(this.dataSource)) {
      downloadData(
        getDataForExport(this.dataSource.data, this.columns, this.getDataForColumnFun),
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
          this.columns,
          this.getDataForColumnFun,
        ),
        format,
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

  moveGroup(group: GroupWithStatus): void {
    this.groupMoved.emit(group);
  }

  openSyncDetail(group: GroupWithStatus): void {
    const config = getDefaultDialogConfig();
    config.width = '450px';
    config.data = {
      groupId: group.id,
      theme: this.theme,
    };
    this.dialog.open(GroupSyncDetailDialogComponent, config);
  }

  editGroup(group: GroupWithStatus): void {
    const config = getDefaultDialogConfig();
    config.data = {
      theme: 'group-theme',
      group: group,
      dialogType: EditFacilityResourceGroupVoDialogOptions.GROUP,
    };
    const dialogRef = this.dialog.open(EditFacilityResourceGroupVoDialogComponent, config);

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.refreshTable.emit();
      }
    });
  }

  changeExpiration(group: GroupWithStatus): void {
    const expirationAtt = group.attributes.find(
      (att) => att.baseFriendlyName === 'groupMembershipExpiration',
    );
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = {
      memberId: this.memberId,
      groupId: group.id,
      expirationAttr: expirationAtt,
      status: findAttribute(group.attributes, 'groupStatus'),
    };

    const dialogRef = this.dialog.open(ChangeGroupExpirationDialogComponent, config);
    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.refreshTable.emit();
      }
    });
  }

  itemSelectionToggle(item: GroupWithStatus): void {
    this.selection.toggle(item);
    this.cachedSelection.toggle(item);
  }

  canBeSelected = (group: GroupWithStatus): boolean => {
    const indirect = group.attributes?.find((obj) => obj.friendlyName === 'groupStatusIndirect');
    if (indirect?.value) {
      return !indirect.value;
    }

    return !this.disableGroupSelect.transform(
      group,
      this.disableMembers,
      this.disableGroups,
      this.groupsToDisableCheckbox,
    );
  };

  pageChanged(): void {
    if (isDynamicDataSource(this.dataSource)) {
      return;
    }
    if (this.cachedSelection) {
      this.isMasterCheckboxEnabled =
        !this.disableGroups ||
        this.tableCheckbox.anySelectableRows(this.dataSource, this.canBeSelected);
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }

  private dataSourceInit(groups: GroupWithStatus[] | PaginatedRichGroups): void {
    const paginated = this.isPaginated(groups);

    // Create data source based on input type
    this.dataSource = paginated
      ? new DynamicDataSource(
          groups.data,
          groups.totalCount,
          this.sort,
          this.tableWrapper.paginator,
        )
      : new MatTableDataSource(groups);

    if (isDynamicDataSource(this.dataSource)) {
      // Subscribe to data source changes and pass them to parent
      this.dataSource.pageQuery$.subscribe((query) => this.queryChanged.emit(query));
    } else {
      // Initialize client-side data source
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.tableWrapper.paginator;
      this.dataSource.filterPredicate = (data: GroupWithStatus, filter: string): boolean =>
        customDataSourceFilterPredicate(data, filter, this.columns, this.getDataForColumnFun, true);
      this.dataSource.sortData = (data: GroupWithStatus[], sort: MatSort): GroupWithStatus[] =>
        customDataSourceSort(data, sort, this.getSortDataForColumnFun);
    }
  }

  private updateVoNames(): void {
    if (this.columns.includes('vo')) {
      const voIds = new Set<number>();
      this.dataSource.filteredData.forEach((grp) => {
        if (!voIds.has(grp.voId) && !this.voNames.has(grp.voId)) {
          voIds.add(grp.voId);
        }
      });
      if (voIds.size > 0) {
        this.voService.getVosByIds([...voIds]).subscribe((vos) => {
          vos.forEach((vo) => {
            this.voNames.set(vo.id, vo.name);
          });
        });
      }
    }
  }
}
