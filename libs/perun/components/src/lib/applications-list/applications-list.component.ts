import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import {
  ApplicationStatePipe,
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
  ModifiedNamePipe,
  SelectApplicationLinkPipe,
  UserFullNamePipe,
} from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
  User,
} from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadApplicationsData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  GuiAuthResolver,
  TableCheckbox,
  PerunTranslateService,
} from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { DynamicDataSource, isDynamicDataSource, PageQuery } from '@perun-web-apps/perun/models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { getExportDataForColumn, getSortDataColumn } from '@perun-web-apps/perun/utils';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { MultiWordDataCyPipe } from '@perun-web-apps/perun/pipes';
import { AppFedInfoParsePipe } from '@perun-web-apps/perun/pipes';
import { AppValuePipe } from '@perun-web-apps/perun/pipes';
import { ApplicationTypeIconComponent } from '../application-type-icon/application-type-icon.component';
import { AppCreatedByNamePipe } from '@perun-web-apps/perun/pipes';
import { TableConfigService } from '@perun-web-apps/config/table-config';
@Component({
  imports: [
    CommonModule,
    MatCheckboxModule,
    UiAlertsModule,
    IsAllSelectedPipe,
    MiddleClickRouterLinkDirective,
    TableWrapperComponent,
    RouterModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    CheckboxLabelPipe,
    ApplicationStatePipe,
    UserFullNamePipe,
    SelectApplicationLinkPipe,
    MasterCheckboxLabelPipe,
    MultiWordDataCyPipe,
    UserFullNamePipe,
    AppFedInfoParsePipe,
    AppValuePipe,
    ApplicationTypeIconComponent,
    ModifiedNamePipe,
    AppCreatedByNamePipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.css'],
})
export class ApplicationsListComponent implements OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() fedColumnsFriendly: string[] = [];
  @Input() tableId: string;
  @Input() disableRouting = false;
  @Input() group: Group;
  @Input() member: Member;
  @Input() user: User;
  @Input() fedAttrs: AttributeDefinition[] = [];
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() selection: SelectionModel<Application>;
  @Input() loading: boolean;
  @Input() noAppsAlert = 'VO_DETAIL.APPLICATION.NO_APPLICATION_FOUND';
  @Input() cacheSubject: BehaviorSubject<boolean>;
  @Input() resetPagination: BehaviorSubject<boolean>;

  @Output() queryChanged = new EventEmitter<PageQuery>();
  @Output() downloadAll = new EventEmitter<{ format: string; length: number }>();
  parsedColumns: string[] = [];
  dataSource: MatTableDataSource<Application> | DynamicDataSource<Application>;
  fedColumnsDisplay = [];

  // contains all selected applications across all pages
  cachedSelection: SelectionModel<Application>;
  displayedColumns: string[] = [];
  unfilteredColumns = this.displayedColumns;

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private translate: PerunTranslateService,
    private tableConfigService: TableConfigService,
    private destroyRef: DestroyRef,
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

  @Input() set displayColumns(columns: string[]) {
    this.unfilteredColumns = columns;
    if (localStorage.getItem('showIds') !== 'true') {
      columns = columns.filter((column) => column !== 'id');
    }
    this.displayedColumns = columns;
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<Application>(
        this.selection.isMultipleSelection(),
        [],
        true,
        this.selection.compareWith,
      );
    }
    this.cacheSubject?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (val) {
        this.cachedSelection.clear();
      }
    });
    this.resetPagination?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (val) {
        this.child.paginator.firstPage();
      }
    });
    this.watchForIdColumnChanges();
    if (this.loading || !this.displayedColumns.includes('fedInfo')) return;
    const data = this.dataSource.data[0] as RichApplication;
    if (data) {
      this.parseColumns(data.formData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cachedSelection && changes['applications']) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
    if (this.cachedSelection && changes['filter']) {
      this.selection.clear();
      this.cachedSelection.clear();
    }
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
        this.cachedSelection,
        !this.isAllSelected(),
      );
    } else {
      this.tableCheckbox.masterToggle(
        this.isAllSelected(),
        this.selection,
        this.cachedSelection,
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

  toggleRow(row: Application): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    if (isDynamicDataSource(this.dataSource)) {
      return;
    }
    if (this.cachedSelection) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
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
