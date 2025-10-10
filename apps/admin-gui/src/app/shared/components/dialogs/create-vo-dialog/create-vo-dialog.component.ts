import { MatTooltip } from '@angular/material/tooltip';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
import { Router } from '@angular/router';
import { spaceNameValidator } from '@perun-web-apps/perun/utils';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface CreateVoDialogData {
  theme: string;
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
    MatTooltip,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'app-create-vo-dialog',
  templateUrl: './create-vo-dialog.component.html',
  styleUrls: ['./create-vo-dialog.component.scss'],
})
export class CreateVoDialogComponent implements OnInit {
  loading: boolean;
  theme: string;
  shortNameCtrl: FormControl<string>;
  fullNameCtrl: FormControl<string>;
  private successMessage: string;

  constructor(
    private dialogRef: MatDialogRef<CreateVoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CreateVoDialogData,
    private notificator: NotificatorService,
    private voService: VosManagerService,
    private translate: TranslateService,
    private router: Router,
  ) {
    translate
      .get('DIALOGS.CREATE_VO.SUCCESS')
      .subscribe((value: string) => (this.successMessage = value));
  }

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.shortNameCtrl = new FormControl('', [
      Validators.required,
      Validators.pattern('^[\\w.-]+$'),
      Validators.maxLength(33),
      spaceNameValidator(),
    ]);
    this.fullNameCtrl = new FormControl('', [
      Validators.required,
      Validators.pattern('.*[\\S]+.*'),
      Validators.maxLength(129),
      spaceNameValidator(),
    ]);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    this.voService.createVoWithName(this.fullNameCtrl.value, this.shortNameCtrl.value).subscribe({
      next: (vo) => {
        this.notificator.showSuccess(this.successMessage);
        this.loading = false;
        void this.router.navigate(['/organizations', vo.id], { queryParamsHandling: 'preserve' });
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false),
    });
  }
}
