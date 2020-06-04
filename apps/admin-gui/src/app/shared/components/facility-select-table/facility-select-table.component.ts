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
import { RichFacility } from '@perun-web-apps/perun/openapi';
import { parseTechnicalOwnersNames, TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';

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
  displayedColumns: string[] = ['id', 'recent', 'name', 'description', 'technicalOwners'];

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

  pageChanged(event: PageEvent) {
    this.page.emit(event);
  }
}
