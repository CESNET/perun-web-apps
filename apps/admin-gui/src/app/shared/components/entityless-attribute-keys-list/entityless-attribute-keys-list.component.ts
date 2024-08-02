import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService, TableCheckboxModified } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Attribute,
  AttributeDefinition,
  AttributesManagerService,
} from '@perun-web-apps/perun/openapi';
import { AttributeValueComponent } from '@perun-web-apps/perun/components';
import { TABLE_ITEMS_COUNT_OPTIONS, TableWrapperComponent } from '@perun-web-apps/perun/utils';

export interface EntitylessAttributeKeysListData {
  attDef: AttributeDefinition;
}

@Component({
  selector: 'app-entityless-attribute-keys-list',
  templateUrl: './entityless-attribute-keys-list.component.html',
  styleUrls: ['./entityless-attribute-keys-list.component.scss'],
})
export class EntitylessAttributeKeysListComponent implements OnChanges, OnInit, AfterViewInit {
  @Input()
  attDef: AttributeDefinition;
  @Input()
  tableId: string;
  @Output()
  switchView: EventEmitter<void> = new EventEmitter<void>();
  @ViewChildren(AttributeValueComponent)
  items: QueryList<AttributeValueComponent>;
  @ViewChildren(TableWrapperComponent) children: QueryList<TableWrapperComponent>;
  child: TableWrapperComponent;

  records: [string, Attribute][] = [];
  displayedColumns: string[] = ['select', 'key', 'value'];
  dataSource: MatTableDataSource<[string, Attribute]> = new MatTableDataSource<
    [string, Attribute]
  >();
  selection = new SelectionModel<[string, Attribute]>(
    true,
    [],
    true,
    ([s1, attr1], [s2, attr2]) => s1 === s2 && attr1.id === attr2.id,
  );
  cachedSelection = new SelectionModel<[string, Attribute]>(
    this.selection.isMultipleSelection(),
    [],
    true,
    this.selection.compareWith,
  );
  isAddButtonDisabled = false;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  loading: boolean;
  private sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<EntitylessAttributeKeysListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntitylessAttributeKeysListData,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private attributesManager: AttributesManagerService,
    private cd: ChangeDetectorRef,
    private tableCheckbox: TableCheckboxModified,
  ) {}

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSource();
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.loading = true;
    this.attDef = this.data.attDef;
    this.attributesManager.getEntitylessKeys(this.attDef.id).subscribe((keys) => {
      this.attributesManager
        .getEntitylessAttributesByName(`${this.attDef.namespace}:${this.attDef.friendlyName}`)
        .subscribe((att) => {
          let i = 0;
          this.records = [];
          for (const key of keys) {
            this.records.push([key, att[i]]);
            i++;
          }
          this.dataSource = new MatTableDataSource<[string, Attribute]>(this.records);
          this.setDataSource();
          this.loading = false;
        });
    });
  }

  setDataSource(): void {
    if (!this.child?.paginator) {
      return;
    }
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.child.paginator;
    }
  }

  onSave(): void {
    this.updateMapAttributes();
    for (const rec of this.selection.selected) {
      this.attributesManager
        .setEntitylessAttribute({ key: rec[0], attribute: rec[1] })
        .subscribe(() => {
          this.translate
            .get('SHARED.COMPONENTS.ENTITYLESS_ATTRIBUTES_LIST.SAVE_SUCCESS')
            .subscribe((message: string) => {
              this.notificator.showSuccess(message);
              this.ngOnInit();
            });
        });
    }
    this.selection.clear();
    this.cachedSelection.clear();
    this.isAddButtonDisabled = false;
    this.cd.detectChanges();
  }

  onRemove(): void {
    for (const rec of this.selection.selected) {
      this.attributesManager.removeEntitylessAttribute(rec[0], rec[1].id).subscribe(() => {
        this.translate
          .get('SHARED.COMPONENTS.ENTITYLESS_ATTRIBUTES_LIST.REMOVE_SUCCESS')
          .subscribe((message: string) => {
            this.notificator.showSuccess(message);
            this.ngOnInit();
          });
      });
    }
    this.ngOnInit();
    this.selection.clear();
    this.cachedSelection.clear();
    this.isAddButtonDisabled = false;
    this.cd.detectChanges();
  }

  onAdd(): void {
    const rec = ['', this.attDef as Attribute] as [string, Attribute];
    rec[1].value = undefined;
    this.records.unshift(rec);
    this.dataSource.data = this.records;
    this.setDataSource();
    this.selection.clear();
    this.cachedSelection.clear();
    this.selection.select(rec);
    this.cachedSelection.select(rec);
    this.isAddButtonDisabled = true;
    this.cd.detectChanges();
  }

  onCancel(): void {
    this.dialogRef.close(false);
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
      '',
      this.dataSource,
      this.sort,
      this.child.paginator.pageSize,
      this.child.paginator.pageIndex,
      false,
    );
  }

  onValueChange(record: [string, Attribute]): void {
    this.selection.select(record);
    this.cachedSelection.select(record);
  }

  updateMapAttributes(): void {
    for (const item of this.items.toArray()) {
      if (item.attribute.type === 'java.util.LinkedHashMap') {
        item.updateMapAttribute();
      }
    }
  }

  ngAfterViewInit(): void {
    this.children.changes.subscribe((children: QueryList<TableWrapperComponent>) => {
      this.child = children.first;
      this.dataSource.paginator = this.child.paginator;
    });
    this.setDataSource();
  }

  toggleRow(row: [string, Attribute]): void {
    this.selection.toggle(row);
    this.cachedSelection.toggle(row);
  }

  pageChanged(): void {
    if (this.dataSource.paginator) {
      this.tableCheckbox.selectCachedDataOnPage(
        this.dataSource,
        this.selection,
        this.cachedSelection,
        this.selection.compareWith,
      );
    }
  }
}
