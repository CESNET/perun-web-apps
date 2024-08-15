import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Owner, ThanksForGUI } from '@perun-web-apps/perun/openapi';
import { MatSort } from '@angular/material/sort';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TableCheckbox } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'perun-web-apps-thanks-list',
  templateUrl: './thanks-list.component.html',
  styleUrls: ['./thanks-list.component.scss'],
})
export class ThanksListComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() thanks: ThanksForGUI[] = [];
  @Input() filterValue = '';
  @Input() tableId: string;
  @Input() displayedColumns = ['select', 'id', 'name', 'createdBy'];
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() selection = new SelectionModel<Owner>(true, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() loading: boolean;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  dataSource: MatTableDataSource<ThanksForGUI>;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<Owner>;
  private sort: MatSort;

  constructor(
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static getDataForColumn(data: ThanksForGUI, column: string): string {
    switch (column) {
      case 'id':
        return data.ownerId.toString();
      case 'name':
        return data.ownerName;
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<Owner>(
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
    this.dataSource = new MatTableDataSource<ThanksForGUI>(this.thanks);
    this.setDataSource();
    this.dataSource.filter = this.filterValue;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }

  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
  }

  toggleRow(row: Owner): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        ThanksListComponent.getDataForColumn,
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
        ThanksListComponent.getDataForColumn,
      ),
      format,
    );
  }

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

  private setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: ThanksForGUI, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          ThanksListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: ThanksForGUI[], sort: MatSort): ThanksForGUI[] =>
        customDataSourceSort(data, sort, ThanksListComponent.getDataForColumn);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
    }
  }
}
