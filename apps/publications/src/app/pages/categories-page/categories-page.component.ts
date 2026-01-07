import { TranslateModule } from '@ngx-translate/core';
import { DebounceFilterComponent, RefreshButtonComponent } from '@perun-web-apps/perun/components';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CabinetManagerService, Category } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { GuiAuthResolver } from '@perun-web-apps/perun/services';
import { getDefaultDialogConfig } from '@perun-web-apps/perun/utils';
import { AddCategoryDialogComponent } from '../../dialogs/add-category-dialog/add-category-dialog.component';
import { RemoveCategoryDialogComponent } from '../../dialogs/remove-category-dialog/remove-category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { CategoriesListComponent } from '../../components/categories-list/categories-list.component';
import { LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    DebounceFilterComponent,
    RefreshButtonComponent,
    TranslateModule,
    CategoriesListComponent,
    LoadingTableComponent,
    LoaderDirective,
  ],
  standalone: true,
  selector: 'perun-web-apps-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
})
export class CategoriesPageComponent implements OnInit {
  categories: Category[] = [];
  selected = new SelectionModel<Category>(
    true,
    [],
    true,
    (category1, category2) => category1.id === category2.id,
  );
  cachedSubject = new BehaviorSubject(true);
  loading: boolean;
  filterValue = '';

  removeAuth: boolean;
  addAuth: boolean;

  constructor(
    private cabinetManagerService: CabinetManagerService,
    private dialog: MatDialog,
    private guiAuthResolver: GuiAuthResolver,
  ) {}

  ngOnInit(): void {
    this.setAuth();
    this.refreshTable();
  }

  setAuth(): void {
    this.removeAuth = this.guiAuthResolver.isAuthorized('deleteCategory_Category_policy', []);
    this.addAuth = this.guiAuthResolver.isAuthorized('createCategory_Category_policy', []);
  }

  refreshTable(): void {
    this.loading = true;
    this.cabinetManagerService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.selected.clear();
      this.cachedSubject.next(true);
      this.loading = false;
    });
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.refreshTable();
  }

  addCategory(): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = {};

    const dialogRef = this.dialog.open(AddCategoryDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }

  removeCategory(): void {
    const config = getDefaultDialogConfig();
    config.width = '400px';
    config.data = this.selected.selected;

    const dialogRef = this.dialog.open(RemoveCategoryDialogComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshTable();
      }
    });
  }
}
