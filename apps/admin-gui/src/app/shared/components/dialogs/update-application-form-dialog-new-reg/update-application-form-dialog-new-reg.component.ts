import { TranslateModule } from '@ngx-translate/core';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import {
  FormModuleDTO,
  FormModulesService,
  FormSpecificationDTO,
  FormsService,
} from '@perun-web-apps/perun/registrar-openapi';
import { MatTooltip } from '@angular/material/tooltip';
import { forkJoin, map, Observable, tap } from 'rxjs';

export interface UpdateApplicationFormDialogNewRegData {
  entity: string;
  initForm: FormSpecificationDTO;
  extForm: FormSpecificationDTO;
  // the object's own EMBEDDED flow form (GROUP only), null for VOs
  embeddedForm: FormSpecificationDTO | null;
  theme: string;
  autoRegistrationEnabled: boolean;
}

export interface UpdateApplicationFormsResult {
  initForm: FormSpecificationDTO;
  extForm: FormSpecificationDTO;
  embeddedForm: FormSpecificationDTO | null;
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
  initForm: FormSpecificationDTO;
  extForm: FormSpecificationDTO;
  initState: string;
  extState: string;
  loading = true;
  theme: string;
  autoRegistrationEnabled: boolean;
  availableModules: FormModuleDTO[] = [];
  // existing EMBEDDED flow form of this object (GROUP only); non-null enables the embedded auto-approve select
  embeddedForm: FormSpecificationDTO | null = null;
  embeddedState: string = 'manual';

  flowModuleNames = [
    'InitialMembership',
    'UpdateAttribute',
    'CancellationMembership',
    'ExtensionMembership',
  ];

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
    this.theme = this.data.theme;
    this.initForm = this.data.initForm;
    this.initState = this.initForm.autoApprove ? 'auto' : 'manual';
    this.extForm = this.data.extForm;
    this.extState = this.extForm.autoApprove ? 'auto' : 'manual';
    this.embeddedForm = this.data.embeddedForm;
    this.embeddedState = this.embeddedForm?.autoApprove ? 'auto' : 'manual';
    this.entity = this.data.entity;
    this.autoRegistrationEnabled = this.data.autoRegistrationEnabled;
    this.initForm.modules.forEach((module) => {
      if (!this.flowModuleNames.includes(module.moduleName)) {
        this.fields.push(new FormControl<string | null>(module.moduleName, Validators.required));
      }
    });
    this.moduleService.getAvailableModules().subscribe((modules) => {
      this.availableModules = modules.filter(
        (module) => !this.flowModuleNames.includes(module.name),
      );
    });
    this.loading = false;
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
    const patches: Observable<FormSpecificationDTO>[] = [
      this.formsService.updateForm(this.initForm.id, {
        autoApprove: this.initState === 'auto',
        formModules: this.modulePatchFor(this.initForm),
      }),
      this.formsService.updateForm(this.extForm.id, {
        autoApprove: this.extState === 'auto',
        formModules: this.modulePatchFor(this.extForm),
      }),
    ];
    let embeddedForm: FormSpecificationDTO | null = this.embeddedForm;
    if (embeddedForm) {
      // the embedded auto-approve is the autoApprove of the object's own EMBEDDED form
      patches.push(
        this.formsService
          .updateForm(embeddedForm.id, { autoApprove: this.embeddedState === 'auto' })
          .pipe(tap((updated) => (embeddedForm = updated))),
      );
    }
    forkJoin(patches)
      .pipe(
        map(([updatedInitForm, updatedExtForm]) => [updatedInitForm, updatedExtForm, embeddedForm]),
      )
      .subscribe({
        next: ([initForm, extForm, embedded]) => {
          this.dialogRef.close({
            initForm,
            extForm,
            embeddedForm: embedded,
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  /**
   * Module payload for a form patch. The picker only manages the "regular" modules, but
   * form_modules is replace-semantics, so the EmbeddedGroups module (managed with the
   * embedded item, not in the picker) must be carried over with its configuration intact.
   */
  private modulePatchFor(form: FormSpecificationDTO): Array<{
    formSpecificationId: string;
    moduleName: string;
    configuration: unknown;
  }> {
    return this.modulesForm.value.fields.map((moduleName) => ({
      formSpecificationId: form.id,
      moduleName,
      // keep an existing module's configuration; newly picked modules have none
      configuration: ((form.modules ?? []).find((module) => module.moduleName === moduleName)
        ?.configuration ?? null) as unknown,
    }));
  }
}
