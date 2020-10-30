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
import { MatSort } from '@angular/material/sort';
import { RichDestination } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'app-perun-web-apps-destination-list',
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.scss']
})
export class DestinationListComponent implements AfterViewInit, OnChanges {

  constructor() { }

  @Input()
  destinations: RichDestination[] = [];
  @Input()
  selection = new SelectionModel<RichDestination>(true, []);
  @Input()
  filterValue = "";
  @Input()
  pageSize = 10;
  @Input()
  displayedColumns: string[];

  @Output()
  page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  private sort: MatSort;

  dataSource: MatTableDataSource<RichDestination>;

  exporting = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource<RichDestination>(this.destinations);
    this.setDataSource();
    this.dataSource.filter = this.filterValue.toLowerCase();
  }

  setDataSource() {
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'destinationId': {
            return item.id
          }
          case 'service': {
            return item.service.name;
          }
          case 'facility': {
            return item.facility.name
          }
          default: return item[property];
        }
      };
      this.dataSource.filterPredicate = (data, filter) => {
        let dataStr = '';
        if(this.displayedColumns.includes('service')){
          dataStr = data.service.name + data.id + data.destination + data.type + data.propagationType;
        } else {
          dataStr = data.facility.name + data.id + data.destination + data.type + data.propagationType;
        }

        return dataStr.toLowerCase().indexOf(filter) !== -1;
      };
      this.dataSource.paginator = this.paginator;
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
  checkboxLabel(row?: RichDestination): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  pageChanged(event: PageEvent) {
    this.page.emit(event);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

}
