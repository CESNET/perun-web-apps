import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { AlertComponent } from '@perun-web-apps/ui/alerts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  ApplicationFormItem,
  AttributeDefinition,
  AttributesManagerService,
} from '@perun-web-apps/perun/openapi';
import {
  AppFormItemSearchSelectComponent,
  HtmlContentFormFieldComponent,
  ItemType,
  NO_FORM_ITEM,
  SelectionItem,
  SelectionItemSearchSelectComponent,
} from '@perun-web-apps/perun/components';
import {
  HtmlEscapeService,
  PerunTranslateService,
  StoreService,
} from '@perun-web-apps/perun/services';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { ApplicationFormItemDisabledPipe } from '../../../pipes/application-form-item-disabled.pipe';
import { ApplicationFormItemHiddenPipe } from '../../../pipes/application-form-item-hidden.pipe';
import { DisableSubmitOnAppItemEditPipe } from '@perun-web-apps/perun/pipes';
import {
  FormTypeConfig,
  ItemDefinitionDTO,
  ItemWithDefinitionDTO,
  PrefillStrategyEntryDTO,
} from '@perun-web-apps/perun/registrar-openapi';
import FormTypeEnum = FormTypeConfig.FormTypeEnum;

export interface EditApplicationFormItemDialogNewRegComponentData {
  theme: string;
  isGroup: boolean;
  formSpecificationId: string;
  applicationFormItem: ItemWithDefinitionDTO;
  allItems: ItemWithDefinitionDTO[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    AlertComponent,
    LoadingDialogComponent,
    MatTabsModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatTooltip,
    AppFormItemSearchSelectComponent,
    SelectionItemSearchSelectComponent,
    HtmlContentFormFieldComponent,
    LoaderDirective,
    ApplicationFormItemDisabledPipe,
    ApplicationFormItemHiddenPipe,
    DisableSubmitOnAppItemEditPipe,
  ],
  standalone: true,
  selector: 'app-edit-application-form-item-dialog-new-reg',
  templateUrl: './edit-application-form-item-dialog-new-reg.component.html',
  styleUrls: ['./edit-application-form-item-dialog-new-reg.component.scss'],
})
export class EditApplicationFormItemDialogNewRegComponent implements OnInit {
  applicationFormItem: ItemWithDefinitionDTO;
  sourceAttributes: AttributeDefinition[];
  destinationAttributes: AttributeDefinition[];
  itemDestination: string = '';
  itemDestinationOriginal: string = '';
  idmSource: string = '';
  idmSourceOriginal: PrefillStrategyEntryDTO;
  identitySource: string = '';
  identitySourceOriginal: PrefillStrategyEntryDTO;
  validatorRegex: string = '';
  identityPrefillStrategy: PrefillStrategyEntryDTO;
  idmPrefillStrategy: PrefillStrategyEntryDTO;
  federationAttributeDN = '';
  itemType = ItemType;
  options: { [key: string]: [string, FormControl<string>][] };
  theme: string;
  loading = true;
  hiddenValues: ItemDefinitionDTO.HiddenEnum[] = ['NEVER', 'ALWAYS', 'IF_EMPTY', 'IF_PREFILLED'];
  disabledValues: ItemDefinitionDTO.DisabledEnum[] = [
    'NEVER',
    'ALWAYS',
    'IF_EMPTY',
    'IF_PREFILLED',
  ];
  possibleDependencyItems: ApplicationFormItem[] = [];
  inputFormGroup: FormGroup<Record<string, FormControl<string>>> = null;
  optionsFormArray: FormArray<FormControl<string>> = new FormArray<FormControl<string>>([]);

  // way to map uuid to number so we can reuse the select component
  uuidToId = new Map<string, number>();
  idToUuid = new Map<number, string>();
  nextId = 1;

  typesWithUpdatable: ItemDefinitionDTO.TypeEnum[] = ['TEXTFIELD', 'CHECKBOX', 'SELECTIONBOX'];
  typesWithDisabled: ItemDefinitionDTO.TypeEnum[] = [
    'LOGIN',
    'PASSWORD',
    'TEXTFIELD',
    'CHECKBOX',
    'SELECTIONBOX',
  ];

  hiddenDependencyItem: ApplicationFormItem = null;
  disabledDependencyItem: ApplicationFormItem = null;
  warningMessage = '';
  displayWarningForSourceAttr = false;
  displayWarningForDestinationAttr = false;
  languages = ['en'];
  private dependencyTypes: ItemDefinitionDTO.TypeEnum[] = [
    'LOGIN',
    'PASSWORD',
    'TEXTFIELD',
    'CHECKBOX',
    'SELECTIONBOX',
  ];

  constructor(
    private dialogRef: MatDialogRef<EditApplicationFormItemDialogNewRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditApplicationFormItemDialogNewRegComponentData,
    private attributesManager: AttributesManagerService,
    private translate: PerunTranslateService,
    private store: StoreService,
    private cd: ChangeDetectorRef,
    private escapeService: HtmlEscapeService,
  ) {}

  ngOnInit(): void {
    this.languages = this.store.getProperty('supported_languages');
    const hiddenDepDTO = this.data.allItems.find(
      (item) =>
        item.formItemDTO.id === this.data.applicationFormItem.formItemDTO.hiddenDependencyItemId,
    )?.formItemDTO;
    if (hiddenDepDTO) {
      this.hiddenDependencyItem = {
        id: this.getId(hiddenDepDTO.id),
        shortname: hiddenDepDTO.name,
      } as ApplicationFormItem;
    }
    if (!this.hiddenDependencyItem) {
      this.hiddenDependencyItem = NO_FORM_ITEM;
    }
    const disabledDepDTO = this.data.allItems.find(
      (item) =>
        item.formItemDTO.id === this.data.applicationFormItem.formItemDTO.disabledDependencyItemId,
    )?.formItemDTO;
    if (disabledDepDTO) {
      this.disabledDependencyItem = {
        id: this.getId(disabledDepDTO.id),
        shortname: disabledDepDTO.name,
      } as ApplicationFormItem;
    }
    if (!this.disabledDependencyItem) {
      this.disabledDependencyItem = NO_FORM_ITEM;
    }
    this.theme = this.data.theme;
    this.possibleDependencyItems = this.getPossibleDepItems();
    this.applicationFormItem = structuredClone(this.data.applicationFormItem);
    this.getOptions();
    this.prepareFormControls();

    this.loading = true;
    this.validatorRegex = this.applicationFormItem.itemDefinition.validators.find(
      (val) => val.type === 'REGEX',
    )?.options['regex'];
    this.identitySourceOriginal = this.applicationFormItem.prefillStrategyEntries.find(
      (pref) => pref.type === 'IDENTITY_ATTRIBUTE',
    );
    this.identitySource = this.identitySourceOriginal?.sourceAttribute ?? '';
    this.idmSourceOriginal = this.applicationFormItem.prefillStrategyEntries.find(
      (pref) => pref.type === 'IDM_ATTRIBUTE',
    );
    this.idmSource = this.idmSourceOriginal?.sourceAttribute;
    this.attributesManager.getAllAttributeDefinitions().subscribe({
      next: (attributeDefinitions) => {
        const filteredAttributes = this.filterAttributesForWidget(attributeDefinitions);

        const perunSourceAttrDef = this.findAttribute(attributeDefinitions, this.idmSource);
        this.sourceAttributes = perunSourceAttrDef
          ? filteredAttributes.concat(perunSourceAttrDef)
          : filteredAttributes;

        this.itemDestination = this.applicationFormItem.destination?.urn;
        this.itemDestinationOriginal = this.itemDestination;
        const perunDestinationAttrDef = this.findAttribute(
          attributeDefinitions,
          this.itemDestination,
        );
        this.destinationAttributes = perunDestinationAttrDef
          ? filteredAttributes.concat(perunDestinationAttrDef)
          : filteredAttributes;

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  loadWarning(itemType: ItemType): void {
    this.warningMessage = '';
    const hiddenDependencyForItem = this.data.allItems.find(
      (item) =>
        item.formItemDTO.hiddenDependencyItemId === this.data.applicationFormItem.formItemDTO.id,
    );
    const disabledDependencyForItem = this.data.allItems.find(
      (item) =>
        item.formItemDTO.disabledDependencyItemId === this.data.applicationFormItem.formItemDTO.id,
    );
    if (hiddenDependencyForItem || disabledDependencyForItem) {
      if (itemType === ItemType.SOURCE) {
        this.displayWarningForSourceAttr = true;
      } else {
        this.displayWarningForDestinationAttr = true;
      }
      this.warningMessage = this.translate.instant(
        'DIALOGS.APPLICATION_FORM_EDIT_ITEM.DEPENDENCY_WARNING_MESSAGE',
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
      this.cd.detectChanges();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    this.applicationFormItem.formItemDTO.hiddenDependencyItemId =
      this.hiddenDependencyItem === NO_FORM_ITEM
        ? null
        : this.getUuid(this.hiddenDependencyItem.id);
    this.applicationFormItem.formItemDTO.disabledDependencyItemId =
      this.disabledDependencyItem === NO_FORM_ITEM
        ? null
        : this.getUuid(this.disabledDependencyItem.id);

    for (const lang of this.languages) {
      if (!this.applicationFormItem.itemDefinition.texts[lang]) {
        this.applicationFormItem.itemDefinition.texts[lang] = {};
      }
      if (
        this.applicationFormItem.itemDefinition.type === 'HTML_COMMENT' ||
        this.applicationFormItem.itemDefinition.type === 'HEADING' ||
        this.applicationFormItem.itemDefinition.type === 'CHECKBOX'
      ) {
        this.applicationFormItem.itemDefinition.texts[lang].label = this.inputFormGroup.get(
          `${lang}-html-label`,
        ).value;
      } else {
        this.applicationFormItem.itemDefinition.texts[lang].label = this.inputFormGroup.get(
          `${lang}-plain-label`,
        ).value;
      }
      this.applicationFormItem.itemDefinition.texts[lang].error = this.inputFormGroup.get(
        `${lang}-plain-error-message`,
      ).value;
      this.applicationFormItem.itemDefinition.texts[lang].help = this.inputFormGroup.get(
        `${lang}-plain-help`,
      ).value;

      this.applicationFormItem.itemDefinition.texts[lang].options = {};
      if (this.options[lang] ?? false) {
        for (const item of this.options[lang]) {
          if (item[0] !== '' && item[1].value !== '') {
            this.applicationFormItem.itemDefinition.texts[lang].options[item[0]] = item[1].value;
          }
        }
      }
    }

    // set validator if exists
    if (this.validatorRegex && this.validatorRegex !== '') {
      this.applicationFormItem.itemDefinition.validators = [
        {
          type: 'REGEX',
          options: { regex: this.validatorRegex },
        },
      ];
    }

    if (this.itemDestination !== this.itemDestinationOriginal) {
      if (this.itemDestination && this.itemDestination !== '') {
        this.applicationFormItem.destination = {
          id: null,
          formSpecificationId: this.data.formSpecificationId,
          accessLevel: 'FORM_SPECIFIC',
          urn: this.itemDestination,
        };
      } else {
        this.applicationFormItem.destination = null;
      }
    }

    this.applicationFormItem.prefillStrategyEntries = [];
    if (this.identityPrefillStrategy) {
      this.applicationFormItem.prefillStrategyEntries.push(this.identityPrefillStrategy);
    }
    if (this.idmPrefillStrategy) {
      this.applicationFormItem.prefillStrategyEntries.push(this.idmPrefillStrategy);
    }

    this.dialogRef.close(this.applicationFormItem);
  }

  onChangingType(type: FormTypeEnum): void {
    this.applicationFormItem.itemDefinition.formTypes.push(type);
  }

  addOption(lang: string): void {
    const control = new FormControl<string>('', [], [this.escapeService.checkboxValidator(true)]);
    control.markAsTouched();
    this.optionsFormArray.push(control);
    this.options[lang].push(['', control]);
  }

  removeOption(option: [string, FormControl<string>], lang: string): void {
    this.options[lang] = this.options[lang].filter(
      (opt) => !(opt[0] === option[0] && opt[1].value === option[1].value),
    );

    // update form array
    let controls: FormControl<string>[] = [];
    for (const language of this.languages) {
      controls = controls.concat(this.options[language].map((opt) => opt[1]));
    }
    this.optionsFormArray = new FormArray<FormControl<string>>(controls);
  }

  sortOptionsAZ(lang: string): void {
    this.options[lang] = this.options[lang].sort((n1, n2) => {
      if (n1[1].value > n2[1].value) {
        return 1;
      }

      if (n1[1].value < n2[1].value) {
        return -1;
      }

      return 0;
    });
  }

  sortOptionsZA(lang: string): void {
    this.options[lang] = this.options[lang].sort((n1, n2) => {
      if (n1[1].value > n2[1].value) {
        return -1;
      }

      if (n1[1].value < n2[1].value) {
        return 1;
      }

      return 0;
    });
  }

  isApplicationFormItemOfType(types: string[]): boolean {
    return types.includes(this.applicationFormItem.itemDefinition.type);
  }

  changeFederationAttribute(fedAttribute: SelectionItem): void {
    this.federationAttributeDN = fedAttribute.displayName;
    if (fedAttribute.value !== this.identitySourceOriginal?.sourceAttribute) {
      if (fedAttribute.value === '') {
        this.identityPrefillStrategy = null;
      } else {
        this.identityPrefillStrategy = {
          id: null,
          type: 'IDENTITY_ATTRIBUTE',
          formSpecificationId: this.data.formSpecificationId,
          accessLevel: 'FORM_SPECIFIC',
          sourceAttribute: fedAttribute.value,
        };
      }
    } else {
      this.identityPrefillStrategy = this.identitySourceOriginal;
    }
    this.cd.detectChanges();
  }

  changeIdmAttribute(attribute: SelectionItem): void {
    if (attribute.value !== this.idmSourceOriginal?.sourceAttribute) {
      if (attribute.value === '') {
        this.idmPrefillStrategy = null;
      } else {
        this.idmPrefillStrategy = {
          id: null,
          type: 'IDM_ATTRIBUTE',
          formSpecificationId: this.data.formSpecificationId,
          accessLevel: 'FORM_SPECIFIC',
          sourceAttribute: attribute.value,
        };
      }
    } else {
      this.idmPrefillStrategy = this.idmSourceOriginal;
    }
    this.cd.detectChanges();
  }

  private prepareFormControls(): void {
    const formGroupFields: { [key: string]: FormControl } = {};
    for (const lang of this.languages) {
      if (
        this.applicationFormItem.itemDefinition.type === 'HTML_COMMENT' ||
        this.applicationFormItem.itemDefinition.type === 'HEADING'
      ) {
        // async validator is set in a separate component
        formGroupFields[`${lang}-html-label`] = new FormControl(
          this.applicationFormItem.itemDefinition.texts[lang]?.label,
        );
        formGroupFields[`${lang}-html-label`].markAsTouched();
      }
      if (this.applicationFormItem.itemDefinition.type === 'CHECKBOX') {
        formGroupFields[`${lang}-html-label`] = new FormControl(
          this.applicationFormItem.itemDefinition.texts[lang]?.label,
          [],
          [this.escapeService.checkboxValidator(true)],
        );
        formGroupFields[`${lang}-html-label`].markAsTouched();
      }

      // Plain
      formGroupFields[`${lang}-plain-error-message`] = new FormControl(
        this.applicationFormItem.itemDefinition.texts[lang]?.error,
        [],
      );
      formGroupFields[`${lang}-plain-help`] = new FormControl(
        this.applicationFormItem.itemDefinition.texts[lang]?.help,
        [],
      );
      formGroupFields[`${lang}-plain-label`] = new FormControl(
        this.applicationFormItem.itemDefinition.texts[lang]?.label,
        [],
      );

      formGroupFields[`${lang}-plain-label`].markAsTouched();
      formGroupFields[`${lang}-plain-error-message`].markAsTouched();
      formGroupFields[`${lang}-plain-help`].markAsTouched();
    }
    this.inputFormGroup = new FormGroup(formGroupFields);
  }

  private getPossibleDepItems(): ApplicationFormItem[] {
    return [NO_FORM_ITEM].concat(
      this.data.allItems
        .filter((item) => this.dependencyTypes.includes(item.itemDefinition.type))
        .filter((item) => item.formItemDTO.id !== this.data.applicationFormItem.formItemDTO.id)
        .map(
          (item) =>
            ({
              id: this.getId(item.formItemDTO.id),
              shortname: item.formItemDTO.name,
            }) as ApplicationFormItem,
        ),
    );
  }

  private findAttribute(attributes: AttributeDefinition[], toFind: string): AttributeDefinition {
    return attributes.find((att) => toFind?.includes(att.friendlyName));
  }

  private filterAttributesForWidget(attributes: AttributeDefinition[]): AttributeDefinition[] {
    return attributes.filter(
      (att) => !att.type.includes('ArrayList') && !att.type.includes('LinkedHashMap'),
    );
  }

  private getId(uuid: string): number {
    const existing = this.uuidToId.get(uuid);
    if (existing !== undefined) {
      return existing;
    }

    const id = this.nextId++;
    this.uuidToId.set(uuid, id);
    this.idToUuid.set(id, uuid);
    return id;
  }

  private getUuid(id: number): string | undefined {
    return this.idToUuid.get(id);
  }

  private getOptions(): void {
    this.options = {};
    for (const lang of this.languages) {
      this.options[lang] = [];
      if (!this.applicationFormItem.itemDefinition.texts[lang]) {
        this.applicationFormItem.itemDefinition.texts[lang] = {};
      }
      if (this.applicationFormItem.itemDefinition.texts[lang].options) {
        for (const item of Object.keys(
          this.applicationFormItem.itemDefinition.texts[lang].options,
        )) {
          const control = new FormControl<string>(
            this.applicationFormItem.itemDefinition.texts[lang].options[item],
            [],
            [this.escapeService.checkboxValidator(true)],
          );
          control.markAsTouched();
          this.optionsFormArray.push(control);
          this.options[lang].push([item, control]);
        }
      }
    }
  }
}
