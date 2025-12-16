import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MiddleClickRouterLinkDirective } from '@perun-web-apps/perun/directives';
import {
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
} from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Service } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    CheckboxLabelPipe,
    MasterCheckboxLabelPipe,
  ],
  standalone: true,
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @Input()
  services: Service[] = [];
  @Input()
  filterValue = '';
  @Input()
  selection = new SelectionModel<Service>(true, []);
  @Input()
  cachedSubject: BehaviorSubject<boolean>;
  @Input()
  disableRouting = false;
  @Input()
  loading: boolean;
  @Output()
  selectionChanged: EventEmitter<void> = new EventEmitter<void>();
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<Service>;
  dataSource: MatTableDataSource<Service>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  displayedColumns: string[] = ['select', 'id', 'name', 'enabled', 'script', 'description'];
  unfilteredColumns = this.displayedColumns;
  tableId = 'app-services-list';

  private sort: MatSort;

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
    private tableConfigService: TableConfigService,
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

  static getDataForColumn(data: Service, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'name':
        return data.name;
      case 'enabled':
        return data.enabled ? 'true' : 'false';
      case 'script':
        return data.script;
      case 'description':
        return data.description;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<Service>(
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
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.dataSource = new MatTableDataSource<Service>(this.services);
    this.setDataSource();
    this.selection.changed.subscribe(() => {
      this.selectionChanged.emit();
    });
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        ServicesListComponent.getDataForColumn,
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
        ServicesListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: Service, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          ServicesListComponent.getDataForColumn as (data: Service, column: string) => string,
        );
      this.dataSource.sortData = (data: Service[], sort: MatSort): Service[] =>
        customDataSourceSort(
          data,
          sort,
          ServicesListComponent.getDataForColumn as (data: Service, column: string) => string,
        );
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
  }

  toggleRow(item: Service): void {
    this.selection.toggle(item);
    this.cachedSelection.toggle(item);
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
          this.displayedColumns = this.unfilteredColumns.filter((column) => column !== 'id');
        }
      });
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
  }
}
