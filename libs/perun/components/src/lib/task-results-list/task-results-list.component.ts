import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { TaskResult} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort, downloadData, getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { formatDate } from '@angular/common';
import { TableWrapperComponent } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'perun-web-apps-task-results-list',
  templateUrl: './task-results-list.component.html',
  styleUrls: ['./task-results-list.component.css']
})
export class TaskResultsListComponent implements AfterViewInit, OnChanges {

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @ViewChild(TableWrapperComponent, {static: true}) child: TableWrapperComponent;

  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  constructor(private authResolver: GuiAuthResolver,
              private tableCheckbox: TableCheckbox) { }

  @Input()
  taskResults: TaskResult[] = [];
  @Input()
  selection = new SelectionModel<TaskResult>(true, []);
  @Input()
  filterValue: string;
  @Input()
  pageSize = 10;
  @Input()
  displayedColumns: string[] = ['select', 'id', 'destination', 'type', 'service', 'status', 'time', 'returnCode', 'standardMessage', 'errorMessage'];

  @Output()
  page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  private sort: MatSort;
  dataSource: MatTableDataSource<TaskResult>;

  ngOnChanges() {
    if (!this.authResolver.isPerunAdminOrObserver()){
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'id');
    }
    this.dataSource = new MatTableDataSource<TaskResult>(this.taskResults);
    this.setDataSource();
    this.dataSource.filter = this.filterValue;
  }

  getDataForColumn(data: TaskResult, column: string): string{
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'destination':
        return data.destination.destination;
      case 'type':
        return  data.destination.type;
      case 'service':
        return data.service.name;
      case 'status':
        return data.status;
      case 'time':
        return formatDate(data.timestamp.toString(), 'd.M.y H:mm:ss', 'en');
      case 'returnCode':
        return data.returnCode.toString();
      case 'standardMessage':
        return data.standardMessage;
      case 'errorMessage':
        return  data.errorMessage;
      default:
        return '';
    }
  }

  getSortDataForColumn(data: TaskResult, column: string): string{
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'destination':
        return data.destination.destination;
      case 'type':
        return  data.destination.type;
      case 'service':
        return data.service.name;
      case 'status':
        return data.status;
      case 'time':
        return formatDate(data.timestamp.toString(), 'yyyy.MM.dd HH:mm:ss', 'en');
      case 'returnCode':
        return data.returnCode.toString();
      case 'standardMessage':
        return data.standardMessage;
      case 'errorMessage':
        return  data.errorMessage;
      default:
        return '';
    }
  }

  exportData(format: string){
    downloadData(getDataForExport(this.dataSource.filteredData, this.displayedColumns, this.getDataForColumn, this), format);
  }

  setDataSource() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filter = this.filterValue;
      this.dataSource.filterPredicate = (data: TaskResult, filter: string) => customDataSourceFilterPredicate(data, filter, this.displayedColumns, this.getDataForColumn, this);
      this.dataSource.sortData = (data: TaskResult[], sort: MatSort) => customDataSourceSort(data, sort, this.getSortDataForColumn, this);
    }
  }

  isAllSelected() {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.filterValue, this.pageSize, this.child.paginator.hasNextPage(), this.dataSource);
  }

  masterToggle() {
    this.tableCheckbox.masterToggle(this.isAllSelected(), this.selection, this.filterValue, this.dataSource, this.sort, this.pageSize, this.child.paginator.pageIndex,false);
  }

  checkboxLabel(row?: TaskResult): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }
}
