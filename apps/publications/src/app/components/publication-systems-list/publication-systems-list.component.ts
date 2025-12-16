import { TranslateModule } from '@ngx-translate/core';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PublicationSystem } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableConfigService } from '@perun-web-apps/config/table-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [
    CommonModule,
    UiAlertsModule,
    TableWrapperComponent,
    MatTableModule,
    MatSortModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'perun-web-apps-publication-systems-list',
  templateUrl: './publication-systems-list.component.html',
  styleUrls: ['./publication-systems-list.component.scss'],
})
export class PublicationSystemsListComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() publicationSystems: PublicationSystem[] = [];
  @Input() filterValue: string;
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() loading: boolean;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  dataSource: MatTableDataSource<PublicationSystem>;
  displayedColumns: string[] = ['id', 'friendlyName', 'loginNamespace', 'url', 'type'];
  unfilteredColumns = this.displayedColumns;
  tableId = 'perun-web-apps-publication-systems-list';

  private sort: MatSort;

  constructor(
    private tableConfigService: TableConfigService,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set displayColumns(columns: string[]) {
    this.unfilteredColumns = columns;
    if (localStorage.getItem('showIds') !== 'true') {
      columns = columns.filter((column) => column !== 'id');
    }
    this.displayedColumns = columns;
  }

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static getDataForColumn(data: PublicationSystem, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'friendlyName':
        return data.friendlyName;
      case 'url':
        return data.url;
      case 'loginNamespace':
        return data.loginNamespace;
      case 'type':
        return data.type;
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    this.watchForIdColumnChanges();
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<PublicationSystem>(this.publicationSystems);
    this.setDataSource();
    this.dataSource.filter = this.filterValue;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        PublicationSystemsListComponent.getDataForColumn,
      ),
      format,
    );
  }

  exportDisplayedData(format: string): void {
    const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
    const end = start + this.dataSource.paginator.pageSize;
    downloadData(
      getDataForExport(
        this.dataSource
          .sortData(this.dataSource.filteredData, this.dataSource.sort)
          .slice(start, end),
        this.displayedColumns,
        PublicationSystemsListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: PublicationSystem, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          PublicationSystemsListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: PublicationSystem[], sort: MatSort): PublicationSystem[] =>
        customDataSourceSort(data, sort, PublicationSystemsListComponent.getDataForColumn);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }

  private watchForIdColumnChanges(): void {
    this.tableConfigService.showIdsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((showIds) => {
        if (showIds) {
          this.displayedColumns = this.unfilteredColumns;
        } else {
          this.displayedColumns = this.unfilteredColumns.filter((column) => column !== 'id');
        }
      });
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
  }
}
