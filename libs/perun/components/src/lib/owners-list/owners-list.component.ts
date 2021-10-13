import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Owner} from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort, downloadData, getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { TableWrapperComponent } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'perun-web-apps-owners-list',
  templateUrl: './owners-list.component.html',
  styleUrls: ['./owners-list.component.scss']
})
export class OwnersListComponent implements OnChanges, AfterViewInit {

  @ViewChild(TableWrapperComponent, {static: true}) child: TableWrapperComponent;

  constructor(private authResolver: GuiAuthResolver,
              private tableCheckbox: TableCheckbox) {
  }

  @Input()
  owners: Owner[] = [];

  @Input()
  selection = new SelectionModel<Owner>(true, []);

  @Input()
  tableId: string;

  @Input()
  filterValue = '';

  @Input()
  displayedColumns: string[] = ['select', 'id', 'name', 'contact', 'type'];

  dataSource: MatTableDataSource<Owner>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  private sort: MatSort;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  ngAfterViewInit() {
    this.setDataSource();
  }

  getDataForColumn(data: Owner, column: string): string{
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'name':
        return data.name;
      case 'contact':
        return  data.contact;
      case 'type':
        return data.type;
      default:
        return '';
    }
  }

  exportData(format: string){
    downloadData(getDataForExport(this.dataSource.filteredData, this.displayedColumns, this.getDataForColumn, this), format);
  }

  setDataSource() {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: Owner, filter: string) => customDataSourceFilterPredicate(data, filter, this.displayedColumns, this.getDataForColumn, this);
      this.dataSource.sortData = (data: Owner[], sort: MatSort) => customDataSourceSort(data, sort, this.getDataForColumn, this);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  ngOnChanges() {
    if (!this.authResolver.isPerunAdminOrObserver()){
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'id');
    }
    this.dataSource = new MatTableDataSource<Owner>(this.owners);
    this.setDataSource();
  }

  isAllSelected() {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.filterValue, this.child.paginator.pageSize, this.child.paginator.hasNextPage(), this.dataSource);
  }

  masterToggle() {
    this.tableCheckbox.masterToggle(this.isAllSelected(), this.selection, this.filterValue, this.dataSource, this.sort, this.child.paginator.pageSize, this.child.paginator.pageIndex,false);
  }

  checkboxLabel(row?: Owner): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
