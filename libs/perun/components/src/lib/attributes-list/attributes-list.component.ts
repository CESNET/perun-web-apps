import { MatTooltip } from '@angular/material/tooltip';
import {
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  IsVirtualAttributePipe,
  MasterCheckboxLabelPipe,
} from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AttributeValueComponent } from './attribute-value/attribute-value.component';
import { Attribute } from '@perun-web-apps/perun/openapi';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  filterCoreAttributes,
  getDataForExport,
  isVirtualAttribute,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { MultiWordDataCyPipe } from '@perun-web-apps/perun/pipes';

@Component({
  imports: [
    CommonModule,
    MatCheckboxModule,
    UiAlertsModule,
    IsAllSelectedPipe,
    TableWrapperComponent,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    MatTooltip,
    MasterCheckboxLabelPipe,
    IsVirtualAttributePipe,
    CheckboxLabelPipe,
    MultiWordDataCyPipe,
    AttributeValueComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-attributes-list',
  templateUrl: './attributes-list.component.html',
  styleUrls: ['./attributes-list.component.scss'],
})
export class AttributesListComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChildren(AttributeValueComponent) items: QueryList<AttributeValueComponent>;
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  @Input() attributes: Attribute[] = [];
  @Input() selection = new SelectionModel<Attribute>(true, []);
  @Input() cachedSubject: BehaviorSubject<boolean>;
  @Input() displayedColumns: string[] = ['select', 'id', 'displayName', 'value', 'description'];
  @Input() filterValue = '';
  @Input() filterEmpty = false;
  @Input() filterFalse = false;
  @Input() tableId: string;
  @Input() readonly = false;
  @Input() hiddenColumns: string[] = [];
  @Input() emptyListText = 'SHARED_LIB.PERUN.COMPONENTS.ATTRIBUTES_LIST.EMPTY_SETTINGS';
  @Input() loading: boolean;

  // contains all selected rows across all pages
  cachedSelection: SelectionModel<Attribute>;
  isMasterCheckboxEnabled: boolean = true;
  dataSource: MatTableDataSource<Attribute>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  private sort: MatSort;

  constructor(
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private destroyRef: DestroyRef,
    private translate: TranslateService,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  static canBeSelected(attribute: Attribute): boolean {
    return !isVirtualAttribute(attribute) && attribute.writable;
  }

  static getDataForColumn(data: Attribute, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'displayName':
        return data.displayName;
      case 'description':
        return data.description;
      case 'value':
        return JSON.stringify(data.value);
      case 'urn':
        return data.namespace + ':' + data.baseFriendlyName;
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<Attribute>(
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

  canBeSelected(attribute: Attribute): boolean {
    return !isVirtualAttribute(attribute) && attribute.writable;
  }

  ngOnChanges(): void {
    if (localStorage.getItem('showIds') !== 'true') {
      this.displayedColumns = this.displayedColumns.filter((column) => column !== 'id');
    }

    let filteredAttributes = this.attributes;
    if (this.filterEmpty) {
      filteredAttributes = filteredAttributes.filter((attribute) => {
        if (typeof attribute.value === 'object') {
          return Object.keys((attribute.value ?? '') as object).length > 0;
        }
        return true;
      });
      if (this.filterFalse) {
        filteredAttributes = filteredAttributes.filter(
          (attribute) => attribute.type !== 'java.lang.Boolean' || attribute.value !== false,
        );
      }
    }

    filteredAttributes = filterCoreAttributes(filteredAttributes);
    this.dataSource = new MatTableDataSource<Attribute>(filteredAttributes);
    this.setDataSource();

    this.isMasterCheckboxEnabled = this.tableCheckbox.anySelectableRows(
      this.dataSource,
      AttributesListComponent.canBeSelected,
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.child.paginator;
  }

  exportAllData(format: string): void {
    downloadData(
      getDataForExport(
        this.dataSource.filteredData,
        this.displayedColumns,
        AttributesListComponent.getDataForColumn,
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
        AttributesListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    this.displayedColumns = this.displayedColumns.filter((x) => !this.hiddenColumns.includes(x));
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: Attribute, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns.concat('urn'),
          AttributesListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (data: Attribute[], sort: MatSort): Attribute[] =>
        customDataSourceSort(data, sort, AttributesListComponent.getDataForColumn);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
      this.dataSource.filter = this.filterValue;
    }
  }

  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(
      this.selection.selected.length,
      this.dataSource,
      AttributesListComponent.canBeSelected,
    );
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
      true,
      AttributesListComponent.canBeSelected,
    );
  }

  toggleRow(row: Attribute): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    if (this.cachedSelection) {
      this.isMasterCheckboxEnabled = this.tableCheckbox.anySelectableRows(
        this.dataSource,
        AttributesListComponent.canBeSelected,
      );
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }

  updateMapAttributes(): void {
    for (const item of this.items.toArray()) {
      if (item.attribute.type === 'java.util.LinkedHashMap') {
        item.updateMapAttribute();
      }
    }
  }

  onValueChange(attribute: Attribute): void {
    if (AttributesListComponent.canBeSelected(attribute)) {
      this.selection.select(attribute);
      this.cachedSelection.select(attribute);
    }
  }

  getAttributeFullName(attribute: Attribute): string {
    return `${attribute.namespace}:${attribute.friendlyName}`;
  }
}
