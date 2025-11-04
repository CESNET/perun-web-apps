import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import {
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
  ServiceStateBlockedToStringPipe,
} from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Facility, Service, ServiceState } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { formatDate, CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { TableConfigService } from '@perun-web-apps/config/table-config';

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    UiAlertsModule,
    IsAllSelectedPipe,
    MiddleClickRouterLinkDirective,
    TableWrapperComponent,
    RouterModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatTooltip,
    ServiceStateBlockedToStringPipe,
    CheckboxLabelPipe,
    MasterCheckboxLabelPipe,
  ],
  standalone: true,
  selector: 'perun-web-apps-services-status-list',
  templateUrl: './services-status-list.component.html',
  styleUrls: ['./services-status-list.component.css'],
})
export class ServicesStatusListComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @Input() servicesStatus: ServiceState[] = [];
  @Input() selection = new SelectionModel<ServiceState>(true, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() filterValue: string;
  @Input() tableId: string;
  @Input() disableRouting = true;
  @Input() loading: boolean;
  @Output() selectionChange: EventEmitter<() => void> = new EventEmitter<() => void>();

  dataSource: MatTableDataSource<ServiceState>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<ServiceState>;
  displayedColumns: string[] = [
    'select',
    'task.id',
    'service.name',
    'status',
    'blocked',
    'task.startTime',
    'task.endTime',
  ];
  unfilteredColumns = this.displayedColumns;
  private sort: MatSort;

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private tableConfigService: TableConfigService,
    private destroyRef: DestroyRef,
  ) {}

  @Input() set displayColumns(columns: string[]) {
    this.unfilteredColumns = columns;
    if (localStorage.getItem('showIds') !== 'true') {
      columns = columns.filter((column) => column !== 'task.id');
    }
    this.displayedColumns = columns;
  }

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static getSortDataForColumn(data: ServiceState, column: string): string {
    switch (column) {
      case 'task.id':
        return data.task ? data.task.id.toString() : (data[column] as string);
      case 'service.name':
        return data.service.name;
      case 'status':
        return data.status;
      case 'blocked':
        if (data.blockedOnFacility) {
          return 'BLOCKED';
        }
        if (data.blockedGlobally) {
          return 'BLOCKED GLOBALLY';
        }
        return 'ALLOWED';
      case 'task.startTime':
        return data.task?.startTime
          ? formatDate(data.task.startTime, 'yyyy.MM.dd HH:mm:ss', 'en')
          : (data[column] as string);
      case 'task.endTime':
        return data.task?.endTime
          ? formatDate(data.task.endTime, 'yyyy.MM.dd HH:mm:ss', 'en')
          : (data[column] as string);
      default:
        return data[column] as string;
    }
  }

  static getDataForColumn(data: ServiceState, column: string): string {
    switch (column) {
      case 'task.id':
        return data.task ? data.task.id.toString() : (data[column] as string);
      case 'service.name':
        return data.service.name;
      case 'status':
        return data.status;
      case 'blocked':
        if (data.blockedOnFacility) {
          return 'BLOCKED';
        }
        if (data.blockedGlobally) {
          return 'BLOCKED GLOBALLY';
        }
        return 'ALLOWED';
      case 'task.startTime':
        return data.task?.startTime
          ? formatDate(data.task.startTime, 'd.M.y H:mm:ss', 'en')
          : (data[column] as string);
      case 'task.endTime':
        return data.task?.endTime
          ? formatDate(data.task.endTime, 'd.M.y H:mm:ss', 'en')
          : (data[column] as string);
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<ServiceState>(
        this.selection.isMultipleSelection(),
        [],
        true,
        this.selection.compareWith,
      );
      this.cachedSubject?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        if (value) {
          this.cachedSelection.clear();
        }
      });
    }

    this.watchForIdColumnChanges();
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<ServiceState>(this.servicesStatus);
    this.setDataSource();
    this.dataSource.filterPredicate = (data, filter): boolean => {
      const transformedFilter = filter.trim().toLowerCase();

      const listAsFlatString = (obj: ServiceState | Facility | Service): string => {
        let returnVal = '';

        Object.values(obj).forEach((val: string | number | Facility | Service) => {
          if (typeof val !== 'object') {
            returnVal = returnVal + ' ' + String(val);
          } else if (val !== null) {
            returnVal = returnVal + ' ' + listAsFlatString(val);
          }
        });

        return returnVal.trim().toLowerCase();
      };

      return listAsFlatString(data).includes(transformedFilter);
    };
    this.dataSource.filter = this.filterValue;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        ServicesStatusListComponent.getDataForColumn,
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
        ServicesStatusListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: ServiceState, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          ServicesStatusListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: ServiceState[], sort: MatSort): ServiceState[] =>
        customDataSourceSort(data, sort, ServicesStatusListComponent.getSortDataForColumn);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.tableCheckbox.masterToggle(
      this.isAllSelected(),
      this.selection,
      this.cachedSelection,
      this.filterValue,
      this.dataSource,
      this.sort,
      this.child.paginator.pageSize,
      this.child.paginator.pageIndex,
      false,
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }

  toggleRow(row: ServiceState): void {
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

  private watchForIdColumnChanges(): void {
    this.tableConfigService.showIdsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((showIds) => {
        if (showIds) {
          this.displayedColumns = this.unfilteredColumns;
        } else {
          this.displayedColumns = this.unfilteredColumns.filter((column) => column !== 'task.id');
        }
      });
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'task.id');
    }
  }
}
