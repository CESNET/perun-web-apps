import { Component, DestroyRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnrichedFacility, Group } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { SelectionModel } from '@angular/cdk/collections';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'perun-web-apps-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.scss'],
})
export class FacilitiesListComponent implements OnInit, OnChanges {
  @Input() facilities: EnrichedFacility[];
  @Input() loading: boolean;
  @Input() facilityWithAuthzGroupPairs: Map<number, Group[]>;
  @Input() authzVoNames: Map<number, string>;
  @Input() recentIds: number[];
  @Input() filterValue: string;
  @Input() tableId: string;
  @Input() displayedColumns: string[] = [
    'select',
    'id',
    'recent',
    'name',
    'description',
    'destinations',
    'hosts',
  ];
  @Input() selection: SelectionModel<EnrichedFacility>;
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() disableRouting = false;
  @Input() enableMasterCheckbox = false;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  dataSource: MatTableDataSource<EnrichedFacility>;
  localDisableRouting: boolean;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<EnrichedFacility>;

  private sort: MatSort;

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  static getDataForColumn(data: EnrichedFacility, column: string, recentIds: number[]): string {
    switch (column) {
      case 'id':
        return data.facility.id.toString();
      case 'name':
        return data.facility.name;
      case 'description':
        return data.facility.description;
      case 'recent':
        if (recentIds) {
          if (recentIds.includes(data.facility.id)) {
            return '#'.repeat(recentIds.indexOf(data.facility.id));
          }
        }
        return data['name'] as string;
      case 'destinations':
        return data.destinations.map((d) => d.destination).join(' ; ');
      case 'hosts':
        return data.hosts.map((d) => d.hostname).join(' ; ');
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<EnrichedFacility>(
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

  getDataForColumnFun = (data: EnrichedFacility, column: string): string => {
    return FacilitiesListComponent.getDataForColumn(data, column, this.recentIds);
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
      this.dataSource = new MatTableDataSource<EnrichedFacility>();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: EnrichedFacility, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          this.getDataForColumnFun,
        );
      this.dataSource.sortData = (data: EnrichedFacility[], sort: MatSort): EnrichedFacility[] =>
        customDataSourceSort(data, sort, this.getDataForColumnFun);
    }
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.facilities;
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

  toggleRow(row: EnrichedFacility): void {
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
