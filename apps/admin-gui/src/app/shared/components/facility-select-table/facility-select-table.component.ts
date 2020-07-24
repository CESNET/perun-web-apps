import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Host, RichFacility } from '@perun-web-apps/perun/openapi';
import { parseTechnicalOwnersNames, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-facility-select-table',
  templateUrl: './facility-select-table.component.html',
  styleUrls: ['./facility-select-table.component.scss']
})
export class FacilitySelectTableComponent implements AfterViewInit, OnChanges {
  constructor() { }

  @Input()
  facilities: RichFacility[];

  @Input()
  recentIds: number[];

  @Input()
  filterValue: string;

  @Input()
  pageSize = 10;

  @Input()
  displayedColumns: string[] = ['select', 'id', 'recent', 'name', 'description', 'technicalOwners'];

  @Input()
  selection: SelectionModel<RichFacility>;

  @Output()
  page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  exporting = false;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private sort: MatSort;

  dataSource: MatTableDataSource<RichFacility>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource<RichFacility>(this.facilities);
    this.setDataSource();
    this.dataSource.filter = this.filterValue;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  setDataSource() {
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = ((data, filter) => {
        const lowerCaseFilter = filter.trim().toLowerCase();
        if (data.name.trim().toLowerCase().indexOf(lowerCaseFilter) !== -1) {
          return true;
        }
        if (data.description !== null && data.description.trim().toLowerCase().indexOf(lowerCaseFilter) !== -1) {
          return true;
        }
        if (data.id.toString(10).startsWith(filter)) {
          return true;
        }
        if (this.displayedColumns.indexOf('technicalOwners') !== -1) {
          return parseTechnicalOwnersNames(data.facilityOwners).toLowerCase().indexOf(lowerCaseFilter) !== -1;
        }
        return false;
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: RichFacility): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  pageChanged(event: PageEvent) {
    this.page.emit(event);
  }
}
