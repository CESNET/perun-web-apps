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
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  getExportDataForColumn,
  getSortDataColumn,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import {
  InvitationWithSender,
  PaginatedInvitationsWithSender,
} from '@perun-web-apps/perun/openapi';
import { DynamicDataSource, isDynamicDataSource, PageQuery } from '@perun-web-apps/perun/models';
import { TableCheckbox } from '@perun-web-apps/perun/services';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';

@Component({
  selector: 'perun-web-apps-invitations-list',
  templateUrl: './invitations-list.component.html',
  styleUrls: ['./invitations-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InvitationsListComponent implements OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() selection: SelectionModel<InvitationWithSender>;
  @Input() cacheSubject: BehaviorSubject<boolean>;
  @Input() resetPagination: BehaviorSubject<boolean>;
  @Input() displayedColumns: string[] = [
    'checkbox',
    'id',
    'status',
    'expiration',
    'receiverName',
    'receiverEmail',
    'senderName',
  ];
  @Input() groupId: number;
  @Input() tableId: string;
  @Input() loading: boolean;
  @Output() refreshTable = new EventEmitter<void>();
  @Output() queryChanged = new EventEmitter<PageQuery>();
  @Output() downloadAll = new EventEmitter<{
    format: string;
    length: number;
    getDataForColumnFun: (data: InvitationWithSender, column: string) => string;
  }>();

  dataSource: MatTableDataSource<InvitationWithSender> | DynamicDataSource<InvitationWithSender>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  // contains all selected rows across all pages
  cachedSelection: SelectionModel<InvitationWithSender>;

  constructor(
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set invitations(invitations: InvitationWithSender[] | PaginatedInvitationsWithSender) {
    // Initialize data source with first invitation object passed
    // One table instance can NOT alternate between paginated and not paginated invitations
    if (!this.dataSource) {
      this.dataSourceInit(invitations);
    }

    // Set up data correctly on each change
    const paginated = this.isPaginated(invitations);
    if (isDynamicDataSource(this.dataSource) && paginated) {
      this.dataSource.data = invitations.data;
      this.dataSource.count = invitations.totalCount;
    } else if (!isDynamicDataSource(this.dataSource) && !paginated) {
      this.dataSource.data = invitations;
    }
  }

  @Input() set filter(value: string) {
    this.dataSource.filter = value;
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<InvitationWithSender>(
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
    if (this.cachedSelection && changes['invitations']) {
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

  isPaginated(
    data: InvitationWithSender[] | PaginatedInvitationsWithSender,
  ): data is PaginatedInvitationsWithSender {
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
        true,
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

  toggleRow(row: InvitationWithSender): void {
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

  getExportDataForColumn(data: InvitationWithSender, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'status':
        return data.status;
      case 'expiration':
        return data.expiration;
      case 'receiverName':
        return data.receiverName;
      case 'receiverEmail':
        return data.receiverEmail;
      case 'senderName':
        return data.senderName;
      case 'senderEmail':
        return data.senderEmail;
      default:
        return '';
    }
  }

  getDataForColumnFun = (data: InvitationWithSender, column: string): string => {
    return this.getExportDataForColumn(data, column);
  };

  private dataSourceInit(
    invitations: InvitationWithSender[] | PaginatedInvitationsWithSender,
  ): void {
    const paginated = this.isPaginated(invitations);

    // Create data source based on input type
    this.dataSource = paginated
      ? new DynamicDataSource(
          invitations.data,
          invitations.totalCount,
          this.sort,
          this.child.paginator,
        )
      : new MatTableDataSource(invitations);

    if (isDynamicDataSource(this.dataSource)) {
      // Subscribe to data source changes and pass them to parent
      this.dataSource.pageQuery$.subscribe((query) => this.queryChanged.emit(query));
    } else {
      // Initialize client-side data source
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: InvitationWithSender, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          getExportDataForColumn,
          true,
        );
      this.dataSource.sortData = (
        data: InvitationWithSender[],
        sort: MatSort,
      ): InvitationWithSender[] => customDataSourceSort(data, sort, getSortDataColumn);
    }
  }
}
