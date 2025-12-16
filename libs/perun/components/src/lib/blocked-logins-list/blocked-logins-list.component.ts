import { TranslateModule } from '@ngx-translate/core';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
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
  CheckboxLabelPipe,
  GlobalNamespacePipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
} from '@perun-web-apps/perun/pipes';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableCheckbox } from '@perun-web-apps/perun/services';
import { BlockedLogin, PaginatedBlockedLogins } from '@perun-web-apps/perun/openapi';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DynamicDataSource, isDynamicDataSource, PageQuery } from '@perun-web-apps/perun/models';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';

@Component({
  imports: [
    CommonModule,
    MatCheckboxModule,
    UiAlertsModule,
    IsAllSelectedPipe,
    TableWrapperComponent,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    CheckboxLabelPipe,
    GlobalNamespacePipe,
    MasterCheckboxLabelPipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-logins-list',
  templateUrl: './blocked-logins-list.component.html',
  styleUrls: ['./blocked-logins-list.component.scss'],
  providers: [GlobalNamespacePipe],
})
export class BlockedLoginsListComponent implements OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() updateTable: boolean;
  @Input() searchString = '';
  @Input() selection: SelectionModel<BlockedLogin>;
  @Input() selectedNamespaces: string[] = [];
  @Input() displayedColumns: string[];
  @Input() loading: boolean;
  @Input() cacheSubject: BehaviorSubject<boolean>;
  @Input() resetPagination: BehaviorSubject<boolean>;
  @Output() queryChanged = new EventEmitter<PageQuery>();
  @Output() downloadAll = new EventEmitter<{
    format: string;
    length: number;
    getDataForColumnFun: (data: BlockedLogin, column: string) => string;
  }>();

  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  // currently is used only DynamicDataSource, this list should work also for MatTableDataSource, but it has not been tested yet
  dataSource: MatTableDataSource<BlockedLogin> | DynamicDataSource<BlockedLogin>;

  // contains all selected blocked logins across all pages
  cachedSelection: SelectionModel<BlockedLogin>;
  tableId = 'perun-web-apps-logins-list';

  constructor(
    private globalNamespacePipe: GlobalNamespacePipe,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set blockedLogins(blockedLogins: BlockedLogin[] | PaginatedBlockedLogins) {
    // Initialize data source with first blocked login object passed
    // One table instance can NOT alternate between paginated and not paginated blocked logins
    if (!this.dataSource) {
      this.dataSourceInit(blockedLogins);
    }

    // Set up data correctly on each change
    const paginated = this.isPaginated(blockedLogins);
    if (isDynamicDataSource(this.dataSource) && paginated) {
      this.dataSource.data = blockedLogins.data;
      this.dataSource.count = blockedLogins.totalCount;
    } else if (!isDynamicDataSource(this.dataSource) && !paginated) {
      this.dataSource.data = blockedLogins;
    }
  }

  @Input() set filter(value: string) {
    this.dataSource.filter = value;
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<BlockedLogin>(
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
        this.child.paginator.firstPage();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cachedSelection && changes['blockedLogins']) {
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

  isPaginated(data: BlockedLogin[] | PaginatedBlockedLogins): data is PaginatedBlockedLogins {
    return 'data' in data;
  }

  getDataForColumnFun = (data: BlockedLogin, column: string): string => {
    return this.getExportDataForColumn(data, column);
  };

  getExportDataForColumn(data: BlockedLogin, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'login':
        return data.login;
      case 'namespace':
        return this.globalNamespacePipe.transform(data.namespace);
      default:
        return '';
    }
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

  toggleRow(row: BlockedLogin): void {
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

  private dataSourceInit(blockedLogins: BlockedLogin[] | PaginatedBlockedLogins): void {
    const paginated = this.isPaginated(blockedLogins);

    // Create data source based on input type
    this.dataSource = paginated
      ? new DynamicDataSource(
          blockedLogins.data,
          blockedLogins.totalCount,
          this.sort,
          this.child.paginator,
        )
      : new MatTableDataSource(blockedLogins);

    if (isDynamicDataSource(this.dataSource)) {
      // Subscribe to data source changes and pass them to parent
      this.dataSource.pageQuery$.subscribe((query) => this.queryChanged.emit(query));
    } else {
      // Initialize client-side data source
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: BlockedLogin, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          this.getDataForColumnFun,
          true,
        );
      this.dataSource.sortData = (data: BlockedLogin[], sort: MatSort): BlockedLogin[] =>
        customDataSourceSort(data, sort, this.getDataForColumnFun);
    }
  }
}
