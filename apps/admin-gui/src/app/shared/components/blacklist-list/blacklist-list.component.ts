import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { BanOnFacility, User } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort, downloadData, getDataForExport, parseName, TABLE_ITEMS_COUNT_OPTIONS, TableWrapperComponent
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';


@Component({
  selector: 'app-perun-web-apps-blacklist-list',
  templateUrl: './blacklist-list.component.html',
  styleUrls: ['./blacklist-list.component.scss']
})
export class BlacklistListComponent implements AfterViewInit, OnChanges {

  private sort: MatSort;

  constructor(private authResolver: GuiAuthResolver,
              private tableCheckbox: TableCheckbox) {
  }

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @Input()
  bansOnFacilitiesWithUsers: [BanOnFacility, User][] = [];
  @Input()
  selection = new SelectionModel<[BanOnFacility, User]>(true, []);
  @Input()
  filterValue: string;

  @Input()
  tableId: string;

  displayedColumns: string[] = ['select', 'userId', 'name', 'reason'];
  dataSource: MatTableDataSource<[BanOnFacility, User]>;

  @ViewChild(TableWrapperComponent, {static: true}) child: TableWrapperComponent;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  ngOnChanges() {
    if (!this.authResolver.isPerunAdminOrObserver()){
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'userId');
    }
    this.dataSource = new MatTableDataSource<[BanOnFacility, User]>(this.bansOnFacilitiesWithUsers);
    this.setDataSource();
    this.dataSource.filter = this.filterValue;
  }

  getDataForColumn(data: [BanOnFacility, User], column: string): string{
    switch (column) {
      case 'userId':
        return data[1].id.toString();
      case 'reason':
        return data[0].description;
      case 'name':
        return  parseName(data[1]);
      default:
        return '';
    }
  }

  exportData(format: string){
    downloadData(getDataForExport(this.dataSource.filteredData, this.displayedColumns, this.getDataForColumn, this), format);
  }

  setDataSource() {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: [BanOnFacility, User], filter: string) => customDataSourceFilterPredicate(data, filter, this.displayedColumns, this.getDataForColumn, this);
      this.dataSource.sortData = (data: [BanOnFacility, User][], sort: MatSort) => customDataSourceSort(data, sort, this.getDataForColumn, this);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.filterValue, this.child.paginator.pageSize, this.child.paginator.hasNextPage(), this.dataSource);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.tableCheckbox.masterToggle(this.isAllSelected(), this.selection, this.filterValue, this.dataSource, this.sort, this.child.paginator.pageSize, this.child.paginator.pageIndex,false);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: [BanOnFacility, User]): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row[0].userId + 1}`;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }
}

