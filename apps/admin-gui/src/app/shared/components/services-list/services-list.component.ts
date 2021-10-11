import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Service} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort, downloadData, getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS, TableWrapperComponent
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements AfterViewInit, OnChanges {

  constructor(private authResolver: GuiAuthResolver,
              private tableCheckbox: TableCheckbox) { }

  @ViewChild(MatSort, {static: true}) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @Input()
  services: Service[] = [];

  @Input()
  filterValue = '';

  @Input()
  tableId: string;

  @Input()
  displayedColumns: string[] = ['select', 'id', 'name', 'enabled', 'script', 'description'];

  @Input()
  selection = new SelectionModel<Service>(true, []);

  @Input()
  disableRouting = false;

  private sort: MatSort;

  dataSource: MatTableDataSource<Service>;

  @ViewChild(TableWrapperComponent, {static: true}) child: TableWrapperComponent;

  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  ngOnChanges() {
    if (!this.authResolver.isPerunAdminOrObserver()){
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'id');
    }
    this.dataSource = new MatTableDataSource<Service>(this.services);
    this.setDataSource();
  }

  getDataForColumn(data: Service, column: string): string{
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'name':
        return data.name;
      case 'enabled':
        return data.enabled ? 'true' : 'false';
      case 'script':
        return data.script;
      case 'description':
        return data.description;
      default:
        return '';
    }
  }

  exportData(format: string){
    downloadData(getDataForExport(this.dataSource.filteredData, this.displayedColumns, this.getDataForColumn, this), format);
  }

  setDataSource() {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: Service, filter: string) => customDataSourceFilterPredicate(data, filter, this.displayedColumns, this.getDataForColumn, this);
      this.dataSource.sortData = (data: Service[], sort: MatSort) => customDataSourceSort(data, sort, this.getDataForColumn, this);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.filterValue, this.child.paginator.pageSize, this.child.paginator.hasNextPage(), this.dataSource);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.tableCheckbox.masterToggle(this.isAllSelected(), this.selection, this.filterValue, this.dataSource, this.sort, this.child.paginator.pageSize, this.child.paginator.pageIndex, false);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Service): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }
}
