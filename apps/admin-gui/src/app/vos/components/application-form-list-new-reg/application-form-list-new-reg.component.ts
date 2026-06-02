import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AlertComponent } from '@perun-web-apps/ui/alerts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableModule } from '@angular/material/table';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeleteApplicationFormItemDialogComponent } from '../../../shared/components/dialogs/delete-application-form-item-dialog/delete-application-form-item-dialog.component';
import { NotificatorService, PerunTranslateService } from '@perun-web-apps/perun/services';
import { ApplicationFormItem } from '@perun-web-apps/perun/openapi';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { Router } from '@angular/router';
import {
  AttributeValueListComponent,
  AttributeValueMapComponent,
} from '@perun-web-apps/perun/components';
import { ApplicationFormItemTypePipe } from '../../../shared/pipes/application-form-item-type.pipe';
import { MultiWordDataCyPipe } from '@perun-web-apps/perun/pipes';
import { SanitizeHtmlPipe } from '@perun-web-apps/perun/pipes';
import {
  FormSpecificationDTO,
  ItemWithDefinitionDTO,
} from '@perun-web-apps/perun/registrar-openapi';
import { EditApplicationFormItemDialogNewRegComponent } from '../../../shared/components/dialogs/edit-application-form-item-dialog-new-reg/edit-application-form-item-dialog-new-reg.component';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    MatTableModule,
    TranslateModule,
    MatTooltip,
    CdkDropList,
    AttributeValueMapComponent,
    CdkDrag,
    AttributeValueListComponent,
    ApplicationFormItemTypePipe,
    MultiWordDataCyPipe,
    SanitizeHtmlPipe,
  ],
  standalone: true,
  selector: 'app-application-form-list-new-reg',
  templateUrl: './application-form-list-new-reg.component.html',
  styleUrls: ['./application-form-list-new-reg.component.scss'],
})
export class ApplicationFormListNewRegComponent implements OnInit, OnChanges {
  @Input()
  formSpecification: FormSpecificationDTO;
  @Input()
  applicationFormItems: ItemWithDefinitionDTO[] = [];
  @Input()
  newFormItems: string[] = [];
  @Input()
  embeddedGroupsItemSaved = false;
  @Input()
  theme: string;
  @Input()
  displayedColumns: string[] = [
    'drag',
    'shortname',
    'type',
    'disabled',
    'hidden',
    'preview',
    'edit',
    'delete',
  ];
  @Input()
  refreshApplicationForm;
  @Input()
  loading: boolean;
  @Output()
  applicationFormItemsChange = new EventEmitter<ApplicationFormItem[]>();
  @Output()
  applicationFormItemsDeleted = new EventEmitter<string[]>();
  @ViewChild('table') table: MatTable<ApplicationFormItem>;

  itemsChanged: string[] = [];
  dataSource = this.applicationFormItems;

  mapForCombobox: Map<number, string> = new Map();
  dragDisabled = true;
  // labels and tooltips
  ifEmpty: string;
  ifPrefilled: string;
  alwaysDisabled: string;
  alwaysHidden: string;
  isDisabledIf: string;
  isHiddenIf: string;
  isEmpty: string;
  isPrefilled: string;
  forDelete: Set<string> = new Set();

  constructor(
    private dialog: MatDialog,
    private notificator: NotificatorService,
    private router: Router,
    private translate: PerunTranslateService,
  ) {}

  ngOnInit(): void {
    // labels for hidden and disabled icons
    this.ifEmpty = this.translate.instant(
      'VO_DETAIL.SETTINGS.APPLICATION_FORM.DISABLED_HIDDEN_ICON.IF_EMPTY',
    );
    this.ifPrefilled = this.translate.instant(
      'VO_DETAIL.SETTINGS.APPLICATION_FORM.DISABLED_HIDDEN_ICON.IF_PREFILLED',
    );

    // tooltips for hidden and disabled icons
    this.alwaysDisabled = this.translate.instant(
      'VO_DETAIL.SETTINGS.APPLICATION_FORM.DISABLED_HIDDEN_ICON.ALWAYS_DISABLED_HINT',
    );
    this.alwaysHidden = this.translate.instant(
      'VO_DETAIL.SETTINGS.APPLICATION_FORM.DISABLED_HIDDEN_ICON.ALWAYS_HIDDEN_HINT',
    );
    this.isDisabledIf = this.translate.instant(
      'VO_DETAIL.SETTINGS.APPLICATION_FORM.DISABLED_HIDDEN_ICON.DISABLED_IF_HINT',
    );
    this.isHiddenIf = this.translate.instant(
      'VO_DETAIL.SETTINGS.APPLICATION_FORM.DISABLED_HIDDEN_ICON.HIDDEN_IF_HINT',
    );
    this.isEmpty = this.translate.instant(
      'VO_DETAIL.SETTINGS.APPLICATION_FORM.DISABLED_HIDDEN_ICON.IS_EMPTY_HINT',
    );
    this.isPrefilled = this.translate.instant(
      'VO_DETAIL.SETTINGS.APPLICATION_FORM.DISABLED_HIDDEN_ICON.IS_PREFILLED_HINT',
    );
  }

  ngOnChanges(): void {
    this.dataSource = this.applicationFormItems;
    if (this.refreshApplicationForm) {
      this.itemsChanged = [];
    }
  }

  disabledHiddenDependency(
    item: ApplicationFormItem,
    dependency: string,
    dependencyItemId: string,
  ): string {
    let message = '';
    if (dependency === 'IF_EMPTY' || dependency === 'IF_PREFILLED') {
      const dep =
        dependencyItemId === null
          ? ''
          : this.applicationFormItems.find((i) => i.formItemDTO.id === dependencyItemId).formItemDTO
              .name;
      message =
        dependency === 'IF_EMPTY' ? `(${this.ifEmpty} ${dep})` : `(${this.ifPrefilled} ${dep})`;
    }
    return message;
  }

  disabledTooltip(item: ItemWithDefinitionDTO): string {
    let dep: string;
    switch (item.itemDefinition.disabled) {
      case 'ALWAYS':
        return this.alwaysDisabled;
      case 'IF_EMPTY':
        dep =
          item.formItemDTO.disabledDependencyItemId === null
            ? ''
            : this.applicationFormItems.find(
                (i) => i.formItemDTO.id === item.formItemDTO.disabledDependencyItemId,
              ).formItemDTO.name;
        return `${this.isDisabledIf} ${dep} ${this.isEmpty}`;
      case 'IF_PREFILLED':
        dep =
          item.formItemDTO.disabledDependencyItemId === null
            ? ''
            : this.applicationFormItems.find(
                (i) => i.formItemDTO.id === item.formItemDTO.disabledDependencyItemId,
              ).formItemDTO.name;
        return `${this.isDisabledIf} ${dep} ${this.isPrefilled}`;
    }
  }

  hiddenTooltip(item: ItemWithDefinitionDTO): string {
    let dep: string;
    switch (item.itemDefinition.hidden) {
      case 'ALWAYS':
        return this.alwaysHidden;
      case 'IF_EMPTY':
        dep =
          item.formItemDTO.hiddenDependencyItemId === null
            ? ''
            : this.applicationFormItems.find(
                (i) => i.formItemDTO.id === item.formItemDTO.hiddenDependencyItemId,
              ).formItemDTO.name;
        return `${this.isHiddenIf} ${dep} ${this.isEmpty}`;
      case 'IF_PREFILLED':
        dep =
          item.formItemDTO.hiddenDependencyItemId === null
            ? ''
            : this.applicationFormItems.find(
                (i) => i.formItemDTO.id === item.formItemDTO.hiddenDependencyItemId,
              ).formItemDTO.name;
        return `${this.isHiddenIf} ${dep} ${this.isPrefilled}`;
    }
  }

  edit(applicationFormItem: ItemWithDefinitionDTO): void {
    const config = getDefaultDialogConfig();
    config.width = '600px';
    config.height = '600px';
    config.data = {
      isGroup: this.formSpecification.idmObject.idmObjectType === 'GROUP',
      applicationFormItem: applicationFormItem,
      theme: this.theme,
      allItems: this.applicationFormItems,
    };

    const editDialog = this.dialog.open(EditApplicationFormItemDialogNewRegComponent, config);
    editDialog.afterClosed().subscribe((updatedItem: ItemWithDefinitionDTO) => {
      if (updatedItem) {
        Object.assign(applicationFormItem, updatedItem);
        this.itemsChanged.push(applicationFormItem.formItemDTO.id);
        this.applicationFormItemsChange.emit();
      }
    });
  }

  delete(applicationFormItem: ItemWithDefinitionDTO): void {
    let errorMessage = '';
    const hiddenDependencyForItem = this.applicationFormItems.find(
      (item) => item.formItemDTO.hiddenDependencyItemId === applicationFormItem.formItemDTO.id,
    );
    const disabledDependencyForItem = this.applicationFormItems.find(
      (item) => item.formItemDTO.disabledDependencyItemId === applicationFormItem.formItemDTO.id,
    );
    if (hiddenDependencyForItem || disabledDependencyForItem) {
      errorMessage = this.translate.instant(
        'DIALOGS.APPLICATION_FORM_EDIT_ITEM.DEPENDENCY_ERROR_MESSAGE',
        hiddenDependencyForItem
          ? {
              dependency: 'hidden',
              shortname: hiddenDependencyForItem.formItemDTO.name,
            }
          : {
              dependency: 'disabled',
              shortname: disabledDependencyForItem.formItemDTO.name,
            },
      );
    }

    const config = getDefaultDialogConfig();
    config.width = '500px';
    config.data = {
      errorMessage: errorMessage,
    };

    const dialog = this.dialog.open(DeleteApplicationFormItemDialogComponent, config);
    dialog.afterClosed().subscribe((deleteItem) => {
      if (deleteItem) {
        this.forDelete.add(applicationFormItem.formItemDTO.id);
        this.applicationFormItemsDeleted.emit(Array.from(this.forDelete));
        this.applicationFormItemsChange.emit();
      }
    });
  }

  drop(event: CdkDragDrop<ItemWithDefinitionDTO[]>): void {
    this.dragDisabled = true;
    const prevIndex = this.applicationFormItems.indexOf(event.item.data as ItemWithDefinitionDTO);
    moveItemInArray(this.applicationFormItems, prevIndex, event.currentIndex);
    this.itemsChanged.push(this.applicationFormItems[event.currentIndex].formItemDTO.id);
    this.applicationFormItemsChange.emit();
    this.table.renderRows();
  }

  getLocalizedOptions(applicationFormItem: ItemWithDefinitionDTO): string[] {
    if (applicationFormItem.itemDefinition.texts[this.translate.getDefaultLang()]) {
      const options =
        applicationFormItem.itemDefinition.texts[this.translate.getDefaultLang()].options;
      if (options !== null) {
        const labels: string[] = [];
        for (const key in options) {
          labels.push(options[key]);
        }
        return labels;
      }
    }
    return [];
  }

  getLocalizedLabel(applicationFormItem: ItemWithDefinitionDTO): string {
    if (applicationFormItem.itemDefinition.texts[this.translate.getDefaultLang()]) {
      return applicationFormItem.itemDefinition.texts[this.translate.getDefaultLang()].label;
    }
    return applicationFormItem.formItemDTO.name;
  }

  restore(applicationFormItem: ItemWithDefinitionDTO): void {
    this.forDelete.delete(applicationFormItem.formItemDTO.id);
    this.applicationFormItemsDeleted.emit(Array.from(this.forDelete));
  }
}
