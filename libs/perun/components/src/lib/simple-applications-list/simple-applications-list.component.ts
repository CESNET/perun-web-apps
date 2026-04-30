import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import {
  AppCreatedByNamePipe,
  AppFedInfoParsePipe,
  ApplicationStatePipe,
  AppValuePipe,
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
  ModifiedNamePipe,
  MultiWordDataCyPipe,
  SelectApplicationLinkNewRegPipe,
  UserFullNamePipe,
} from '@perun-web-apps/perun/pipes';
import { AlertComponent } from '@perun-web-apps/ui/alerts';
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
  ApplicationFormItemData,
  AttributeDefinition,
  Group,
  Member,
  User,
} from '@perun-web-apps/perun/openapi';
import {
  ApplicationWithStringId,
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadApplicationsData,
  getDataForExport,
  getExportDataForColumn,
  getExportDataForColumnNewReg,
  getSortDataColumnNewReg,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  GuiAuthResolver,
  PerunTranslateService,
  TableCheckbox,
} from '@perun-web-apps/perun/services';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { ApplicationTypeIconComponent } from '../application-type-icon/application-type-icon.component';
import { TableConfigService } from '@perun-web-apps/config/table-config';

@Component({
  imports: [
    CommonModule,
    MatCheckboxModule,
    AlertComponent,
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
    SelectApplicationLinkNewRegPipe,
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
  selector: 'perun-web-apps-simple-applications-list',
  templateUrl: './simple-applications-list.component.html',
  styleUrls: ['./simple-applications-list.component.css'],
})
export class SimpleApplicationsListComponent implements OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() fedColumnsFriendly: string[] = [];
  @Input() disableRouting = false;
  @Input() group: Group;
  @Input() member: Member;
  @Input() user: User;
  @Input() fedAttrs: AttributeDefinition[] = [];
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() selection: SelectionModel<ApplicationWithStringId>;
  @Input() loading: boolean;
  @Input() noAppsAlert = 'VO_DETAIL.APPLICATION.NO_APPLICATION_FOUND';
  @Input() cacheSubject: BehaviorSubject<boolean>;
  @Input() resetPagination: BehaviorSubject<boolean>;

  @Output() downloadAll = new EventEmitter<{ format: string; length: number }>();
  parsedColumns: string[] = [];
  dataSource: MatTableDataSource<ApplicationWithStringId>;
  fedColumnsDisplay = [];

  // contains all selected applications across all pages
  cachedSelection: SelectionModel<ApplicationWithStringId>;
  displayedColumns: string[] = [];
  unfilteredColumns = this.displayedColumns;
  tableId = 'perun-web-apps-simple-applications-list';

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private translate: PerunTranslateService,
    private tableConfigService: TableConfigService,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set applications(applications: ApplicationWithStringId[]) {
    // Initialize data source with first applications object passed
    if (!this.dataSource) {
      this.dataSourceInit(applications);
    } else {
      this.dataSource.data = applications;
    }
  }

  @Input() set filter(value: string) {
    if (this.dataSource) {
      this.dataSource.filter = value;
    }
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
      this.cachedSelection = new SelectionModel<ApplicationWithStringId>(
        this.selection.isMultipleSelection(),
        [],
        true,
        this.selection.compareWith,
      );
    }
    this.cacheSubject?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (val) {
        this.cachedSelection?.clear();
      }
    });
    this.resetPagination?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (val) {
        this.child.paginator.firstPage();
      }
    });
    this.watchForIdColumnChanges();
    if (this.loading || !this.displayedColumns.includes('fedInfo')) return;
    const data = this.dataSource?.data?.[0];
    if (data && 'formData' in data) {
      this.parseColumns((data as unknown as { formData: Array<ApplicationFormItemData> }).formData);
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

  exportDisplayedData(format: string): void {
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

  exportAllData(format: string): void {
    downloadApplicationsData(
      getDataForExport(this.dataSource.filteredData, this.displayedColumns, getExportDataForColumn),
      this.translate,
      format,
    );
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

  toggleRow(row: ApplicationWithStringId): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    if (this.cachedSelection) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }

  private dataSourceInit(applications: ApplicationWithStringId[]): void {
    // Create client-side data source only
    this.dataSource = new MatTableDataSource(applications);

    // Initialize client-side data source
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.child.paginator;
    this.dataSource.filterPredicate = (data: ApplicationWithStringId, filter: string): boolean =>
      customDataSourceFilterPredicate(
        data as unknown as ApplicationWithStringId,
        filter,
        this.displayedColumns,
        getExportDataForColumnNewReg,
        true,
      );
    this.dataSource.sortData = (
      data: ApplicationWithStringId[],
      sort: MatSort,
    ): ApplicationWithStringId[] =>
      customDataSourceSort(
        data as unknown as ApplicationWithStringId[],
        sort,
        getSortDataColumnNewReg,
      ) as unknown as ApplicationWithStringId[];
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
