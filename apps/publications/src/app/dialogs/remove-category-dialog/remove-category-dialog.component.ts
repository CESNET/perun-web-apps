import { LoadingDialogComponent } from '@perun-web-apps/ui/loaders';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CabinetManagerService, Category } from '@perun-web-apps/perun/openapi';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoadingDialogComponent,
    MatTableModule,
    TranslateModule,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'perun-web-apps-remove-category-dialog',
  templateUrl: './remove-category-dialog.component.html',
  styleUrls: ['./remove-category-dialog.component.scss'],
})
export class RemoveCategoryDialogComponent implements OnInit {
  loading: boolean;
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Category>;
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<RemoveCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category[],
    private notificator: NotificatorService,
    private translate: TranslateService,
    private cabinetManagerService: CabinetManagerService,
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Category>(this.data);
    this.categories = this.data;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.loading = true;
    if (this.categories.length) {
      this.cabinetManagerService.deleteCategory(this.categories.pop().id).subscribe(
        () => {
          this.onSubmit();
        },
        () => (this.loading = false),
      );
    } else {
      this.translate.get('DIALOGS.REMOVE_CATEGORY.SUCCESS').subscribe((successMessage: string) => {
        this.loading = false;
        this.notificator.showSuccess(successMessage);
        this.dialogRef.close(true);
      });
    }
  }
}
