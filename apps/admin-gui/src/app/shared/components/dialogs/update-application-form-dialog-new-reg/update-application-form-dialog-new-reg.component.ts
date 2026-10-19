import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import {
  FormModuleDTO,
  FormModulesService,
  FormSpecificationDTO,
  FormsService,
} from '@perun-web-apps/perun/registrar-openapi';
import AutoApprovedTypesEnum = FormSpecificationDTO.AutoApprovedTypesEnum;
import { MatTooltip } from '@angular/material/tooltip';

export interface UpdateApplicationFormDialogNewRegData {
  entity: string;
  applicationForm: FormSpecificationDTO;
  theme: string;
  autoRegistrationEnabled: boolean;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
    MatTooltip,
  ],
  standalone: true,
  selector: 'app-update-application-form-dialog',
  templateUrl: './update-application-form-dialog-new-reg.component.html',
  styleUrls: ['./update-application-form-dialog-new-reg.component.scss'],
})
export class UpdateApplicationFormDialogNewRegComponent implements OnInit {
  entity: string;
  applicationForm: FormSpecificationDTO;
  initialState: string;
  extensionState: string;
  embeddedState: string;
  loading = true;
  theme: string;
  autoRegistrationEnabled: boolean;
  availableModules: FormModuleDTO[] = [];

  readonly modulesForm = new FormGroup({
    fields: new FormArray<FormControl<string | null>>([]),
  });

  constructor(
    private dialogRef: MatDialogRef<UpdateApplicationFormDialogNewRegComponent>,
    @Inject(MAT_DIALOG_DATA) private data: UpdateApplicationFormDialogNewRegData,
    private formsService: FormsService,
    private moduleService: FormModulesService,
  ) {}

  get fields(): FormArray<FormControl<string | null>> {
    return this.modulesForm.controls.fields;
  }

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;
    this.applicationForm = this.data.applicationForm;
    this.initialState = this.applicationForm.autoApprovedTypes.includes('INITIAL')
      ? 'auto'
      : 'manual';
    this.extensionState = this.applicationForm.autoApprovedTypes.includes('EXTENSION')
      ? 'auto'
      : 'manual';
    this.entity = this.data.entity;
    this.autoRegistrationEnabled = this.data.autoRegistrationEnabled;
    this.applicationForm.modules.forEach((module) => {
      this.fields.push(new FormControl<string | null>(module.moduleName, Validators.required));
    });
    this.moduleService.getAvailableModules().subscribe((modules) => {
      this.availableModules = modules;
      this.loading = false;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addField(): void {
    this.fields.push(new FormControl<string | null>(null, Validators.required));
  }

  removeField(index: number): void {
    this.fields.removeAt(index);
  }

  getAvailableOptions(index: number): FormModuleDTO[] {
    const selectedModules = new Set(
      this.fields.controls
        .map((control) => control.value)
        .filter((value): value is string => value !== null),
    );

    const currentValue = this.fields.at(index).value;

    return this.availableModules.filter(
      (option) => option.name === currentValue || !selectedModules.has(option.name),
    );
  }

  submit(): void {
    this.loading = true;
    const resultTypes: AutoApprovedTypesEnum[] = [];
    if (this.initialState === 'auto') resultTypes.push('INITIAL');
    if (this.extensionState === 'auto') resultTypes.push('EXTENSION');
    this.applicationForm.autoApprovedTypes = resultTypes;
    this.formsService
      .updateForm(this.applicationForm.id, {
        autoFormTypes: this.applicationForm.autoApprovedTypes,
        formModules: this.modulesForm.value.fields.map((moduleName) => {
          return { formSpecificationId: this.applicationForm.id, moduleName: moduleName };
        }),
      })
      .subscribe(
        (updatedForm) => {
          this.dialogRef.close(updatedForm);
        },
        () => (this.loading = false),
      );
  }
}
