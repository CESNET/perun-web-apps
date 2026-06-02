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
  FormsService,
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
    'CHECKBOX',
    'SUBMIT_BUTTON',
  ];
  nameCtrl: UntypedFormControl;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<AddApplicationFormItemDialogNewRegComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddApplicationFormItemDialogNewRegComponentData,
    private translateService: TranslateService,
    private store: StoreService,
    private formsService: FormsService,
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
    this.loading = true;

    const newApplicationItem: FormItemDTO = {} as FormItemDTO;
    newApplicationItem.id = this.data.fakeId;
    newApplicationItem.name = this.nameCtrl.value as string;

    const newItemDefinition: ItemDefinitionDTO = {} as ItemDefinitionDTO;
    newItemDefinition.id = null;
    newItemDefinition.type = this.selectedWidget;
    newItemDefinition.scope = 'FORM_SPECIFIC';
    newItemDefinition.formSpecificationId = this.data.formSpecificationId;
    newItemDefinition.displayName = this.nameCtrl.value as string;
    newItemDefinition.texts = {};
    newItemDefinition.updatable = true;
    newItemDefinition.required = false;
    newItemDefinition.hidden = 'NEVER';
    newItemDefinition.disabled = 'NEVER';
    newItemDefinition.formTypes = ['INITIAL', 'EXTENSION'];

    for (const lang of this.languages) {
      newItemDefinition.texts[lang] = {
        error: '',
        help: '',
        label: '',
        options: {
          option1: 'Option 1',
        },
      };
    }
    newItemDefinition.validators = [];
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
}
