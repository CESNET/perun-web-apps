import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  CheckboxLabelPipe,
  IsAllSelectedPipe,
  MasterCheckboxLabelPipe,
} from '@perun-web-apps/perun/pipes';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AttributeDefinition, RichDestination } from '@perun-web-apps/perun/openapi';
import { EditAttributeDefinitionDialogComponent } from '../dialogs/edit-attribute-definition-dialog/edit-attribute-definition-dialog.component';
import {
  customDataSourceFilterPredicate,
  customDataSourceSort,
  downloadData,
  getDataForExport,
  getDefaultDialogConfig,
  TABLE_ITEMS_COUNT_OPTIONS,
} from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';
import { GuiAuthResolver, TableCheckbox } from '@perun-web-apps/perun/services';
import { ConsentRelatedAttributePipe } from '../../pipes/consent-related-attribute.pipe';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MultiWordDataCyPipe } from '@perun-web-apps/perun/pipes';
import { NameSpaceToDefPipe } from '../../pipes/name-space-to-def.pipe';
import { AttributeTypeCleanPipe } from '../../pipes/attribute-type-clean.pipe';
import { TableConfigService } from '@perun-web-apps/config/table-config';

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
    CheckboxLabelPipe,
    ConsentRelatedAttributePipe,
    MultiWordDataCyPipe,
    NameSpaceToDefPipe,
    MasterCheckboxLabelPipe,
    AttributeTypeCleanPipe,
  ],
  providers: [ConsentRelatedAttributePipe],
  standalone: true,
  selector: 'app-attr-def-list',
  templateUrl: './attr-def-list.component.html',
  styleUrls: ['./attr-def-list.component.scss'],
})
export class AttrDefListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  definitions: AttributeDefinition[];
  @Input()
  selection = new SelectionModel<AttributeDefinition>(true, []);
  @Input()
  cachedSubject: BehaviorSubject<boolean>;
  @Input()
  filterValue: string;
  @Input()
  tableId: string;
  @Input()
  disableRouting = false;
  @Input() consentRequired = false;
  @Input() serviceEnabled = false;
  @Input() loading: boolean;

  @Output()
  refreshEvent = new EventEmitter<void>();
  @ViewChild(TableWrapperComponent, { static: true }) child: TableWrapperComponent;
  dataSource: MatTableDataSource<AttributeDefinition>;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  // contains all selected rows across all pages
  cachedSelection: SelectionModel<AttributeDefinition>;
  isMasterCheckboxEnabled: boolean = true;
  displayedColumns: string[] = [
    'select',
    'id',
    'friendlyName',
    'displayName',
    'entity',
    'namespace',
    'type',
    'unique',
  ];
  unfilteredColumns = this.displayedColumns;
  private sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private authResolver: GuiAuthResolver,
    private tableCheckbox: TableCheckbox,
    private consentRelatedPipe: ConsentRelatedAttributePipe,
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

  static getDataForColumn(data: AttributeDefinition, column: string): string {
    switch (column) {
      case 'id':
        return data.id.toString();
      case 'friendlyName':
        return data.friendlyName;
      case 'displayName':
        return data.displayName;
      case 'entity':
        return data.entity;
      case 'namespace':
        if (data.namespace) {
          const stringValue = data.namespace;
          return stringValue.substring(stringValue.lastIndexOf(':') + 1, stringValue.length);
        }
        return '';
      case 'type':
        if (data.type) {
          const stringValue = data.type;
          return stringValue.substring(stringValue.lastIndexOf('.') + 1, stringValue.length);
        }
        return '';
      case 'unique':
        return data.unique ? 'true' : 'false';
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.selection) {
      this.cachedSelection = new SelectionModel<AttributeDefinition>(
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

  canBeSelected = (row: AttributeDefinition): boolean =>
    !this.consentRelatedPipe.transform(row.namespace, this.serviceEnabled, this.consentRequired);

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<AttributeDefinition>(this.definitions);
    this.setDataSource();

    this.isMasterCheckboxEnabled = this.tableCheckbox.anySelectableRows(
      this.dataSource,
      this.canBeSelected,
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
        AttrDefListComponent.getDataForColumn,
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
        AttrDefListComponent.getDataForColumn,
      ),
      format,
    );
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.filter = this.filterValue;

      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: AttributeDefinition, filter: string): boolean =>
        customDataSourceFilterPredicate(
          data,
          filter,
          this.displayedColumns,
          AttrDefListComponent.getDataForColumn,
        );
      this.dataSource.sortData = (
        data: AttributeDefinition[],
        sort: MatSort,
      ): AttributeDefinition[] =>
        customDataSourceSort(data, sort, AttrDefListComponent.getDataForColumn);
      this.dataSource.paginator = this.child.paginator;
    }
  }

  isAllSelected(): boolean {
    return this.tableCheckbox.isAllSelected(
      this.selection.selected.length,
      this.dataSource,
      this.canBeSelected,
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
      this.canBeSelected,
    );
  }

  onRowClick(attDef: AttributeDefinition): void {
    if (!this.disableRouting) {
      const config = getDefaultDialogConfig();
      config.width = '700px';
      config.data = {
        attDef: { ...attDef },
      };

      const dialogRef = this.dialog.open(EditAttributeDefinitionDialogComponent, config);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.selection.clear();
          this.refreshEvent.emit();
        }
      });
    }
  }

  toggleRow(row: RichDestination): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
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
