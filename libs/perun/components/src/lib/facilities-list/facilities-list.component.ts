import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnrichedFacility } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  parseTechnicalOwnersNames,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { SelectionModel } from '@angular/cdk/collections';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { TableWrapperComponent } from '@perun-web-apps/perun/utils';

@Component({
  selector: 'perun-web-apps-facilities-list',
  templateUrl: './facilities-list.component.html',
  styleUrls: ['./facilities-list.component.scss'],
})
export class FacilitiesListComponent implements OnChanges {
  constructor(private authResolver: GuiAuthResolver) {}

  @Input()
  facilities: EnrichedFacility[];

  @Input()
  recentIds: number[];

  @Input()
  filterValue: string;

  @Input()
  tableId: string;

  @Input()
  displayedColumns: string[] = [
    'select',
    'id',
    'recent',
    'name',
    'description',
    'technicalOwners',
    'destinations',
    'hosts',
  ];

  @Input()
  selection: SelectionModel<EnrichedFacility>;

  @Input()
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  private sort: MatSort;

  dataSource: MatTableDataSource<EnrichedFacility>;
  disableRouting: boolean;

  ngOnChanges() {
    if (!this.authResolver.isPerunAdminOrObserver()) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.setDataSource();
  }

  getDataForColumn(
    data: EnrichedFacility,
    column: string,
    otherThis: FacilitiesListComponent
  ): string {
    switch (column) {
      case 'id':
        return data.facility.id.toString();
      case 'name':
        return data.facility.name;
      case 'description':
        return data.facility.description;
      case 'technicalOwners':
        return parseTechnicalOwnersNames(data.owners);
      case 'recent':
        if (otherThis.recentIds) {
          if (otherThis.recentIds.indexOf(data.facility.id) > -1) {
            return '#'.repeat(otherThis.recentIds.indexOf(data.facility.id));
          }
        }
        return data['name'];
      case 'destinations':
        return data.destinations.map((d) => d.destination).join(' ; ');
      case 'hosts':
        return data.hosts.map((d) => d.hostname).join(' ; ');
      default:
        return data[column];
    }
  }

  exportData(format: string) {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        this.getDataForColumn,
        this
      ),
      format
    );
  }

  setDataSource() {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<EnrichedFacility>();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: EnrichedFacility, filter: string) =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          this.getDataForColumn,
          this
        );
      this.dataSource.sortData = (data: EnrichedFacility[], sort: MatSort) =>
        customDataSourceSort(data, sort, this.getDataForColumn, this);
    }
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.facilities;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EnrichedFacility): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.facility.id + 1}`;
  }
}
