import {AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Group } from '@perun-web-apps/perun/openapi';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'perun-web-apps-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements AfterViewInit, OnChanges {

  constructor() { }

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @Output()
  moveGroup = new EventEmitter<Group>();

  @Input()
  groups: Group[] = [];

  @Input()
  selection = new SelectionModel<Group>(true, []);

  private sort: MatSort;
  private hasMembersGroup = false;

  @Input()
  hideColumns: string[] = [];

  @Input()
  disableMembers: boolean;

  @Input()
  pageSize = 10;

  @Input()
  filter = '';

  @Input()
  disableHeadCheckbox: boolean;

  @Input()
  disableRouting = false;

  @Output()
  page = new EventEmitter<PageEvent>();

  displayedColumns: string[] = ['select', 'id', 'vo', 'name', 'description', 'menu'];
  dataSource: MatTableDataSource<Group>;

  exporting = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  ngOnChanges(changes: SimpleChanges) {
    this.hasMembersGroup = this.checkIfHasMembersGroup();
    this.dataSource = new MatTableDataSource<Group>(this.groups);
    this.setDataSource();
  }

  checkIfHasMembersGroup(): boolean {
    for (const group of this.groups) {
      if (group.name === 'members') {
        return true;
      }
    }
    return false;
  }

  setDataSource() {
    this.displayedColumns = this.displayedColumns.filter(x => !this.hideColumns.includes(x));
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.filter;
    }
  }

  isAllSelected() {
    let numSelected = this.selection.selected.length;

    if (numSelected > 0 && this.hasMembersGroup && this.disableMembers) {
      numSelected++;
    }

    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        if (row.name !== 'members' ) {
          this.selection.select(row);
        } else if (!this.disableMembers) {
          this.selection.select(row);
        }
      });
  }

  checkboxLabel(row?: Group): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onMoveGroup(group: Group) {
    this.moveGroup.emit(group);
  }

  pageChanged(event: PageEvent) {
    this.page.emit(event);
  }
}

