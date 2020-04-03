import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'perun-web-apps-ssh-keys-list',
  templateUrl: './ssh-keys-list.component.html',
  styleUrls: ['./ssh-keys-list.component.scss']
})
export class SshKeysListComponent implements OnChanges, AfterViewInit {

  constructor() {
  }

  // ngOnInit() {
  // }

  @Input()
  sshKeys: string[] = [];

  @Input()
  selection = new SelectionModel<string>(false, []);

  private sort: MatSort;

  @Input()
  hideColumns: string[] = [];

  displayedColumns: string[] = ['select', 'key'];
  dataSource: MatTableDataSource<string>;
  pageSize = 3;
  exporting = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    this.sshKeys = this.sshKeys ? this.sshKeys : [];
    this.dataSource = new MatTableDataSource<string>(this.sshKeys);
    this.setDataSource();
  }

  setDataSource() {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
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
