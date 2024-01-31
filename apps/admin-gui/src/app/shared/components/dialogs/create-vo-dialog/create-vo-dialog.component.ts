import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { VosManagerService } from '@perun-web-apps/perun/openapi';
import { Router } from '@angular/router';
import { spaceNameValidator } from '@perun-web-apps/perun/utils';

export interface CreateVoDialogData {
  theme: string;
}

@Component({
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
