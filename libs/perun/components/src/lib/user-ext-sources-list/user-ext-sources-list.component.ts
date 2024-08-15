import { Component, DestroyRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { RichUserExtSource } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'perun-web-apps-user-ext-sources-list',
  templateUrl: './user-ext-sources-list.component.html',
  styleUrls: ['./user-ext-sources-list.component.scss'],
})
export class UserExtSourcesListComponent implements OnInit, OnChanges {
  @Input() userExtSources: RichUserExtSource[];
  @Input() selection: SelectionModel<RichUserExtSource> = new SelectionModel<RichUserExtSource>();
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() filterValue = '';
  @Input() displayedColumns: string[] = [
    'select',
    'id',
    'mail',
    'extSourceName',
    'login',
    'lastAccess',
  ];
  @Input() tableId: string;
  @Input() extSourceNameHeader: string;
  @Input() loginHeader: string;
  @Input() disableRouting: boolean;
  @Input() loading: boolean;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  dataSource: MatTableDataSource<RichUserExtSource>;
  userId: number;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<RichUserExtSource>;
  private sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static getDataForColumn(data: RichUserExtSource, column: string): string {
    switch (column) {
      case 'id':
        return data.userExtSource.id.toString();
      case 'mail': {
        const attribute = data.attributes.find((att) => att.friendlyName === 'mail');
        return attribute ? (attribute.value as string) : 'N/A';
      }
      case 'extSourceName':
        return data.userExtSource.extSource.name;
      case 'login':
        return data.userExtSource.login;
      case 'lastAccess':
        return data.userExtSource.lastAccess.split('.')[0];
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    if (!this.disableRouting) {
      this.route.parent.params.subscribe((params) => {
        this.userId = Number(params['userId']);
      });
    }
    this.setDataSource();

    if (this.selection) {
      this.cachedSelection = new SelectionModel<RichUserExtSource>(
        this.selection.isMultipleSelection(),
        [],
        true,
        this.selection.compareWith,
      );
      this.cachedSubject?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        if (value) {
          this.cachedSelection.clear();
        }
      });
    }
  }

  ngOnChanges(): void {
    if (!this.authResolver.isPerunAdminOrObserver()) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.dataSource = new MatTableDataSource<RichUserExtSource>(this.userExtSources);
    this.setDataSource();
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        UserExtSourcesListComponent.getDataForColumn,
      ),
      format,
    );
  }

  exportDisplayedData(format: string): void {
    const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
    const end = start + this.dataSource.paginator.pageSize;
    downloadData(
      getDataForExport(
        this.dataSource
          .sortData(this.dataSource.filteredData, this.dataSource.sort)
          .slice(start, end),
        this.displayedColumns,
        UserExtSourcesListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: RichUserExtSource, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          UserExtSourcesListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: RichUserExtSource[], sort: MatSort): RichUserExtSource[] =>
        customDataSourceSort(data, sort, UserExtSourcesListComponent.getDataForColumn);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  toggleRow(row: RichUserExtSource): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    if (this.cachedSelection) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }
}
