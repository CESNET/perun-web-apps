import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'perun-web-apps-string-list',
  templateUrl: './string-list.component.html',
  styleUrls: ['./string-list.component.scss']
})
export class StringListComponent implements OnChanges {

  constructor() {
  }

  @Input()
  values: string[] = [];

  @Input()
  selection = new SelectionModel<string>(false, []);

  @Input()
  alertText: string = '';

  @Input()
  headerColumnText: string = '';

  private sort: MatSort;

  displayedColumns: string[] = ['select', 'value'];
  dataSource: MatTableDataSource<string>;
  pageSize = 5;
  exporting = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    this.values = this.values ? this.values : [];
    this.dataSource = new MatTableDataSource<string>(this.values);
    this.setDataSource();
  }

  setDataSource() {
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  checkboxLabel(row?: string): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

}
