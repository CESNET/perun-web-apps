import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TaskResult } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { formatDate } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';

@Component({
  selector: 'perun-web-apps-task-results-list',
  templateUrl: './task-results-list.component.html',
  styleUrls: ['./task-results-list.component.css'],
})
export class TaskResultsListComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @Input() taskResults: TaskResult[] = [];
  @Input() selection = new SelectionModel<TaskResult>(true, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() filterValue: string;
  @Input() tableId: string;
  @Input() loading: boolean;
  @Input() displayedColumns: string[] = [
    'select',
    'id',
    'destination',
    'type',
    'service',
    'status',
    'time',
    'returnCode',
    'standardMessage',
    'errorMessage',
  ];

  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  dataSource: MatTableDataSource<TaskResult>;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<TaskResult>;
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

  static getSortDataForColumn(data: TaskResult, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'destination':
        return data.destination.destination;
      case 'type':
        return data.destination.type;
      case 'service':
        return data.service.name;
      case 'status':
        return data.status;
      case 'time':
        return data?.timestamp
          ? formatDate(data.timestamp.toString(), 'yyyy.MM.dd HH:mm:ss', 'en')
          : null;
      case 'returnCode':
        return data?.returnCode.toString();
      case 'standardMessage':
        return data.standardMessage;
      case 'errorMessage':
        return data.errorMessage;
      default:
        return '';
    }
  }

  static getDataForColumn(data: TaskResult, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'destination':
        return data.destination.destination;
      case 'type':
        return data.destination.type;
      case 'service':
        return data.service.name;
      case 'status':
        return data.status;
      case 'time':
        return data?.timestamp
          ? formatDate(data.timestamp.toString(), 'd.M.y H:mm:ss', 'en')
          : null;
      case 'returnCode':
        return data?.returnCode.toString();
      case 'standardMessage':
        return data.standardMessage;
      case 'errorMessage':
        return data.errorMessage;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<TaskResult>(
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
    this.dataSource = new MatTableDataSource<TaskResult>(this.taskResults);
    this.setDataSource();
    this.dataSource.filter = this.filterValue;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        TaskResultsListComponent.getDataForColumn,
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
        TaskResultsListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filter = this.filterValue;
      this.dataSource.filterPredicate = (data: TaskResult, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          TaskResultsListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: TaskResult[], sort: MatSort): TaskResult[] =>
        customDataSourceSort(data, sort, TaskResultsListComponent.getSortDataForColumn);
    }
  }

  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }

  toggleRow(row: TaskResult): void {
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
