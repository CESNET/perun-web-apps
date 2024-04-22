import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Application,
  ApplicationFormItemData,
  AttributeDefinition,
  Group,
  Member,
  PaginatedRichApplications,
  RichApplication,
} from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadApplicationsData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { MatSort } from '@angular/material/sort';
import {
  GuiAuthResolver,
  TableCheckbox,
  PerunTranslateService,
} from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { DynamicDataSource, isDynamicDataSource, PageQuery } from '@perun-web-apps/perun/models';
import { MatTableDataSource } from '@angular/material/table';
import { getExportDataForColumn, getSortDataColumn } from '@perun-web-apps/perun/utils';
@Component({
  selector: 'perun-web-apps-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.css'],
})
export class ApplicationsListComponent implements OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() displayedColumns: string[] = [];
  @Input() fedColumnsFriendly: string[] = [];
  @Input() tableId: string;
  @Input() disableRouting = false;
  @Input() group: Group;
  @Input() member: Member;
  @Input() fedAttrs: AttributeDefinition[] = [];
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() selection = new SelectionModel<Application>(true, []);
  @Input() loading: boolean;
  @Input() noAppsAlert = 'VO_DETAIL.APPLICATION.NO_APPLICATION_FOUND';

  @Output() queryChanged = new EventEmitter<PageQuery>();

  @Output() downloadAll = new EventEmitter<{ format: string; length: number }>();
  parsedColumns: string[] = [];
  dataSource: MatTableDataSource<Application> | DynamicDataSource<Application>;
  fedColumnsDisplay = [];

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private translate: PerunTranslateService,
  ) {}

  @Input() set applications(applications: Application[] | PaginatedRichApplications) {
    // Initialize data source with first applications object passed
    // One table instance can NOT alternate between paginated and not paginated applications
    if (!this.dataSource) {
      this.dataSourceInit(applications);
    }

    // Set up data correctly on each change
    const paginated = this.isPaginated(applications);
    if (isDynamicDataSource(this.dataSource) && paginated) {
      this.dataSource.data = applications.data;
      this.dataSource.count = applications.totalCount;
    } else if (!isDynamicDataSource(this.dataSource) && !paginated) {
      this.dataSource.data = applications;
    }
  }

  @Input() set filter(value: string) {
    this.dataSource.filter = value;
  }

  ngOnInit(): void {
    if (!this.authResolver.isPerunAdminOrObserver()) {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    if (this.loading || !this.displayedColumns.includes('fedInfo')) return;

    const data = this.dataSource.data[0] as RichApplication;
    if (data) {
      this.parseColumns(data.formData);
    }
  }

  ngOnChanges(): void {
    this.fedColumnsDisplay = [];
    this.fedColumnsFriendly.forEach((name) =>
      this.fedColumnsDisplay.push(
        this.fedAttrs.find((attr) => attr.friendlyName === name)?.displayName || '',
      ),
    );
  }

  isAllSelected(): boolean {
    if (isDynamicDataSource(this.dataSource)) {
      return this.tableCheckbox.isAllSelectedPaginated(
        this.dataSource,
        this.selection.selected.length,
      );
    } else {
      return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
    }
  }

  masterToggle(): void {
    if (isDynamicDataSource(this.dataSource)) {
      this.tableCheckbox.masterTogglePaginated(
        this.dataSource,
        this.selection,
        !this.isAllSelected(),
      );
    } else {
      this.tableCheckbox.masterToggle(
        this.isAllSelected(),
        this.selection,
        this.dataSource.filter,
        this.dataSource,
        this.dataSource.sort,
        this.dataSource.paginator.pageSize,
        this.dataSource.paginator.pageIndex,
        true,
      );
    }
  }

  exportDisplayedData(format: string): void {
    if (isDynamicDataSource(this.dataSource)) {
      downloadApplicationsData(
        getDataForExport(this.dataSource.data, this.displayedColumns, getExportDataForColumn),
        this.translate,
        format,
      );
    } else {
      const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
      const end = start + this.dataSource.paginator.pageSize;
      downloadApplicationsData(
        getDataForExport(
          this.dataSource
            .sortData(this.dataSource.filteredData, this.dataSource.sort)
            .slice(start, end),
          this.displayedColumns,
          getExportDataForColumn,
        ),
        this.translate,
        format,
      );
    }
  }

  isPaginated(data: Application[] | PaginatedRichApplications): data is PaginatedRichApplications {
    return 'data' in data;
  }

  exportAllData(format: string): void {
    if (isDynamicDataSource(this.dataSource)) {
      this.downloadAll.emit({ format: format, length: this.dataSource.paginator.length });
    } else {
      downloadApplicationsData(
        getDataForExport(
          this.dataSource.filteredData,
          this.displayedColumns,
          getExportDataForColumn,
        ),
        this.translate,
        format,
      );
    }
  }

  parseColumns(array: Array<ApplicationFormItemData>): void {
    array.forEach((val) => {
      if (!this.displayedColumns.includes(val.shortname)) {
        this.displayedColumns.push(val.shortname);
      }
      if (!this.parsedColumns.includes(val.shortname)) {
        this.parsedColumns.push(val.shortname);
      }
    });
  }

  private dataSourceInit(applications: Application[] | PaginatedRichApplications): void {
    const paginated = this.isPaginated(applications);

    // Create data source based on input type
    this.dataSource = paginated
      ? new DynamicDataSource(
          applications.data,
          applications.totalCount,
          this.sort,
          this.child.paginator,
        )
      : new MatTableDataSource(applications);

    if (isDynamicDataSource(this.dataSource)) {
      // Subscribe to data source changes and pass them to parent
      this.dataSource.pageQuery$.subscribe((query) => this.queryChanged.emit(query));
    } else {
      // Initialize client-side data source
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: Application, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          getExportDataForColumn,
          true,
        );
      this.dataSource.sortData = (data: Application[], sort: MatSort): Application[] =>
        customDataSourceSort(data, sort, getSortDataColumn);
    }
  }
}
