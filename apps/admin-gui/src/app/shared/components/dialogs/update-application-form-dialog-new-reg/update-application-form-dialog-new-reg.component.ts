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
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { FormSpecificationDTO, FormsService } from '@perun-web-apps/perun/registrar-openapi';
import AutoApprovedTypesEnum = FormSpecificationDTO.AutoApprovedTypesEnum;

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
  loading = false;
  theme: string;
  autoRegistrationEnabled: boolean;

  constructor(
    private dialogRef: MatDialogRef<UpdateApplicationFormDialogNewRegComponent>,
    @Inject(MAT_DIALOG_DATA) private data: UpdateApplicationFormDialogNewRegData,
    private formsService: FormsService,
  ) {}

  ngOnInit(): void {
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
  }

  onCancel(): void {
    this.dialogRef.close();
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
      })
      .subscribe(
        (updatedForm) => {
          this.dialogRef.close(updatedForm);
        },
        () => (this.loading = false),
      );
  }
}
