import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import {
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
} from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Host } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MultiWordDataCyPipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatCheckboxModule,
    UiAlertsModule,
    IsAllSelectedPipe,
    MiddleClickRouterLinkDirective,
    TableWrapperComponent,
    RouterModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MasterCheckboxLabelPipe,
    CheckboxLabelPipe,
    MultiWordDataCyPipe,
  ],
  standalone: true,
  selector: 'app-hosts-list',
  templateUrl: './hosts-list.component.html',
  styleUrls: ['./hosts-list.component.css'],
})
export class HostsListComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @Input()
  hosts: Host[] = [];
  @Input()
  selection = new SelectionModel<Host>(true, []);
  @Input()
  cachedSubject: BehaviorSubject<boolean>;
  @Input()
  filterValue: string;
  @Input()
  tableId: string;
  @Input()
  facilityId: number;
  @Input()
  disableRouting = false;
  @Input()
  displayedColumns: string[] = ['select', 'id', 'name'];
  @Input()
  loading: boolean;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<Host>;
  dataSource: MatTableDataSource<Host>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  private sort: MatSort;

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static getDataForColumn(data: Host, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'name':
        return data.hostname;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<Host>(
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
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.dataSource = new MatTableDataSource<Host>(this.hosts);
    this.setDataSource();
    this.dataSource.filter = this.filterValue;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        HostsListComponent.getDataForColumn,
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
        HostsListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Host, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          HostsListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: Host[], sort: MatSort): Host[] =>
        customDataSourceSort(data, sort, HostsListComponent.getDataForColumn);
      this.dataSource.paginator = this.child.paginator;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.tableCheckbox.masterToggle(
      this.isAllSelected(),
      this.selection,
      this.cachedSelection,
      this.filterValue,
      this.dataSource,
      this.sort,
      this.child.paginator.pageSize,
      this.child.paginator.pageIndex,
      false,
    );
  }

  toggleRow(row: Host): void {
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }
}
