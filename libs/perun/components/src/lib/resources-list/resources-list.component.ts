import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Group, RichResource } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { ResourceWithStatus } from '@perun-web-apps/perun/models';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';

@Component({
  selector: 'perun-web-apps-resources-list',
  templateUrl: './resources-list.component.html',
  styleUrls: ['./resources-list.component.scss'],
})
export class ResourcesListComponent implements OnInit, OnChanges {
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @Input() resources: ResourceWithStatus[] = [];
  @Input() resourceWithAuthzGroupPairs: Map<number, Group[]>;
  @Input() authzVoNames: Map<number, string>;
  @Input() selection = new SelectionModel<ResourceWithStatus>(true, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() filterValue: string;
  @Input() disableRouting = false;
  @Input() routingVo = false;
  @Input() displayedColumns: string[] = [
    'select',
    'id',
    'recent',
    'indirectResourceAssigment',
    'name',
    'vo',
    'voId',
    'status',
    'facility',
    'facilityId',
    'tags',
    'description',
  ];
  @Input() groupToResource: Group;
  @Input() pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  @Input() recentIds: number[];
  @Input() groupId: number = null;
  @Input() resourcesToDisableCheckbox: Set<number> = new Set<number>();
  @Input() tableId: string;
  @Input() loading: boolean;
  @Output() refreshTable: EventEmitter<void> = new EventEmitter<void>();
  @Output() allSelected = new EventEmitter();

  // contains all selected rows across all pages
  cachedSelection: SelectionModel<ResourceWithStatus>;
  isMasterCheckboxEnabled: boolean = true;
  dataSource: MatTableDataSource<RichResource>;
  removeAuth = false;
  addAuth = false;
  disabledRouting: boolean;
  private sort: MatSort;

  constructor(
    private guiAuthResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
  }

  static getDataForColumn(data: ResourceWithStatus, column: string, recentIds: number[]): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'vo':
        return data.vo.name;
      case 'name':
        return data.name;
      case 'facility':
        return data.facility.name;
      case 'description':
        return data.description;
      case 'recent':
        if (recentIds) {
          if (recentIds.includes(data.id)) {
            return '#'.repeat(recentIds.indexOf(data.id));
          }
        }
        return data['name'];
      case 'tags': {
        if (!data.resourceTags) {
          return data[column] as string;
        }
        const tags = data.resourceTags;
        let result = '';
        tags.forEach(function (tag) {
          result = result.concat(tag.tagName);
        });
        return result;
      }
      case 'status':
        return data.status;
      case 'uuid':
        return data.uuid;
      default:
        return data[column] as string;
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<ResourceWithStatus>(
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

  getDataForColumnFun = (data: ResourceWithStatus, column: string): string => {
    return ResourcesListComponent.getDataForColumn(data, column, this.recentIds);
  };

  ngOnChanges(): void {
    this.disabledRouting = this.disableRouting;
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }
    this.setDataSource();
    this.setAuth();

    this.isMasterCheckboxEnabled = this.tableCheckbox.anySelectableRows(
      this.dataSource,
      this.canBeSelected,
    );
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        this.getDataForColumnFun,
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
        this.getDataForColumnFun,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<RichResource>();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filterPredicate = (data: RichResource, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          this.getDataForColumnFun,
          true,
        );
      this.dataSource.sortData = (data: RichResource[], sort: MatSort): RichResource[] =>
        customDataSourceSort(data, sort, this.getDataForColumnFun);
    }
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.resources;
  }

  canBeSelected = (group: ResourceWithStatus): boolean => !this.disableSelect(group);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const isAllSelected = this.tableCheckbox.isAllSelected(
      this.selection.selected.length,
      this.dataSource,
      this.canBeSelected,
    );
    this.allSelected.emit(isAllSelected);
    return isAllSelected;
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
      true,
      this.canBeSelected,
    );
    this.setAuth();
  }

  setAuth(): void {
    const objects = this.groupToResource ? [this.groupToResource] : [];
    this.removeAuth = this.selection.selected.reduce(
      (acc, res) =>
        acc &&
        this.guiAuthResolver.isAuthorized(
          'removeGroupFromResources_Group_List<Resource>_policy',
          objects.concat([res]),
        ),
      true,
    );
    this.addAuth = this.selection.selected.reduce(
      (acc, res) =>
        acc &&
        this.guiAuthResolver.isAuthorized(
          'assignGroupToResources_Group_List<Resource>_policy',
          objects.concat([res]),
        ),
      true,
    );
  }

  itemSelectionToggle(item: ResourceWithStatus): void {
    this.selection.toggle(item);
    this.cachedSelection.toggle(item);
    this.setAuth();
  }

  disableSelect(resource: ResourceWithStatus): boolean {
    return this.resourcesToDisableCheckbox.has(resource.id);
  }

  pageChanged(): void {
    if (this.cachedSelection) {
      this.isMasterCheckboxEnabled = this.tableCheckbox.anySelectableRows(
        this.dataSource,
        this.canBeSelected,
      );
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }
}
