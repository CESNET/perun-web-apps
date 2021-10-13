import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { downloadData, getDataForExport, TableWrapperComponent } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'perun-web-apps-string-list',
  templateUrl: './string-list.component.html',
  styleUrls: ['./string-list.component.scss']
})
export class StringListComponent implements OnChanges, AfterViewInit {

  constructor() {
  }

  @Input()
  values: string[] = [];

  @Input()
  selection = new SelectionModel<string>(false, []);

  @Input()
  alertText = '';

  @Input()
  headerColumnText = '';

  private sort: MatSort;

  displayedColumns: string[] = ['select', 'value'];
  dataSource: MatTableDataSource<string>;

  @ViewChild(TableWrapperComponent, {static: true}) child: TableWrapperComponent;

  ngOnChanges() {
    this.values = this.values ? this.values : [];
    this.dataSource = new MatTableDataSource<string>(this.values);
    this.setDataSource();
  }
  getExportDataForColumn(data: string){
    return data;
  }

  exportData(format: string){
    downloadData(getDataForExport(this.dataSource.filteredData, this.displayedColumns, this.getExportDataForColumn, this), format);
  }


  setDataSource() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
    }
  }

  checkboxLabel(row?: string): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  ngAfterViewInit(): void {
    this.setDataSource();
  }
}
