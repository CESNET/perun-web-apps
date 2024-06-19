import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DynamicDataSource, isDynamicDataSource } from '@perun-web-apps/perun/models';

@Injectable({
  providedIn: 'root',
})
export class TableCheckboxModified {
  private numSelected: number;
  private numCanBeSelected: number;
  private modulo: number;
  private pageStart: number;
  private pageEnd: number;
  private pageIterator: number;
  private dataLength: number;

  // checks if all rendered rows are selected (in this function also disabled checkboxes are allowed)
  isAllSelected<T>(
    rowsSelected: number,
    dataSource: MatTableDataSource<T>,
    canBeSelected: (item: T) => boolean = (): boolean => true,
  ): boolean {
    const pg = dataSource.paginator;
    const pageSize = pg.pageSize ?? 0;
    const pageIndex = pg.pageIndex ?? 0;
    const nextPage = (pg.pageIndex + 1) * pg.pageSize < pg.length;
    const hasFilter = dataSource.data.length === dataSource.filteredData.length;

    this.numCanBeSelected = 0;
    this.pageStart = pageIndex * pageSize;
    this.pageEnd = this.pageStart + pageSize;
    this.numSelected = rowsSelected;
    this.dataLength = hasFilter ? dataSource.data.length : dataSource.filteredData.length;
    const sort = dataSource.sort;

    if (!nextPage) {
      this.modulo = this.dataLength % pageSize;
      this.pageEnd = this.modulo === 0 ? this.pageStart + pageSize : this.pageStart + this.modulo;
    }
    this.pageIterator = 0;

    const data = sort
      ? dataSource.sortData(dataSource.filteredData, sort)
      : dataSource.filteredData;
    data.forEach((row: T) => {
      if (
        this.pageStart <= this.pageIterator &&
        this.pageIterator < this.pageEnd &&
        canBeSelected(row)
      ) {
        this.numCanBeSelected++;
      }
      this.pageIterator++;
    });
    return this.numSelected === this.numCanBeSelected;
  }

  // checks all rendered checkboxes if they are able to check
  masterToggle<T>(
    isAllSelected: boolean,
    selection: SelectionModel<T>,
    cachedSelection: SelectionModel<T>,
    filter: string,
    dataSource: MatTableDataSource<T>,
    sort: MatSort,
    pageSize: number,
    pageIndex: number,
    someCheckboxDisabled: boolean,
    canBeSelected?: (T) => boolean,
  ): void {
    this.deselectAllOnPage(dataSource, selection, cachedSelection);

    if (!isAllSelected) {
      this.pageStart = pageIndex * pageSize;
      this.pageEnd = this.pageStart + pageSize;
      this.pageIterator = 0;

      const data = sort
        ? dataSource.sortData(dataSource.filteredData, sort)
        : dataSource.filteredData;
      data.forEach((row) => {
        if (someCheckboxDisabled) {
          if (
            canBeSelected(row) &&
            this.pageStart <= this.pageIterator &&
            this.pageIterator < this.pageEnd
          ) {
            cachedSelection.select(row);
            selection.select(row);
          }
        } else {
          if (this.pageStart <= this.pageIterator && this.pageIterator < this.pageEnd) {
            cachedSelection.select(row);
            selection.select(row);
          }
        }

        this.pageIterator++;
      });
    }
  }

  /**
   * Determines if all rendered rows are selected.
   *
   * @param dataSource Dynamic data source
   * @param selectedCount number of selected rows
   * @param canBeSelected By default all rows can be selected
   */
  isAllSelectedPaginated<T>(
    dataSource: DynamicDataSource<T>,
    selectedCount: number,
    canBeSelected: (T) => boolean = (): boolean => true,
  ): boolean {
    return (
      selectedCount ===
      dataSource.data.reduce((acc: number, val: T) => acc + Number(canBeSelected(val)), 0)
    );
  }

  /**
   * Handles the (de)select all actions
   *
   * @param dataSource Dynamic data source
   * @param selection Selection model
   * @param selectAll Flag, all rows to be selected
   * @param canBeSelected By default all rows can be selected
   * @param cachedSelection
   */
  masterTogglePaginated<T>(
    dataSource: DynamicDataSource<T>,
    selection: SelectionModel<T>,
    cachedSelection: SelectionModel<T>,
    selectAll: boolean,
    canBeSelected: (T) => boolean = (): boolean => true,
  ): void {
    this.deselectAllOnPage(dataSource, selection, cachedSelection);

    if (selectAll) {
      dataSource.data.forEach((row) => {
        if (canBeSelected(row)) {
          selection.select(row);
          cachedSelection.select(row);
        }
      });
    }
  }

  deselectAllOnPage<T>(
    dataSource: MatTableDataSource<T> | DynamicDataSource<T>,
    selection: SelectionModel<T>,
    cachedSelection: SelectionModel<T>,
  ): void {
    this.getDataOnCurrentPage(dataSource).forEach((data) => cachedSelection.deselect(data));
    selection.clear();
  }

  selectCachedDataOnPage<T>(
    dataSource: MatTableDataSource<T> | DynamicDataSource<T>,
    selection: SelectionModel<T>,
    cachedSelection: SelectionModel<T>,
    compareWith: (o1, o2) => boolean = (o1, o2): boolean => o1 === o2,
  ): void {
    selection.clear();
    const dataOnCurrentPage = this.getDataOnCurrentPage(dataSource);
    selection.select(
      ...cachedSelection.selected.filter((selectedDataInCache) =>
        dataOnCurrentPage.some((dataItem) => {
          if (compareWith(selectedDataInCache, dataItem)) {
            return true;
          }
        }),
      ),
    );
  }

  anySelectableRows<T>(
    dataSource: MatTableDataSource<T> | DynamicDataSource<T>,
    canBeSelected: (row: T) => boolean,
  ): boolean {
    const rows = this.getDataOnCurrentPage(dataSource);
    for (const row of rows) {
      if (canBeSelected(row)) {
        return true;
      }
    }
    return false;
  }

  private getDataOnCurrentPage<T>(dataSource: MatTableDataSource<T> | DynamicDataSource<T>): T[] {
    if (isDynamicDataSource(dataSource)) {
      // Might return old data if called too early after loading new page of server-paginated table
      return dataSource.filteredData;
    }
    const start = dataSource.paginator.pageIndex * dataSource.paginator.pageSize;
    const end = start + dataSource.paginator.pageSize;

    const allData = dataSource.sort
      ? dataSource.sortData(dataSource.filteredData, dataSource.sort)
      : dataSource.filteredData;
    return allData.slice(start, end).map((data) => data);
  }
}
