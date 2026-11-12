import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { StoreService } from '@perun-web-apps/perun/services';
import { UntypedFormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  FormItemDTO,
  ItemDefinitionDTO,
  ItemWithDefinitionDTO,
  Option,
} from '@perun-web-apps/perun/registrar-openapi';
import {
  EMBEDDED_OPTION_PLACEHOLDER_LABEL,
  EMBEDDED_OPTION_PLACEHOLDER_VALUE,
} from '../../../../shared/embedded-groups';

export interface AddApplicationFormItemDialogNewRegComponentData {
  applicationFormItems: ItemWithDefinitionDTO[];
  formSpecificationId: string;
  fakeId: string;
  embeddedItemExists: boolean;
}

/** Pseudo widget type: stored as an EMBEDDED_GROUPS item + the EmbeddedGroups form module. */
export const EMBEDDED_WIDGET = 'EMBEDDED_GROUP_APPLICATION';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    TranslateModule,
  ],
  standalone: true,
  selector: 'app-add-application-form-item-dialog',
  templateUrl: './add-application-form-item-dialog-new-reg.component.html',
  styleUrls: ['./add-application-form-item-dialog-new-reg.component.scss'],
})
export class AddApplicationFormItemDialogNewRegComponent implements OnInit {
  languages = this.store.getProperty('supported_languages');

  items: string[] = [];
  selectedItem: string;
  selectedWidget: ItemDefinitionDTO.TypeEnum | typeof EMBEDDED_WIDGET = 'HEADING';
  readonly embeddedWidget = EMBEDDED_WIDGET;
  widgets: (ItemDefinitionDTO.TypeEnum | typeof EMBEDDED_WIDGET)[] = [
    'HEADING',
    'HTML_COMMENT',
    'TEXTFIELD',
    'SELECTIONBOX',
    'VERIFIED_EMAIL',
    'CHECKBOX',
    'SUBMIT_BUTTON',
    'LOGIN',
    'PASSWORD',
    'TIMEZONE',
    'TEXTAREA',
    'SELECTION_CUSTOM',
    'RADIO',
    'DATE_PICKER',
    'MAP_INPUT_BOX',
    'LIST_INPUT_BOX',
    EMBEDDED_WIDGET,
  ];
  nameCtrl: UntypedFormControl;
  autoSubmit = false;
  loginItem: string | null = null;
  loading = false;

  /** Item types whose options live in the item configuration. */
  readonly choiceWidgets: string[] = ['SELECTIONBOX', 'CHECKBOX', 'SELECTION_CUSTOM', 'RADIO'];

  constructor(
    private dialogRef: MatDialogRef<AddApplicationFormItemDialogNewRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddApplicationFormItemDialogNewRegComponentData,
    private translateService: TranslateService,
    private store: StoreService,
  ) {}

  get loginItems(): ItemWithDefinitionDTO[] {
    return this.data.applicationFormItems.filter((item) => item.itemDefinition.type === 'LOGIN');
  }

  /** i18n key of the widget's select label; the embedded entry reuses the legacy item's text. */
  typeLabelKey(widget: string): string {
    return widget === EMBEDDED_WIDGET
      ? 'VO_DETAIL.SETTINGS.APPLICATION_FORM.NEW_REG_TYPES.EMBEDDED_GROUPS'
      : 'VO_DETAIL.SETTINGS.APPLICATION_FORM.NEW_REG_TYPES.' + widget;
  }

  /** i18n key of the widget's description hint; the embedded entry reuses the legacy item's text. */
  descriptionKey(widget: string): string {
    return widget === EMBEDDED_WIDGET
      ? 'VO_DETAIL.SETTINGS.APPLICATION_FORM.WIDGET_DESCRIPTION.EMBEDDED_GROUP_APPLICATION'
      : 'VO_DETAIL.SETTINGS.APPLICATION_FORM.NEW_REG_WIDGET_DESCRIPTION.' + widget;
  }

  ngOnInit(): void {
    this.translateService
      .get('DIALOGS.APPLICATION_FORM_ADD_ITEM.INSERT_TO_BEGINNING')
      .subscribe((text: string) => {
        this.nameCtrl = new UntypedFormControl('', [
          Validators.required,
          Validators.pattern('.*[\\S]+.*'),
          Validators.maxLength(129),
        ]);
        this.nameCtrl.markAllAsTouched();
        this.items.push(text);
        for (const item of this.data.applicationFormItems) {
          this.items.push(item.formItemDTO.name);
        }
        this.selectedItem = text;
      });
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  submit(): void {
    if (this.nameCtrl.invalid) {
      return;
    }

    this.loading = true;
    const isEmbedded = this.selectedWidget === EMBEDDED_WIDGET;

    const newApplicationItem: FormItemDTO = {} as FormItemDTO;
    newApplicationItem.id = this.data.fakeId;
    newApplicationItem.name = this.nameCtrl.value as string;

    const newItemDefinition = this.createItemDefinition();
    const newEnrichedItem = {
      formItemDTO: newApplicationItem,
      itemDefinition: newItemDefinition,
      prefillStrategyEntries: [],
    } as ItemWithDefinitionDTO;
    this.loading = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.selectedItem === this.items[i]) {
        this.data.applicationFormItems.splice(i, 0, newEnrichedItem);
      }
    }
    this.dialogRef.close([this.data.applicationFormItems, newEnrichedItem, isEmbedded]);
  }

  private createItemDefinition(): ItemWithDefinitionDTO['itemDefinition'] {
    const common: Omit<ItemDefinitionDTO, 'type'> = {
      id: null,
      scope: 'FORM_SPECIFIC',
      formSpecificationId: this.data.formSpecificationId,
      displayName: this.nameCtrl.value as string,
      texts: {},
      updatable: true,
      required: false,
      hidden: 'NEVER',
      disabled: 'NEVER',
      flowIds: ['INITIAL', 'EXTENSION'],
      validators: [],
    };
    for (const lang of this.languages) {
      common.texts[lang] = { error: '', help: '', label: '' };
    }
    const type = this.selectedWidget;
    switch (type) {
      case 'CHECKBOX':
      case 'RADIO':
      case 'SELECTIONBOX':
      case 'SELECTION_CUSTOM': {
        const labels: { [lang: string]: string } = {};
        for (const lang of this.languages) labels[lang] = 'Option 1';
        return { ...common, type, configuration: { options: [{ value: 'option1', labels }] } };
      }
      // EMBEDDED_GROUPS is part of the TypeEnum union (handled here for exhaustiveness);
      // the picker itself only ever selects the EMBEDDED_WIDGET pseudo type
      case 'EMBEDDED_GROUPS':
      case EMBEDDED_WIDGET: {
        // the pseudo widget is stored as a real EMBEDDED_GROUPS item; EMBEDDED_GROUPS items
        // need at least one target (server-side validation), so a newly added item keeps the
        // placeholder until groups are configured on the manage-embedded-groups page
        const placeholder: Option = {
          value: EMBEDDED_OPTION_PLACEHOLDER_VALUE,
          labels: { en: EMBEDDED_OPTION_PLACEHOLDER_LABEL },
        };
        return {
          ...common,
          type: 'EMBEDDED_GROUPS',
          // the server rejects embedded groups items as updatable (their value is produced
          // by the module on approval, never entered by the user)
          updatable: false,
          configuration: { targets: [placeholder] },
        };
      }
      case 'SUBMIT_BUTTON':
        return { ...common, type, configuration: { autoSubmit: this.autoSubmit } };
      case 'PASSWORD':
        return { ...common, type, configuration: { loginItem: this.loginItem } };
      case 'LOGIN':
      case 'HEADING':
      case 'HTML_COMMENT':
      case 'TEXTFIELD':
      case 'VERIFIED_EMAIL':
      case 'DATE_PICKER':
      case 'TIMEZONE':
      case 'TEXTAREA':
      case 'MAP_INPUT_BOX':
      case 'LIST_INPUT_BOX':
        return { ...common, type };
      default: {
        const unsupportedType: never = type;
        throw new Error(`Unsupported item type: ${String(unsupportedType)}`);
      }
    }
  }
}
