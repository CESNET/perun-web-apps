import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ResourcesManagerService, Vo, VosManagerService } from '@perun-web-apps/perun/openapi';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { spaceNameValidator } from '@perun-web-apps/perun/utils';
import { LoaderDirective } from '@perun-web-apps/perun/directives';
import { VoSearchSelectComponent } from '@perun-web-apps/perun/components';

export interface CreateResourceDialogData {
  theme: string;
  facilityId: number;
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    LoadingDialogComponent,
    TranslateModule,
    LoaderDirective,
    VoSearchSelectComponent,
  ],
  standalone: true,
  selector: 'app-create-resource-dialog',
  templateUrl: './create-resource-dialog.component.html',
  styleUrls: ['./create-resource-dialog.component.scss'],
})
export class CreateResourceDialogComponent implements OnInit {
  nameCtrl: FormControl<string>;
  descriptionCtrl: FormControl<string>;
  vos: Vo[] = [];

  theme: string;
  loading: boolean;
  selectedVo: Vo = null;
  private successMessage: string;

  constructor(
    private dialogRef: MatDialogRef<CreateResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CreateResourceDialogData,
    private notificator: NotificatorService,
    private voService: VosManagerService,
    private translate: TranslateService,
    private resourcesManager: ResourcesManagerService,
  ) {
    translate
      .get('DIALOGS.CREATE_RESOURCE.SUCCESS')
      .subscribe((value: string) => (this.successMessage = value));
  }

  ngOnInit(): void {
    this.loading = true;
    this.theme = this.data.theme;
    this.voService.getAllVos().subscribe({
      next: (vos) => {
        this.vos = vos;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });

    this.nameCtrl = new FormControl('', [
      Validators.required,
      Validators.pattern('.*[\\S]+.*'),
      spaceNameValidator(),
    ]);
    this.descriptionCtrl = new FormControl('');
  }

  onSubmit(): void {
    this.loading = true;
    this.resourcesManager
      .createResource(
        this.selectedVo.id,
        this.data.facilityId,
        this.nameCtrl.value,
        this.descriptionCtrl.value,
      )
      .subscribe({
        next: () => {
          this.notificator.showSuccess(this.successMessage);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => (this.loading = false),
      });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
