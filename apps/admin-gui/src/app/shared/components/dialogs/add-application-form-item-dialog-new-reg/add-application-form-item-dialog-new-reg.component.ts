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
} from '@perun-web-apps/perun/registrar-openapi';

export interface AddApplicationFormItemDialogNewRegComponentData {
  applicationFormItems: ItemWithDefinitionDTO[];
  formSpecificationId: string;
  fakeId: string;
}

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
  selectedWidget: ItemDefinitionDTO.TypeEnum = 'HEADING';
  widgets: ItemDefinitionDTO.TypeEnum[] = [
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
  ];
  nameCtrl: UntypedFormControl;
  autoSubmit = false;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<AddApplicationFormItemDialogNewRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddApplicationFormItemDialogNewRegComponentData,
    private translateService: TranslateService,
    private store: StoreService,
  ) {}

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
    this.dialogRef.close([this.data.applicationFormItems, newEnrichedItem]);
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
      formTypes: ['INITIAL', 'EXTENSION'],
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
      case 'SUBMIT_BUTTON':
        return { ...common, type, configuration: { autoSubmit: this.autoSubmit } };
      case 'LOGIN':
      case 'PASSWORD':
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
