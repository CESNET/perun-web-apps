import { LoadingDialogComponent, LoadingTableComponent } from '@perun-web-apps/ui/loaders';
import { UiAlertsModule } from '@perun-web-apps/ui/alerts';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Author, CabinetManagerService } from '@perun-web-apps/perun/openapi';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificatorService } from '@perun-web-apps/perun/services';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { AuthorsListComponent } from '../../components/authors-list/authors-list.component';
import { LoaderDirective } from '@perun-web-apps/perun/directives';

export interface AddAuthorsDialogData {
  publicationId: number;
  alreadyAddedAuthors: Author[];
}

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    UiAlertsModule,
    LoadingDialogComponent,
    TranslateModule,
    AuthorsListComponent,
    LoaderDirective,
    LoadingTableComponent,
  ],
  standalone: true,
  selector: 'perun-web-apps-add-authors-dialog',
  templateUrl: './add-authors-dialog.component.html',
  styleUrls: ['./add-authors-dialog.component.scss'],
})
export class AddAuthorsDialogComponent implements OnInit {
  searchControl: FormControl<string> = new FormControl('');
  successMessage: string;
  loading = false;
  searchLoading = false;
  firstSearchDone = false;
  publicationId: number;
  authors: Author[] = [];
  alreadyAddedAuthors: Author[] = [];
  selection = new SelectionModel<Author>(
    true,
    [],
    true,
    (author1, author2) => author1.id === author2.id,
  );
  cachedSubject = new BehaviorSubject(true);

  constructor(
    private dialogRef: MatDialogRef<AddAuthorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddAuthorsDialogData,
    private notificator: NotificatorService,
    private cabinetService: CabinetManagerService,
    private translate: TranslateService,
  ) {
    translate
      .get('DIALOGS.ADD_AUTHORS.SUCCESS_MESSAGE')
      .subscribe((value: string) => (this.successMessage = value));
    this.publicationId = data.publicationId;
    this.alreadyAddedAuthors = data.alreadyAddedAuthors;
  }

  ngOnInit(): void {
    this.searchControl = new FormControl('', [
      Validators.required,
      Validators.pattern('.*[\\S]+.*'),
    ]);
  }

  onSearchByString(): void {
    this.firstSearchDone = true;
    if (!this.searchLoading && this.searchControl.value.trim() !== '') {
      this.searchLoading = true;
      this.cabinetService.findNewAuthors(this.searchControl.value).subscribe({
        next: (authors) => {
          authors = authors.filter(
            (item) => !this.alreadyAddedAuthors.map((author) => author.id).includes(item.id),
          );
          this.authors = authors;
          this.selection.clear();
          this.cachedSubject.next(true);
          this.searchLoading = false;
        },
        error: () => {
          this.searchLoading = false;
        },
      });
    }
  }

  onAdd(): void {
    this.loading = true;
    if (this.selection.selected.length) {
      const author = this.selection.selected.pop();
      this.cabinetService
        .createAutorship({
          authorship: {
            id: 0,
            beanName: 'Authorship',
            publicationId: this.publicationId,
            userId: author.id,
          },
        })
        .subscribe({
          next: () => {
            this.onAdd();
          },
          error: () => (this.loading = false),
        });
    } else {
      this.notificator.showSuccess(this.successMessage);
      this.loading = false;
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
