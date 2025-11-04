import { MatTooltip } from '@angular/material/tooltip';
import {
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
} from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { GuiAuthResolver, NotificatorService, TableCheckbox } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ResourcesManagerService, ResourceTag } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableConfigService } from '@perun-web-apps/config/table-config';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    UiAlertsModule,
    IsAllSelectedPipe,
    TableWrapperComponent,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatTooltip,
    CheckboxLabelPipe,
    MasterCheckboxLabelPipe,
  ],
  standalone: true,
  selector: 'app-resources-tags-list',
  templateUrl: './resources-tags-list.component.html',
  styleUrls: ['./resources-tags-list.component.scss'],
})
export class ResourcesTagsListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  resourceTags: ResourceTag[] = [];
  @Input()
  filterValue: string;
  @Input()
  selection = new SelectionModel<ResourceTag>(true, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input()
  tableId: string;
  @Input()
  entity: string;
  @Input()
  loading: boolean;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;

  dataSource: MatTableDataSource<ResourceTag>;
  isChanging = new SelectionModel<ResourceTag>(true, []);
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<ResourceTag>;
  displayedColumns = ['select', 'id', 'name', 'edit'];
  unfilteredColumns = this.displayedColumns;
  private sort: MatSort;

  constructor(
    private resourceManager: ResourcesManagerService,
    private notificator: NotificatorService,
    private translator: TranslateService,
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

  static getDataForColumn(data: ResourceTag, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'name':
        return data.tagName;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<ResourceTag>(
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
    this.dataSource = new MatTableDataSource<ResourceTag>(this.resourceTags);
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
        ResourcesTagsListComponent.getDataForColumn,
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
        ResourcesTagsListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: ResourceTag, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          ResourcesTagsListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: ResourceTag[], sort: MatSort): ResourceTag[] =>
        customDataSourceSort(data, sort, ResourcesTagsListComponent.getDataForColumn);
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

  toggleRow(row: ResourceTag): void {
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

  save(tag: ResourceTag): void {
    this.resourceManager.updateResourceTag({ resourceTag: tag }).subscribe(() => {
      this.translator
        .get('SHARED.COMPONENTS.RESOURCES_TAGS_LIST.EDIT_SUCCESS')
        .subscribe((text: string) => {
          this.notificator.showSuccess(text);
        });
      this.isChanging.deselect(tag);
    });
  }

  edit(row?: ResourceTag): void {
    this.isChanging.select(row);
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
      this.displayedColumns.filter((column) => column !== 'id');
    }
  }
}
