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
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  TABLE_ITEMS_COUNT_OPTIONS,
  TableWrapperComponent,
} from '@perun-web-apps/perun/utils';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { MatDialog } from '@angular/material/dialog';
import { UpdateRankDialogComponent } from '../../dialogs/update-rank-dialog/update-rank-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'perun-web-apps-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() categories: Category[] = [];
  @Input() selection = new SelectionModel<Category>(true, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() filterValue: string;
  @Input() tableId: string;
  @Input() displayedColumns: string[] = ['select', 'id', 'name', 'rank'];
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() loading: boolean;
  @Output() refreshTable = new EventEmitter<void>();
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<Category>;
  dataSource: MatTableDataSource<Category>;
  editAuth = false;
  private sort: MatSort;

  constructor(
    private tableCheckbox: TableCheckbox,
    private dialog: MatDialog,
    private authResolver: GuiAuthResolver,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static getDataForColumn(data: Category, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'name':
        return data.name;
      case 'rank':
        return data.rank.toString();
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<Category>(
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
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<Category>(this.categories);
    this.setDataSource();
    this.dataSource.filter = this.filterValue;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        CategoriesListComponent.getDataForColumn,
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
        CategoriesListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: Category, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          CategoriesListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: Category[], sort: MatSort): Category[] =>
        customDataSourceSort(data, sort, CategoriesListComponent.getDataForColumn);
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
    this.editAuth = this.authResolver.isCabinetAdmin();
    this.dataSource.paginator = this.child.paginator;
  }

  itemSelectionToggle(item: Category): void {
    this.selection.toggle(item);
    this.cachedSelection.toggle(item);
  }

  updateCategory(category: Category): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = category;

    const dialogRef = this.dialog.open(UpdateRankDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable.emit();
      }
    });
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
}
