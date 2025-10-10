import { MatTooltip } from '@angular/material/tooltip';
import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { CabinetManagerService } from '@perun-web-apps/perun/openapi';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

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
  selector: 'perun-web-apps-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss'],
})
export class AddCategoryDialogComponent implements OnInit {
  successMessage: string;
  loading: boolean;

  nameCtrl: FormControl<string>;
  rankCtrl: FormControl<number>;

  constructor(
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    private notificator: NotificatorService,
    private cabinetManagerService: CabinetManagerService,
    private translate: TranslateService,
  ) {
    translate
      .get('DIALOGS.ADD_CATEGORY.SUCCESS')
      .subscribe((value: string) => (this.successMessage = value));
  }

  ngOnInit(): void {
    this.nameCtrl = new FormControl('', [
      Validators.required,
      Validators.pattern('^[\\w.-]+( [\\w.-]+)*$'),
      Validators.maxLength(128),
    ]);
    this.rankCtrl = new FormControl<number>(null, [
      Validators.required,
      Validators.pattern('^[0-9]+(\\.[0-9])?$'),
    ]);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    this.cabinetManagerService
      .createCategoryCat({
        category: {
          id: 0,
          beanName: 'Category',
          name: this.nameCtrl.value,
          rank: this.rankCtrl.value,
        },
      })
      .subscribe({
        next: () => {
          // this.cabinetManagerService.createCategoryNR({name: this.nameCtrl.value, rank: this.rankCtrl.value}).subscribe(vo => {
          this.notificator.showSuccess(this.successMessage);
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => (this.loading = false),
      });
  }
}
