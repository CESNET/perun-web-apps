import { TranslateModule } from '@ngx-translate/core';
import { CustomTranslatePipe, IsAllSelectedPipe } from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
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
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableCheckbox } from '@perun-web-apps/perun/services';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Consent } from '@perun-web-apps/perun/openapi';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { ConsentStatusComponent } from '../consent-status/consent-status.component';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    UiAlertsModule,
    CustomTranslatePipe,
    IsAllSelectedPipe,
    TableWrapperComponent,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    ConsentStatusComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-consents-list',
  templateUrl: './consents-list.component.html',
  styleUrls: ['./consents-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConsentsListComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @Input() filterValue = '';
  @Input() consents: Consent[] = [];
  @Input() selection = new SelectionModel<Consent>(true, []);
  @Input() cacheSubject: BehaviorSubject<boolean>;
  @Input() displayedColumns: string[] = ['select', 'status', 'name'];
  @Input() loading: boolean;
  @Output() grantConsent: EventEmitter<number> = new EventEmitter<number>();
  @Output() rejectConsent: EventEmitter<number> = new EventEmitter<number>();
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<Consent>;
  expandedConsent: Consent | null;
  dataSource: MatTableDataSource<Consent>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  tableId = 'perun-web-apps-consents-list';

  private sort: MatSort;

  constructor(
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static getDataForColumn(data: Consent, column: string): string {
    switch (column) {
      case 'name':
        return data.consentHub.name;
      case 'status':
        return data.status;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<Consent>(
        this.selection.isMultipleSelection(),
        [],
        true,
        this.selection.compareWith,
      );
      this.cacheSubject?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        if (value) {
          this.cachedSelection.clear();
        }
      });
    }
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<Consent>(this.consents);
    this.setDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        ConsentsListComponent.getDataForColumn,
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
        ConsentsListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: Consent, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          ConsentsListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: Consent[], sort: MatSort): Consent[] =>
        customDataSourceSort(data, sort, ConsentsListComponent.getDataForColumn);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(this.selection.selected.length, this.dataSource);
  }

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

  toggleRow(row: Consent): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }
}
