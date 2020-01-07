import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ExtSource } from '@perun-web-apps/perun/models';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-ext-sources-list',
  templateUrl: './ext-sources-list.component.html',
  styleUrls: ['./ext-sources-list.component.scss']
})
export class ExtSourcesListComponent implements OnChanges {

  constructor() {
  }

  @Input()
  extSources: ExtSource[];
  @Input()
  selection: SelectionModel<ExtSource>;
  @Input()
  filterValue = '';

  @ViewChild(MatPaginator, { static: false })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  private sort: MatSort;

  displayedColumns: string[] = ['select', 'id', 'name', 'type'];
  dataSource: MatTableDataSource<ExtSource>;
  exporting = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource<ExtSource>(this.extSources);
    this.setDataSource();
  }

  setDataSource() {
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: ExtSource): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
