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
} from '@angular/core';
import {
  Consent,
  ConsentsManagerService,
  PaginatedRichUsers,
  RichUser,
} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  parseFullName,
  parseLogins,
  parseUserEmail,
  parseVo,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { MatSort } from '@angular/material/sort';
import { TableCheckbox } from '@perun-web-apps/perun/services';
import {
  DynamicDataSource,
  isDynamicDataSource,
  PageQuery,
  UserWithConsentStatus,
} from '@perun-web-apps/perun/models';
import { ConsentStatusIconPipe } from '@perun-web-apps/perun/pipes';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type userTableColumn =
  | 'select'
  | 'user'
  | 'id'
  | 'name'
  | 'email'
  | 'logins'
  | 'organization'
  | 'consentStatus';

@Component({
  selector: 'perun-web-apps-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  providers: [ConsentStatusIconPipe],
})
export class UsersListComponent implements OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() tableId: string;
  @Input() selection: SelectionModel<RichUser>;
  @Input() disableRouting = false;
  @Input() facilityId: number;
  @Input() loading: boolean;
  @Input() noUsersFoundLabel = '';
  @Input() routeToAdmin = false;
  @Input() defaultSort: userTableColumn;
  @Input() sortableColumns: userTableColumn[] = ['id', 'name'];
  @Input() cacheSubject: BehaviorSubject<boolean>;

  @Output() queryChanged = new EventEmitter<PageQuery>();
  @Output() downloadAll = new EventEmitter<{
    format: string;
    length: number;
    getDataForColumnFun: (data: RichUser, column: string) => string;
    convertToExport?: (data: RichUser[]) => UserWithConsentStatus[] | RichUser[];
  }>();

  // contains all selected users across all pages
  cachedSelection: SelectionModel<RichUser>;

  consents: Consent[];
  dataSource: MatTableDataSource<RichUser> | DynamicDataSource<RichUser>;
  svgIcon = 'perun-service-identity-black';
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  displayedColumns: userTableColumn[] = [
    'select',
    'user',
    'id',
    'name',
    'email',
    'logins',
    'organization',
  ];

  constructor(
    private tableCheckbox: TableCheckbox,
    private consentPipe: ConsentStatusIconPipe,
    private translate: TranslateService,
    private consentService: ConsentsManagerService,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set users(users: RichUser[] | PaginatedRichUsers) {
    if (!this.dataSource) {
      this.dataSourceInit(users);
    }

    const paginated = this.isPaginated(users);
    if (isDynamicDataSource(this.dataSource) && paginated) {
      this.dataSource.data = users.data;
      this.dataSource.count = users.totalCount;
    } else if (!isDynamicDataSource(this.dataSource) && !paginated) {
      this.dataSource.data = users;
    }
  }

  @Input() set filter(value: string) {
    this.dataSource.filter = value;
  }

  @Input() set displayColumns(columns: userTableColumn[]) {
    if (!this.routeToAdmin) {
      columns = columns.filter((c) => c !== 'id');
    }
    this.displayedColumns = columns;
    this.loadConsents();
  }

  static getExportDataForColumn(data: UserWithConsentStatus, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'user':
        return data.serviceUser ? 'service-user' : 'user';
      case 'name':
        if (data) {
          return data.lastName ? data.lastName : data.firstName ?? parseFullName(data);
        }
        return '';
      case 'organization':
        return parseVo(data);
      case 'email':
        return parseUserEmail(data);
      case 'logins':
        return parseLogins(data);
      case 'consentStatus':
        return data.consent;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<RichUser>(
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cachedSelection && changes['users']) {
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

  isPaginated(data: RichUser[] | PaginatedRichUsers): data is PaginatedRichUsers {
    return 'data' in data;
  }

  masterToggle(): void {
    if (isDynamicDataSource(this.dataSource)) {
      this.tableCheckbox.masterTogglePaginated(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        !this.isAllSelected(),
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
        false,
      );
    }
  }

  isAllSelected(): boolean {
    if (isDynamicDataSource(this.dataSource)) {
      return this.tableCheckbox.isAllSelectedPaginated(
        this.dataSource,
        this.selection.selected.length,
      );
    } else {
      return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
    }
  }

  checkIfSortDisabled(column: userTableColumn): boolean {
    return !this.sortableColumns.includes(column);
  }

  loadConsents(): void {
    if (!this.displayedColumns.includes('consentStatus')) {
      return;
    }
    this.consentService
      .getConsentHubByFacility(this.facilityId)
      .subscribe((consentHub) =>
        this.consentService
          .getConsentsForConsentHub(consentHub.id)
          .subscribe((consents) => (this.consents = consents)),
      );
  }

  exportDisplayedData(format: string): void {
    if (isDynamicDataSource(this.dataSource)) {
      downloadData(
        getDataForExport(
          this.getConsentsForUsers(this.dataSource.data),
          this.displayedColumns,
          UsersListComponent.getExportDataForColumn,
        ),
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
          UsersListComponent.getExportDataForColumn,
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
        getDataForColumnFun: UsersListComponent.getExportDataForColumn,
        convertToExport: this.getConsentsForUsers,
      });
    } else {
      downloadData(
        getDataForExport(
          this.getConsentsForUsers(this.dataSource.data),
          this.displayedColumns,
          UsersListComponent.getExportDataForColumn,
        ),
        format,
      );
    }
  }

  getConsentsForUsers = (users: RichUser[]): UserWithConsentStatus[] | RichUser[] => {
    if (!this.displayedColumns.includes('consentStatus')) {
      return users;
    }
    const result: UserWithConsentStatus[] = [];
    users.forEach((user) => {
      const uwc: UserWithConsentStatus = user;
      uwc.consent = this.translate.instant(
        'CONSENTS.STATUS_' + this.consentPipe.transform(user.id, this.consents),
      ) as string;
      result.push(uwc);
    });
    return result;
  };

  toggleRow(row: RichUser): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    if (isDynamicDataSource(this.dataSource)) {
      return;
    }
    if (this.cachedSelection) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }

  private dataSourceInit(users: RichUser[] | PaginatedRichUsers): void {
    const paginated = this.isPaginated(users);

    this.updateSort();
    this.dataSource = paginated
      ? new DynamicDataSource(users.data, users.totalCount, this.sort, this.child.paginator)
      : new MatTableDataSource(users);

    if (isDynamicDataSource(this.dataSource)) {
      // Subscribe to data source changes and pass them to parent
      this.dataSource.pageQuery$.subscribe((query) => this.queryChanged.emit(query));
    } else {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: RichUser, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          UsersListComponent.getExportDataForColumn,
          true,
        );
      this.dataSource.sortData = (data: RichUser[], sort: MatSort): RichUser[] =>
        customDataSourceSort(data, sort, UsersListComponent.getExportDataForColumn);
    }
  }

  private updateSort(): void {
    if (this.defaultSort) {
      this.sort.active = this.defaultSort;
      return;
    }
    // If there is no default sort, set the first column as the active one
    this.sort.active = this.displayedColumns.find(
      (column) => column !== 'select' && column !== 'user',
    );
  }
}
