import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { RichUserExtSource, UserExtSource } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'perun-web-apps-user-ext-sources-list',
  templateUrl: './user-ext-sources-list.component.html',
  styleUrls: ['./user-ext-sources-list.component.scss']
})
export class UserExtSourcesListComponent implements AfterViewInit, OnChanges {

  constructor() {
  }

  @Input()
  userExtSources: RichUserExtSource[];
  @Input()
  selection: SelectionModel<UserExtSource> = new SelectionModel<UserExtSource>();
  @Input()
  filterValue = '';
  @Input()
  hideColumns: string[] = [];
  @Input()
  pageSize = 5;
  @Input()
  extSourceNameHeader: string;
  @Input()
  loginHeader: string;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  private sort: MatSort;

  displayedColumns: string[] = ['select', 'id', 'mail', 'extSourceName', 'login','loa', 'lastAccess'];
  dataSource: MatTableDataSource<RichUserExtSource>;
  exporting = false;

  ngAfterViewInit() {
    this.setDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    this.dataSource = new MatTableDataSource<RichUserExtSource>(this.userExtSources);
    this.setDataSource();
  }

  setDataSource() {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  checkboxLabel(row?: RichUserExtSource): string {
    return `${this.selection.isSelected(row.userExtSource) ? 'deselect' : 'select'} row ${row.userExtSource.id + 1}`;
  }
}
