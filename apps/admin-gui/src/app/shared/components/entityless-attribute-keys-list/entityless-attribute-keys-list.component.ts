import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificatorService, TableCheckbox } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Attribute,
  AttributeDefinition,
  AttributesManagerService,
} from '@perun-web-apps/perun/openapi';
import { AttributeValueComponent } from '@perun-web-apps/perun/components';
import { TABLE_ITEMS_COUNT_OPTIONS } from '@perun-web-apps/perun/utils';
import { TableWrapperComponent } from '@perun-web-apps/perun/table-utils';

export interface EntitylessAttributeKeysListData {
  attDef: AttributeDefinition;
}

export interface ListData {
  key: string;
  value: Attribute;
}

@Component({
  selector: 'app-entityless-attribute-keys-list',
  templateUrl: './entityless-attribute-keys-list.component.html',
  styleUrls: ['./entityless-attribute-keys-list.component.scss'],
})
export class EntitylessAttributeKeysListComponent implements OnInit, AfterViewInit {
  @Input()
  attDef: AttributeDefinition;
  @Input()
  tableId: string;
  @Output()
  switchView: EventEmitter<void> = new EventEmitter<void>();
  @ViewChildren(AttributeValueComponent)
  items: QueryList<AttributeValueComponent>;
  @ViewChild(TableWrapperComponent) child: TableWrapperComponent;

  @ViewChild(MatSort) sort: MatSort;
  records: ListData[] = [];
  displayedColumns: string[] = ['select', 'key', 'value'];
  dataSource: MatTableDataSource<ListData> = new MatTableDataSource<ListData>();
  selection = new SelectionModel<ListData>(true, [], true, (l1, l2) => l1.key === l2.key);
  cachedSelection = new SelectionModel<ListData>(
    this.selection.isMultipleSelection(),
    [],
    true,
    this.selection.compareWith,
  );
  isAddButtonDisabled = false;
  pageSizeOptions = TABLE_ITEMS_COUNT_OPTIONS;
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<EntitylessAttributeKeysListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntitylessAttributeKeysListData,
    private notificator: NotificatorService,
    private translate: TranslateService,
    private attributesManager: AttributesManagerService,
    private cd: ChangeDetectorRef,
    private tableCheckbox: TableCheckbox,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.attDef = this.data.attDef;
    this.refreshTable();
  }

  refreshTable(): void {
    this.loading = true;
    this.attributesManager
      .getEntitylessAttributesWithKeys(`${this.attDef.namespace}:${this.attDef.friendlyName}`)
      .subscribe((map) => {
        this.records = [];
        const keys = Object.keys(map);
        for (const key of keys) {
          this.records.push({ key: key, value: map[key] });
        }
        this.dataSource = new MatTableDataSource<ListData>(this.records);
        this.setDataSource();
        this.loading = false;
      });
  }

  setDataSource(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      if (this.child) {
        this.dataSource.paginator = this.child.paginator;
      }
    }
  }

  onSave(): void {
    this.updateMapAttributes();
    let i = 0;
    const length = this.selection.selected.length;
    for (const rec of this.selection.selected) {
      this.loading = true;
      this.attributesManager
        .setEntitylessAttribute({ key: rec.key, attribute: rec.value })
        .subscribe({
          next: () => {
            i += 1;
            if (i === length) {
              this.translate
                .get('SHARED.COMPONENTS.ENTITYLESS_ATTRIBUTES_LIST.SAVE_SUCCESS')
                .subscribe((message: string) => {
                  this.notificator.showSuccess(message);
                  this.refreshTable();
                });
            }
          },
          error: () => {
            this.refreshTable();
          },
        });
    }
    this.selection.clear();
    this.cachedSelection.clear();
    this.isAddButtonDisabled = false;
    this.cd.detectChanges();
  }

  onRemove(): void {
    this.loading = true;
    let i = 0;
    const length = this.selection.selected.length;
    for (const rec of this.selection.selected) {
      this.attributesManager.removeEntitylessAttribute(rec.key, rec.value.id).subscribe(() => {
        i += 1;
        if (i === length) {
          this.translate
            .get('SHARED.COMPONENTS.ENTITYLESS_ATTRIBUTES_LIST.REMOVE_SUCCESS')
            .subscribe((message: string) => {
              this.notificator.showSuccess(message);
              this.refreshTable();
            });
        }
      });
    }
    this.selection.clear();
    this.cachedSelection.clear();
    this.isAddButtonDisabled = false;
    this.cd.detectChanges();
  }

  onAdd(): void {
    const rec = { key: '', value: this.attDef as Attribute } as ListData;
    rec.value.value = undefined;
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

  onValueChange(record: ListData): void {
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
    this.setDataSource();
  }

  toggleRow(row: ListData): void {
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
