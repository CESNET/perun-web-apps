import { Component, DestroyRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnrichedVo, Group, Vo } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';

@Component({
  selector: 'perun-web-apps-vos-list',
  templateUrl: './vos-list.component.html',
  styleUrls: ['./vos-list.component.scss'],
})
export class VosListComponent implements OnInit, OnChanges {
  @Input() vos: Vo[] | EnrichedVo[] = [];
  @Input() voWithAuthzGroupPairs: Map<number, Group[]>;
  @Input() authzVoNames: Map<number, string>;
  @Input() recentIds: number[];
  @Input() filterValue: string;
  @Input() selection: SelectionModel<Vo>;
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() displayedColumns: string[] = [];
  @Input() disableRouting = false;
  @Input() disableCheckbox = false;
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() tableId: string;
  @Input() enableMasterCheckbox = false;
  @Input() loading: boolean;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  dataSource: MatTableDataSource<Vo | EnrichedVo>;
  disabledRouting = false;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<Vo>;
  private sort: MatSort;

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  static isEnrichedVo = (vo: Vo | EnrichedVo): vo is EnrichedVo =>
    (vo as EnrichedVo).vo !== undefined;

  static getDataForColumn(data: Vo | EnrichedVo, column: string, recentIds: number[]): string {
    if (VosListComponent.isEnrichedVo(data)) {
      data = data.vo;
    }

    switch (column) {
      case 'id':
        return data.id.toString();
      case 'shortName':
        return data.shortName;
      case 'name':
        return data.name;
      case 'recent':
        if (recentIds) {
          if (recentIds.includes(data.id)) {
            return '#'.repeat(recentIds.indexOf(data.id));
          }
        }
        return data['name'];
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<Vo>(
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

  getDataForColumnFun = (data: Vo, column: string): string => {
    return VosListComponent.getDataForColumn(data, column, this.recentIds);
  };

  ngOnChanges(): void {
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.setDataSource();
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        this.getDataForColumnFun,
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
        this.getDataForColumnFun,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<Vo>();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: Vo, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          this.getDataForColumnFun,
        );
      this.dataSource.sortData = (data: Vo[], sort: MatSort): (Vo | EnrichedVo)[] =>
        customDataSourceSort(data, sort, this.getDataForColumnFun);
    }
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.vos;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
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

  toggleRow(row: Vo): void {
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
